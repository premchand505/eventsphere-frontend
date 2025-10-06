# 🎉 EventSphere Frontend

<p align="center">
  <strong>A modern event management platform built with Next.js</strong>
</p>

<p align="center">
  <a href="https://eventsphere-frontend.vercel.app">Live Demo</a> •
  <a href="#installation">Quick Start</a> •
  <a href="#features">Features</a> •
  <a href="#api-integration">API Docs</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14.2.3-black?logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-3.4.1-38B2AC?logo=tailwind-css" alt="Tailwind">
  <img src="https://img.shields.io/badge/Deployed-Vercel-000000?logo=vercel" alt="Vercel">
</p>

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Integration](#api-integration)
- [Components](#components)
- [State Management](#state-management)
- [Pages and Routes](#pages-and-routes)
- [Deployment](#deployment)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based auth with Google OAuth support
- 📅 **Event Management** - Create, browse, and manage events seamlessly
- 💳 **Stripe Payments** - Secure payment processing for paid events
- 💬 **Real-time Chat** - Live chat rooms for event attendees
- 📱 **Responsive Design** - Mobile-first approach with Tailwind CSS
- ⚡ **Optimized Performance** - Server-side rendering with Next.js App Router

---

## 🛠 Tech Stack

### Core Technologies
- **Next.js 14.2.3** - React framework with App Router
- **React 18+** - UI library
- **TypeScript 5.0+** - Type safety
- **Tailwind CSS 3.4.1** - Utility-first CSS

### State Management & Data Fetching
- **Zustand** - Client state management
- **TanStack Query** - Server state management
- **Axios** - HTTP client

### Forms & Validation
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Real-time & UI
- **Socket.io Client** - WebSocket connection
- **React Hot Toast** - Toast notifications

---

## 🚀 Installation

### Prerequisites
- Node.js 18.17 or later
- npm or yarn or pnpm
- Git

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/eventsphere-frontend.git
cd eventsphere-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

4. **Configure environment variables**
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

5. **Run the development server**
```bash
npm run dev
```

6. **Open browser**
   - Navigate to http://localhost:3001

---

## 📁 Project Structure

```
eventsphere-frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── auth/               # Authentication pages
│   │   │   └── callback/       # OAuth callback
│   │   ├── events/             # Event pages
│   │   │   ├── [id]/           # Event detail page
│   │   │   └── create/         # Create event page
│   │   ├── payment/            # Payment flow pages
│   │   │   ├── success/        # Payment success
│   │   │   └── cancel/         # Payment cancelled
│   │   ├── signin/             # Sign in page
│   │   ├── signup/             # Sign up page
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Homepage
│   ├── components/             # React components
│   │   ├── auth/               # Auth components
│   │   │   ├── SignInForm.tsx
│   │   │   └── SignUpForm.tsx
│   │   ├── chat/               # Chat components
│   │   │   └── ChatRoom.tsx
│   │   ├── events/             # Event components
│   │   │   └── CreateEventForm.tsx
│   │   ├── providers/          # Context providers
│   │   │   └── QueryProvider.tsx
│   │   ├── Navbar.tsx          # Navigation
│   │   └── SocketInitializer.tsx
│   ├── lib/                    # Utilities
│   │   └── api/                # API configuration
│   │       └── axios.ts
│   ├── stores/                 # Zustand stores
│   │   ├── authStore.ts        # Auth state
│   │   └── socketStore.ts      # Socket state
│   └── types/                  # TypeScript types
│       └── express.d.ts
├── public/                     # Static files
├── .env.local                  # Environment variables
├── .gitignore                  # Git ignore
├── next.config.mjs             # Next.js config
├── package.json                # Dependencies
├── tailwind.config.ts          # Tailwind config
└── tsconfig.json               # TypeScript config
```

---

## 🔧 Environment Variables

Create `.env.local` file in root directory:

```env
# Backend API URL
NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.com

# Add more environment variables as needed
```

---

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start development server on port 3001

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

---

## 🔌 API Integration

### Axios Configuration
Located in `lib/api/axios.ts`:

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Example API Calls

```typescript
// Fetch all events
const { data } = await api.get('/events');

// Create new event
const response = await api.post('/events', {
  title: 'New Event',
  description: 'Event description',
  location: 'Event location',
  date: new Date(),
  price: 0,
  capacity: 100
});

// Register for event
await api.post(`/events/${eventId}/register`);

// Get user profile
const user = await api.get('/users/me');
```

---

## 🎨 Components

### Core Components

| Component | Description | Location |
|-----------|-------------|----------|
| `Navbar` | Main navigation with auth status | `components/Navbar.tsx` |
| `SignInForm` | User authentication form | `components/auth/SignInForm.tsx` |
| `SignUpForm` | User registration form | `components/auth/SignUpForm.tsx` |
| `CreateEventForm` | Event creation form | `components/events/CreateEventForm.tsx` |
| `ChatRoom` | Real-time chat interface | `components/chat/ChatRoom.tsx` |
| `QueryProvider` | TanStack Query provider | `components/providers/QueryProvider.tsx` |
| `SocketInitializer` | WebSocket connection manager | `components/SocketInitializer.tsx` |

### Component Example

```typescript
// components/events/CreateEventForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const eventSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  location: z.string().min(3),
  date: z.string(),
  price: z.number().min(0),
  capacity: z.number().min(1),
});

export function CreateEventForm() {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(eventSchema),
  });

  const onSubmit = async (data) => {
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}
```

---

## 💾 State Management

### Zustand Store (authStore.ts)

```typescript
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
}));
```

### TanStack Query Usage

```typescript
// Example query
const { data, isLoading, error } = useQuery({
  queryKey: ['events'],
  queryFn: () => api.get('/events').then(res => res.data),
});

// Example mutation
const mutation = useMutation({
  mutationFn: (data) => api.post('/events', data),
  onSuccess: () => {
    queryClient.invalidateQueries(['events']);
    toast.success('Event created successfully!');
  },
  onError: (error) => {
    toast.error('Failed to create event');
  },
});
```

---

## 📱 Pages and Routes

| Route | Page | Description | Auth Required |
|-------|------|-------------|---------------|
| `/` | Home | List of all events | No |
| `/signin` | Sign In | User login | No |
| `/signup` | Sign Up | User registration | No |
| `/events/[id]` | Event Detail | Single event view | No |
| `/events/create` | Create Event | New event form | Yes |
| `/payment/success` | Payment Success | Successful payment | Yes |
| `/payment/cancel` | Payment Cancel | Cancelled payment | Yes |
| `/auth/callback` | OAuth Callback | OAuth redirect | No |

---

## 🚀 Deployment

### Deploy to Vercel

#### Option 1: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts
```

#### Option 2: Git Integration
1. Push code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Configure environment variables
6. Click "Deploy"

### Build Configuration

```javascript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['your-image-domain.com'],
  },
  // Add other configurations as needed
};

export default nextConfig;
```

### Production Checklist
- ✅ Set all environment variables in Vercel
- ✅ Enable HTTPS (automatic in Vercel)
- ✅ Configure custom domain (optional)
- ✅ Set up monitoring (Vercel Analytics)
- ✅ Test all features in production
- ✅ Set up error tracking (Sentry)

---

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

### Testing Libraries
- **Jest** - Testing framework
- **React Testing Library** - Component testing
- **MSW** - API mocking

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Development Guidelines
- Follow ESLint rules
- Write tests for new features
- Update documentation
- Keep commits atomic and descriptive

---

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">
  Made by me G Premchand
</p>