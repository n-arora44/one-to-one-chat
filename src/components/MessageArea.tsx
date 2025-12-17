import React, { useState, useRef, useEffect } from 'react';
import { Conversation, Message } from '../utils/supabase';

interface MessageAreaProps {
  conversation: Conversation | null;
  messages: Message[];
  onSendMessage: (content: string) => void;
  currentUserId: string;
}

const MessageArea: React.FC<MessageAreaProps> = ({
  conversation,
  messages,
  onSendMessage,
  currentUserId,
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && conversation) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  if (!conversation) {
    return (
      <div className="chat-area" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center', color: '#666' }}>
          <h3>Select a conversation to start messaging</h3>
          <p>Choose a conversation from the sidebar or search for users to start a new chat.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-area">
      <div style={{ padding: '20px', borderBottom: '1px solid #e9ecef', background: '#f8f9fa' }}>
        <h4 style={{ margin: 0 }}>Chat</h4>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#666', marginTop: '50px' }}>
            <p>No messages yet. Send the first message!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              style={{
                alignSelf: message.sender_id === currentUserId ? 'flex-end' : 'flex-start',
                maxWidth: '70%',
                background: message.sender_id === currentUserId ? '#007bff' : '#f1f3f4',
                color: message.sender_id === currentUserId ? 'white' : 'black',
                padding: '10px 15px',
                borderRadius: '18px',
                wordWrap: 'break-word',
              }}
            >
              <div>{message.content}</div>
              <div
                style={{
                  fontSize: '11px',
                  opacity: 0.7,
                  marginTop: '5px',
                  textAlign: message.sender_id === currentUserId ? 'right' : 'left',
                }}
              >
                {new Date(message.created_at).toLocaleTimeString()}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSendMessage}
        style={{
          padding: '20px',
          borderTop: '1px solid #e9ecef',
          display: 'flex',
          gap: '10px',
        }}
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: '12px',
            border: '2px solid #e1e5e9',
            borderRadius: '25px',
            fontSize: '16px',
          }}
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          style={{
            padding: '12px 20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
            opacity: newMessage.trim() ? 1 : 0.6,
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default MessageArea;
