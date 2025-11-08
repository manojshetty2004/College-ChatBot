# DBIT Chat Bot

An AI-powered intelligent chatbot platform for DBIT College that provides instant access to academic schedules, course details, faculty information, campus events, and official notices.

## 🚀 Features

### Core Functionality
- **AI-Powered Chat Interface**: Natural language processing for intelligent responses using Lovable AI
- **Real-time Messaging**: WebSocket-based instant communication with typing indicators
- **Anonymous & Authenticated Sessions**: Support for guest users and registered accounts with secure session tokens
- **Multi-Category Support**: Academic, administrative, technical queries with smart routing
- **File Upload Support**: Document processing and querying with 10MB limit
- **Chat History**: Persistent conversation tracking for authenticated users
- **Quick Actions**: Pre-defined common queries for faster access

### User Management
- **Role-Based Access Control**: Student, Faculty, Staff, and Admin roles with granular permissions
- **User Authentication**: Secure login with email/password via Supabase Auth
- **Profile Management**: Customizable user profiles with avatars, department, and year information
- **Session Management**: Automatic token refresh and session expiration warnings
- **Password Security**: Minimum 8 characters with uppercase, lowercase, and numbers

### Admin Features
- **Analytics Dashboard**: User metrics, message statistics, and system performance insights
- **Content Management**: Knowledge base and FAQ management with categories
- **User Management**: Role assignment and account administration
- **Event & Announcement Management**: Campus-wide notifications with priority levels
- **Audit Logging**: Complete activity tracking for security and compliance
- **Feedback Analytics**: View and analyze user feedback on bot responses

### Security
- **Row-Level Security (RLS)**: Database-level access control for all tables
- **Session Token Protection**: Secure anonymous user sessions with UUID-based tokens
- **Input Validation**: Comprehensive validation using Zod schemas
- **XSS Protection**: Input sanitization and output encoding
- **Error Boundaries**: Graceful error handling with user-friendly messages
- **CSRF Protection**: Built-in with Supabase Auth

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **Tailwind CSS** with semantic design tokens
- **shadcn/ui** for accessible UI components
- **React Router v6** for client-side routing
- **TanStack Query** for efficient data fetching and caching

### Backend
- **Supabase** for:
  - PostgreSQL database with Row-Level Security
  - Authentication with email/password
  - Real-time subscriptions for live chat
  - Storage for avatars and chat attachments
  - Edge Functions for serverless logic

### AI Integration
- **Lovable AI** for intelligent response generation and context-aware conversations

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dbit-chatbot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file with:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   VITE_SUPABASE_PROJECT_ID=your_project_id
   ```

4. **Run database migrations**
   - Access your Supabase dashboard
   - Go to SQL Editor
   - Run migrations from `supabase/migrations/` directory in order

5. **Configure Supabase Auth**
   - Enable Email provider in Authentication → Providers
   - Configure email templates (optional)
   - Enable Leaked Password Protection (recommended)

6. **Start development server**
   ```bash
   npm run dev
   ```
   Application will be available at `http://localhost:8080`

## 🔐 Security Configuration

### 1. Enable Leaked Password Protection
1. Go to Supabase Dashboard → Authentication → Policies
2. Enable "Leaked Password Protection"
3. This prevents users from using compromised passwords from data breaches

### 2. Configure Admin Access
To set a user as admin, run this SQL query after they register:
```sql
UPDATE user_roles 
SET role = 'admin' 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'admin@example.com');
```

### 3. Storage Bucket Configuration
Verify storage buckets are properly configured:
- `avatars`: Public bucket for user profile pictures
- `chat-attachments`: Private bucket for document uploads (10MB limit)

### 4. Session Token Security
Anonymous users are assigned secure session tokens that:
- Are stored in localStorage
- Are validated via RLS policies
- Expire when cleared manually
- Prevent unauthorized access to other users' conversations

## 📱 Usage

### For Students/Faculty
1. **Guest Access**
   - Visit the homepage at `/`
   - Click "Start Chatting" to begin immediately as a guest
   - Your conversation is secured with a session token
   
