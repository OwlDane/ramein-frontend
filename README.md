# Ramein Frontend

A modern event management platform built with Next.js, TypeScript, and Tailwind CSS.

## Features

### Authentication System
- **User Registration**: Complete user registration with email, password, and profile information
- **User Login**: Secure login with email and password
- **Password Reset**: Forgot password functionality with email reset links
- **Email Verification**: Email verification system for new accounts
- **Session Management**: JWT-based authentication with automatic token refresh

### Event Management
- **Event Discovery**: Browse and search through available events
- **Event Registration**: Register for events with automatic token generation
- **Attendance Tracking**: Mark attendance using generated tokens
- **Certificate System**: Automatic certificate generation and download
- **Event History**: Track your event participation history

### PWA Features
- **Offline Support**: Service worker for offline functionality
- **Install Prompt**: Add to home screen functionality
- **Push Notifications**: Real-time event updates
- **Background Sync**: Sync data when connection is restored

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   
   Update the following variables:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/                    # Next.js 13+ app directory
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   ├── dashboard/        # User dashboard
│   ├── forgot-password/  # Password reset request
│   ├── reset-password/   # Password reset confirmation
│   ├── about/            # About page
│   ├── contact/          # Contact page
│   ├── faq/              # FAQ page
│   ├── terms/            # Terms of service
│   └── privacy/          # Privacy policy
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── event/            # Event-related components
│   ├── gallery/          # Gallery components
│   └── ...               # Other component categories
├── contexts/              # React contexts
│   └── AuthContext.tsx   # Authentication context
├── lib/                   # Utility libraries
│   ├── api.ts            # API client
│   └── auth.ts           # Authentication API functions
├── types/                 # TypeScript type definitions
│   ├── user.ts           # User-related types
│   └── event.ts          # Event-related types
└── styles/                # Global styles
    └── globals.css       # Global CSS with CSS variables
```

## Authentication Flow

### 1. User Registration
1. User fills out registration form
2. System validates input and creates account
3. Verification email is sent
4. User verifies email to activate account

### 2. User Login
1. User enters email and password
2. System validates credentials
3. JWT token is generated and stored
4. User is redirected to dashboard

### 3. Password Reset
1. User requests password reset
2. Reset link is sent via email
3. User clicks link and sets new password
4. Password is updated and user can login

## API Integration

The frontend integrates with the Ramein backend API. Key endpoints include:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset confirmation
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/logout` - User logout

## Styling

The project uses Tailwind CSS with a custom design system:

- **Color Scheme**: Primary, secondary, accent, and neutral colors
- **Typography**: Responsive font sizes with CSS custom properties
- **Spacing**: Consistent spacing scale using Tailwind's spacing utilities
- **Components**: Reusable component library with consistent styling

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
