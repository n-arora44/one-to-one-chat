# One-to-One Chat Application

A secure, encrypted one-to-one chat application built with React and Supabase. This project uses $0 hosting solutions - GitHub Pages for the frontend and Supabase for the backend.

## Features

- ✅ User registration and authentication
- ✅ Real-time messaging with WebSocket connections
- ✅ Conversation management
- ✅ Message storage and retrieval
- 🔄 Encryption at rest (planned)
- 🔄 Additional security enhancements (planned)

## Tech Stack ($0 Budget)

### Frontend
- **React** with TypeScript
- **React Router** for navigation
- Hosted on **GitHub Pages** (free)

### Backend & Database
- **Supabase** (free tier)
  - PostgreSQL database
  - Authentication
  - Real-time subscriptions
  - Row Level Security (RLS)

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Note down your project URL and anon key from Settings > API

### 2. Set Up the Database

1. In your Supabase dashboard, go to the SQL Editor
2. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
3. Run the SQL to create all tables, policies, and triggers

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
REACT_APP_SUPABASE_URL=your-supabase-project-url
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Start Development Server

```bash
npm start
```

The app will run on `http://localhost:3000`

### 6. Deploy to GitHub Pages

1. Create a new repository on GitHub
2. Push your code to the repository
3. Update the `homepage` field in `package.json` with your GitHub Pages URL:
   ```json
   "homepage": "https://yourusername.github.io/your-repo-name"
   ```
4. Deploy using GitHub Actions or manually:
   ```bash
   npm run build
   npm run deploy
   ```

## Database Schema

### Tables

- **users**: User profiles (extends auth.users)
- **conversations**: One-to-one chat rooms
- **messages**: Chat messages with encryption flag

### Security Features

- Row Level Security (RLS) enabled on all tables
- Users can only access their own conversations and messages
- Authentication required for all operations

## Development Roadmap

### Phase 1 (Current)
- [x] Basic project setup
- [x] User authentication
- [x] Conversation management
- [x] Real-time messaging
- [x] GitHub Pages deployment

### Phase 2 (Next)
- [ ] Message encryption at rest
- [ ] File/image sharing
- [ ] Message reactions and replies
- [ ] Online/offline status

### Phase 3 (Future)
- [ ] End-to-end encryption
- [ ] Message self-destruction
- [ ] Group chats
- [ ] Push notifications

## Security Considerations

- All data is encrypted in transit (HTTPS)
- Row Level Security prevents unauthorized access
- Authentication required for all operations
- Future: End-to-end encryption for messages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For issues and questions, please create an issue in the GitHub repository.
