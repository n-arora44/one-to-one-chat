import React, { useState } from 'react';
import { supabase } from '../utils/supabase';

interface UserSearchProps {
  onUserSelect: (userId: string) => void;
}

interface User {
  id: string;
  username: string;
  email: string;
}

const UserSearch: React.FC<UserSearchProps> = ({ onUserSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const searchUsers = async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, email')
        .or(`username.ilike.%${term}%,email.ilike.%${term}%`)
        .limit(10);

      if (error) {
        console.error('Error searching users:', error);
      } else {
        setSearchResults(data || []);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    searchUsers(term);
  };

  const handleUserClick = (userId: string) => {
    onUserSelect(userId);
    setSearchTerm('');
    setSearchResults([]);
  };

  return (
    <div style={{ padding: '20px', borderBottom: '1px solid #e9ecef' }}>
      <h4 style={{ margin: '0 0 15px 0' }}>Start New Chat</h4>
      <input
        type="text"
        placeholder="Search users by username or email..."
        value={searchTerm}
        onChange={handleSearchChange}
        style={{
          width: '100%',
          padding: '10px',
          border: '2px solid #e1e5e9',
          borderRadius: '8px',
          fontSize: '14px',
          marginBottom: '10px',
        }}
      />

      {loading && <div style={{ textAlign: 'center', padding: '10px' }}>Searching...</div>}

      {searchResults.length > 0 && (
        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
          {searchResults.map((user) => (
            <div
              key={user.id}
              onClick={() => handleUserClick(user.id)}
              style={{
                padding: '10px',
                borderBottom: '1px solid #f0f0f0',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <div style={{ fontWeight: 'bold' }}>{user.username}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>{user.email}</div>
            </div>
          ))}
        </div>
      )}

      {searchTerm && !loading && searchResults.length === 0 && (
        <div style={{ textAlign: 'center', padding: '10px', color: '#666' }}>
          No users found
        </div>
      )}
    </div>
  );
};

export default UserSearch;