2. **Registered User Access**
   - Sign up at `/signup` with your college email
   - Verify your email (if enabled)
   - Access additional features:
     - Chat history across sessions
     - Profile customization
     - File uploads for document queries
     - Personalized recommendations

### For Administrators
1. **Initial Setup**
   - Register a normal account
   - Have another admin promote your account via SQL query
   - Or manually update the `user_roles` table

2. **Admin Dashboard** (`/admin`)
   - View analytics and system metrics
   - Manage knowledge base content
   - Create and schedule announcements
   - Manage campus events
   - Assign user roles
   - Review audit logs
   - Monitor user feedback

## 🏗️ Project Structure

```
dbit-chatbot/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── admin/          # Admin-specific components
│   │   │   ├── AdminAnalytics.tsx
│   │   │   ├── AdminUsers.tsx
│   │   │   ├── AdminKnowledgeBase.tsx
│   │   │   ├── AdminEvents.tsx
│   │   │   └── AdminAnnouncements.tsx
│   │   ├── chat/           # Chat interface components
│   │   │   ├── ChatHeader.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   ├── ChatSidebar.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── QuickActions.tsx
│   │   │   └── TypingIndicator.tsx
│   │   ├── ui/             # shadcn/ui components
│   │   ├── ErrorBoundary.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── PermissionGuard.tsx
│   │   └── SessionWarning.tsx
│   ├── contexts/           # React contexts
│   │   ├── AuthContext.tsx
│   │   └── ChatContext.tsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useProtectedRoute.ts
│   │   ├── useRole.ts
│   │   ├── useSession.ts
│   │   ├── useTypingIndicator.ts
│   │   └── useRealtimeMessages.ts
│   ├── pages/              # Page components
│   │   ├── Index.tsx
│   │   ├── Chat.tsx
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   ├── Profile.tsx
│   │   ├── Admin.tsx
│   │   ├── FAQ.tsx
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   └── NotFound.tsx
│   ├── services/           # API and business logic
│   │   ├── api.ts          # Base API utilities
│   │   ├── auth.ts         # Authentication service
│   │   ├── chatService.ts  # Chat operations
│   │   ├── aiService.ts    # AI integration
│   │   ├── userService.ts  # User management
│   │   ├── adminService.ts # Admin operations
│   │   ├── fileService.ts  # File upload/download
│   │   ├── cacheService.ts # Client-side caching
│   │   └── knowledgeBaseService.ts
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/              # Utility functions
│   │   ├── validation.ts   # Zod validation schemas
│   │   └── sessionToken.ts # Session management
│   ├── index.css           # Global styles and design tokens
│   ├── App.tsx             # Root component with routing
│   └── main.tsx            # Application entry point
├── supabase/
│   ├── functions/          # Edge Functions
│   │   └── chat-ai/        # AI chat integration
│   └── migrations/         # Database migrations
├── public/                 # Static assets
├── .env                    # Environment variables
├── tailwind.config.ts      # Tailwind configuration
├── vite.config.ts          # Vite configuration
└── package.json            # Dependencies and scripts
```

## 🔧 Configuration

### Tailwind Design System
The application uses semantic design tokens defined in:

**`src/index.css`** - CSS variables for colors, spacing, and animations:
```css
:root {
  --primary: 221 83% 53%;     /* Blue */
  --secondary: 215 16% 47%;    /* Slate Gray */
  --accent: 160 84% 39%;       /* Emerald */
  --background: 210 40% 98%;   /* Light Gray */
  /* ... more tokens */
}
```

**`tailwind.config.ts`** - Tailwind configuration with custom plugins and theme extensions

### Environment Variables
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Supabase anonymous key
- `VITE_SUPABASE_PROJECT_ID` - Supabase project identifier

### Performance Optimizations
- **Code Splitting**: Automatic route-based code splitting with React.lazy()
- **Image Optimization**: WebP format with lazy loading
- **Caching**: Client-side caching for frequently accessed data
- **Database Indexes**: Optimized queries with proper indexing
- **Bundle Size**: Tree-shaking and minification in production

## 📊 Database Schema

