# PleniExam Frontend

Frontend application for PleniExam - A comprehensive examination management system built with Ionic React and TypeScript.

## Features

- **Authentication**
  - User login and registration
  - JWT token-based authentication
  - Automatic token refresh
  - Role-based access control

- **Candidate Features**
  - View available exams
  - Take exams with timer
  - View exam results and history
  - Profile management

- **Instructor Features**
  - Create and manage exams
  - Add multiple question types (MCQ, True/False, Essay)
  - View student submissions
  - Grade essay questions
  - View exam analytics

- **Admin Features**
  - User management (CRUD operations)
  - Exam management
  - System settings
  - View statistics

## Tech Stack

- **Framework**: Ionic React
- **Build Tool**: Vite
- **Language**: TypeScript
- **Routing**: React Router
- **HTTP Client**: Axios
- **State Management**: React Context API
- **UI Components**: Ionic Components

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your backend API URL:
```env
VITE_API_URL=http://localhost:5000/api
VITE_API_BASE_URL=http://localhost:5000
```

See `.env.example` for all available environment variables.

## Running the Application

### Development Mode:
```bash
npm run dev
```

The application will start on `http://localhost:3000`

### Build for Production:
```bash
npm run build
```

### Preview Production Build:
```bash
npm run preview
```

### Lint Code:
```bash
npm run lint
```

## Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   └── PrivateRoute.tsx
│   │   ├── candidate/
│   │   │   ├── CandidateDashboard.tsx
│   │   │   ├── ExamList.tsx
│   │   │   └── ExamResults.tsx
│   │   ├── instructor/
│   │   │   └── InstructorDashboard.tsx
│   │   ├── admin/
│   │   │   ├── AdminDashboard.tsx
│   │   │   └── UserManagement.tsx
│   │   └── common/
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       └── Loading.tsx
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.service.ts
│   │   ├── exam.service.ts
│   │   ├── user.service.ts
│   │   └── submission.service.ts
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   └── index.tsx
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── ionic.config.json
```

## Available Routes

### Public Routes
- `/login` - User login
- `/register` - User registration

### Candidate Routes
- `/candidate/dashboard` - Candidate dashboard
- `/candidate/exams` - Available exams list
- `/candidate/results` - Exam results

### Instructor Routes
- `/instructor/dashboard` - Instructor dashboard
- `/instructor/create-exam` - Create new exam
- `/instructor/exams` - My exams list

### Admin Routes
- `/admin/dashboard` - Admin dashboard
- `/admin/users` - User management
- `/admin/exams` - Exam management

## Key Components

### AuthContext
Global authentication state management with login, register, and logout functionality.

### PrivateRoute
Route protection component that checks authentication and role-based access.

### Services
- **api.ts**: Axios instance with interceptors for token management
- **auth.service.ts**: Authentication API calls
- **exam.service.ts**: Exam management API calls
- **user.service.ts**: User management API calls
- **submission.service.ts**: Exam submission API calls

## Styling

The application uses Ionic's built-in CSS utilities and components for a consistent, mobile-first design.

## Development Tips

1. **Hot Module Replacement (HMR)**: Vite provides instant HMR for rapid development.

2. **Component Development**: Use Ionic components for consistent UI/UX across devices.

3. **API Integration**: All API calls go through the centralized `api.ts` service with automatic token handling.

4. **Error Handling**: Use IonToast for user-friendly error messages.

5. **Loading States**: Always show loading indicators for async operations.

6. **Environment Variables**: Access environment variables using `import.meta.env.VITE_*` instead of `process.env.REACT_APP_*`.

## Environment Variables

All environment variables must be prefixed with `VITE_` to be accessible in the application:

- `VITE_API_URL`: Backend API base URL (default: http://localhost:5000/api)
- `VITE_API_BASE_URL`: Backend base URL (default: http://localhost:5000)
- `VITE_APP_NAME`: Application name (default: PleniExam)
- `VITE_APP_VERSION`: Application version (default: 1.0.0)
- `VITE_TOKEN_KEY`: LocalStorage key for access token (default: pleniexam_token)
- `VITE_REFRESH_TOKEN_KEY`: LocalStorage key for refresh token (default: pleniexam_refresh_token)
- `VITE_USER_KEY`: LocalStorage key for user data (default: pleniexam_user)
- `VITE_DEFAULT_EXAM_DURATION`: Default exam duration in minutes (default: 60)
- `VITE_AUTO_SAVE_INTERVAL`: Auto-save interval in milliseconds (default: 30000)
- `VITE_ITEMS_PER_PAGE`: Pagination page size (default: 10)
- `VITE_ENABLE_DARK_MODE`: Enable dark mode support (default: true)
- `VITE_ENABLE_NOTIFICATIONS`: Enable notifications (default: true)
- `VITE_ENABLE_ANALYTICS`: Enable analytics (default: false)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT License
