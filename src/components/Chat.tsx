import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';
import ConversationList from './ConversationList';
import MessageArea from './MessageArea';
import UserSearch from './UserSearch';
import { Conversation, Message } from '../utils/supabase';

const Chat: React.FC = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser();
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
      subscribeToMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const loadConversations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error loading conversations:', error);
      } else {
        setConversations(data || []);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
      } else {
        setMessages(data || []);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const subscribeToMessages = (conversationId: string) => {
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const startConversation = async (otherUserId: string) => {
    try {
      if (!user) return;

      // Check if conversation already exists
      const existingConversation = conversations.find(
        (conv) =>
          (conv.participant1_id === user.id && conv.participant2_id === otherUserId) ||
          (conv.participant1_id === otherUserId && conv.participant2_id === user.id)
      );

      if (existingConversation) {
        setSelectedConversation(existingConversation);
        return;
      }

      // Create new conversation
      const { data, error } = await supabase
        .from('conversations')
        .insert([
          {
            participant1_id: user.id,
            participant2_id: otherUserId,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating conversation:', error);
      } else {
        setConversations((prev) => [data, ...prev]);
        setSelectedConversation(data);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const sendMessage = async (content: string) => {
    try {
      if (!user || !selectedConversation) return;

      const { error } = await supabase.from('messages').insert([
        {
          conversation_id: selectedConversation.id,
          sender_id: user.id,
          content,
          is_encrypted: false, // Will implement encryption later
        },
      ]);

      if (error) {
        console.error('Error sending message:', error);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="chat-container">
      <div className="sidebar">
        <div style={{ padding: '20px', borderBottom: '1px solid #e9ecef' }}>
          <h3>Welcome, {user?.email}</h3>
          <button onClick={handleLogout} style={{ marginTop: '10px' }}>
            Logout
          </button>
        </div>
        <UserSearch onUserSelect={startConversation} />
        <ConversationList
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelectConversation={setSelectedConversation}
          currentUserId={user?.id || ''}
        />
      </div>
      <MessageArea
        conversation={selectedConversation}
        messages={messages}
        onSendMessage={sendMessage}
        currentUserId={user?.id || ''}
      />
    </div>
  );
};

export default Chat;