### Core Tables

#### `profiles`
User profile information
- `id` (uuid, PK)
- `name` (text)
- `student_id` (text, unique)
- `phone` (text)
- `department` (text)
- `year` (integer)
- `avatar_url` (text)

#### `user_roles`
Role-based access control
- `id` (uuid, PK)
- `user_id` (uuid, FK)
- `role` (app_role enum: student, faculty, staff, admin)

#### `conversations`
Chat conversations
- `id` (uuid, PK)
- `user_id` (uuid, FK, nullable)
- `session_token` (text, for anonymous users)
- `title` (text)
- `is_active` (boolean)

#### `messages`
Chat messages
- `id` (uuid, PK)
- `conversation_id` (uuid, FK)
- `content` (text)
- `sender_type` (text: user, bot, system)
- `attachments` (text[])

#### `knowledge_base`
FAQ and knowledge articles
- `id` (uuid, PK)
- `category` (text)
- `question` (text)
- `answer` (text)
- `keywords` (text[])

#### `events`
Campus events
- `id` (uuid, PK)
- `title` (text)
- `description` (text)
- `date` (timestamptz)
- `location` (text)
- `category` (text)

#### `announcements`
Official notices
- `id` (uuid, PK)
- `title` (text)
- `content` (text)
- `priority` (text: low, medium, high, urgent)
- `publish_date` (timestamptz)
- `expires_at` (timestamptz, nullable)

#### `feedback`
User feedback on bot responses
- `id` (uuid, PK)
- `message_id` (uuid, FK)
- `rating` (integer)
- `comment` (text)

#### `audit_logs`
System activity logs
- `id` (uuid, PK)
- `user_id` (uuid)
- `action` (text)
- `resource_type` (text)
- `resource_id` (uuid)
- `details` (jsonb)

### Storage Buckets
- **`avatars`** - User profile pictures (public, 5MB limit)
- **`chat-attachments`** - Document uploads (private, 10MB limit)

### Database Functions
- `handle_new_user()` - Trigger to create profile on user registration
- `has_role()` - Security definer function for role checking
- `log_admin_action()` - Audit logging for admin actions
- `handle_updated_at()` - Automatic timestamp updates

## 🚀 Deployment

### Frontend Deployment (Lovable)
1. **Via Lovable Platform**:
   - Click "Publish" in the Lovable editor
   - Your app will be deployed to `*.lovable.app`
   - Connect a custom domain in Settings → Domains

2. **Manual Deployment**:
   ```bash
   npm run build
   ```
   Deploy the `dist/` folder to:
   - Vercel
   - Netlify
   - Cloudflare Pages
   - Any static hosting provider

### Backend Configuration
- **Edge Functions**: Deploy automatically to Supabase
- **Database Migrations**: Run manually via Supabase dashboard
- **Environment Variables**: Set in hosting platform settings

### Post-Deployment Checklist
- [ ] Verify environment variables
- [ ] Run all database migrations
- [ ] Enable Leaked Password Protection
- [ ] Configure email templates
- [ ] Set up admin accounts
- [ ] Test authentication flow
- [ ] Verify file upload functionality
- [ ] Check real-time messaging
- [ ] Test role-based access control

## 🧪 Testing

### Manual Testing Checklist

**Authentication**
- [ ] User registration with email
- [ ] Email verification (if enabled)
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Password reset flow
- [ ] Session persistence
- [ ] Automatic logout on expiration

**Chat Functionality**
- [ ] Guest chat with session token
- [ ] Authenticated user chat
- [ ] Message sending and receiving
- [ ] Real-time updates
- [ ] File upload and processing
- [ ] Quick actions
- [ ] Chat history (authenticated users)
- [ ] Clear chat functionality

**Admin Features**
- [ ] Admin dashboard access
- [ ] Analytics display
- [ ] User management
- [ ] Role assignment
- [ ] Knowledge base CRUD
- [ ] Event management
- [ ] Announcement creation
- [ ] Audit log viewing

**Security**
- [ ] RLS policies enforcement
- [ ] Role-based access control
- [ ] Session token validation
- [ ] Input validation
- [ ] XSS prevention
- [ ] Anonymous user isolation

