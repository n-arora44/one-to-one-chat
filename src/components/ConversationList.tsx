import React from 'react';
import { Conversation } from '../utils/supabase';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  currentUserId: string;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversation,
  onSelectConversation,
  currentUserId,
}) => {
  const getOtherParticipantId = (conversation: Conversation) => {
    return conversation.participant1_id === currentUserId
      ? conversation.participant2_id
      : conversation.participant1_id;
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <h4 style={{ padding: '20px 20px 10px', margin: 0 }}>Conversations</h4>
      {conversations.length === 0 ? (
        <p style={{ padding: '20px', color: '#666' }}>
          No conversations yet. Search for users to start chatting!
        </p>
      ) : (
        conversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => onSelectConversation(conversation)}
            style={{
              padding: '15px 20px',
              borderBottom: '1px solid #e9ecef',
              cursor: 'pointer',
              backgroundColor:
                selectedConversation?.id === conversation.id ? '#e3f2fd' : 'transparent',
              transition: 'background-color 0.2s',
            }}
          >
            <div style={{ fontWeight: 'bold' }}>
              Chat with User {getOtherParticipantId(conversation)}
            </div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
              {new Date(conversation.updated_at).toLocaleDateString()}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ConversationList;