**Responsive Design**
- [ ] Mobile view (< 768px)
- [ ] Tablet view (768px - 1024px)
- [ ] Desktop view (> 1024px)
- [ ] Navigation menu responsiveness
- [ ] Chat interface on mobile

**Cross-Browser Compatibility**
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

## 🔍 Monitoring and Maintenance

### Performance Monitoring
Use these tools for monitoring:
- **Supabase Dashboard**: Database query performance, auth metrics
- **Browser DevTools**: Network, performance profiling
- **Lighthouse**: Accessibility, performance, SEO scores

### Key Metrics to Monitor
- Database query response times
- Edge function execution times
- Storage usage
- Authentication success/failure rates
- Chat message volume
- User engagement metrics

### Error Tracking
- Client-side: Error Boundaries catch and display user-friendly messages
- Server-side: Edge Function logs in Supabase dashboard
- Admin: Audit logs for system activities

### Regular Maintenance Tasks
- **Weekly**:
  - Review audit logs
  - Monitor system performance
  - Check for failed edge function calls
  
- **Monthly**:
  - Update knowledge base content
  - Review and respond to user feedback
  - Optimize slow database queries
  - Update dependencies
  
- **Quarterly**:
  - Database backup verification
  - Security audit
  - Performance optimization review
  - User acceptance testing

## 🐛 Troubleshooting

### Common Issues

**1. "New row violates row-level security policy"**
- **Cause**: User trying to access data they don't have permission for
- **Solution**: Verify RLS policies and ensure user_id is set correctly

**2. Session token not working for anonymous users**
- **Cause**: Session token not being sent in headers
- **Solution**: Check that `getSessionToken()` is called and token is persisted

**3. Messages not appearing in real-time**
- **Cause**: Realtime subscription not set up correctly
- **Solution**: Verify that `messages` table is in `supabase_realtime` publication

**4. File upload failing**
- **Cause**: File size exceeds limit or invalid file type
- **Solution**: Check file size (<10MB) and allowed MIME types

**5. Admin dashboard not accessible**
- **Cause**: User doesn't have admin role
- **Solution**: Update user_roles table to assign admin role

## 📝 API Documentation

### Chat Service
```typescript
// Create conversation
chatService.createConversation(title: string)

// Send message
chatService.createMessage({
  conversation_id: string,
  content: string,
  sender_type: 'user' | 'bot' | 'system',
  attachments?: string[]
})

// Get messages
chatService.getMessages(conversationId: string)
```

### Auth Service
```typescript
// Sign up
auth.signUp(email, password, name, studentId, role)

// Sign in
auth.signIn(email, password)

// Sign out
auth.signOut()

// Reset password
auth.resetPassword(email)
```

### User Service
```typescript
// Get profile
userService.getProfile(userId)

// Update profile
userService.updateProfile(userId, updates)

// Upload avatar
userService.uploadAvatar(file)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

### Development Team
- **Project Lead**: [Name]
- **Backend Developer**: [Name]
- **Frontend Developer**: [Name]
- **UI/UX Designer**: [Name]

### Acknowledgments
- DBIT College for project support
- Lovable.dev for AI integration platform
- Supabase for backend infrastructure
- shadcn/ui for component library

## 📞 Support

### For Technical Support
- **Email**: support@dbit.edu
- **Contact Form**: `/contact` page in the application
- **Admin Support**: Contact via admin dashboard

### For Development Support
- **GitHub Issues**: Report bugs and feature requests
- **Documentation**: [Lovable Docs](https://docs.lovable.dev/)
- **Supabase Docs**: [Supabase Documentation](https://supabase.com/docs)

## 🔮 Future Enhancements

- [ ] Voice input for chat messages
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Integration with college ERP system
- [ ] Video call support for faculty consultations
- [ ] AI-powered content recommendations
- [ ] Advanced search with filters
- [ ] Export chat history
- [ ] Dark mode improvements

---

**Built with ❤️ for DBIT College**

*Powered by Lovable AI, Supabase, and React*
