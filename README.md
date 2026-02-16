# PleniExam - Comprehensive Examination Management System

A complete examination application built with Ionic React frontend, Node.js/Express backend, MongoDB database, featuring JWT authentication and role-based access control.

## Overview

PleniExam is a full-stack web application designed to manage examinations for educational institutions. It supports three user roles (Candidate, Instructor, Admin) with distinct features and permissions.

## Features

### Authentication & Authorization
- User registration and login
- JWT-based authentication
- Role-based access control (Candidate, Instructor, Admin)
- Secure password hashing with bcrypt
- Token refresh mechanism
- Protected routes and API endpoints

### Candidate Features
- View available exams
- Take exams with countdown timer
- Auto-save answers
- Submit exams
- View exam results and history
- Personal statistics dashboard

### Instructor Features
- Create and manage exams
- Add multiple question types:
  - Multiple Choice Questions (MCQ)
  - True/False questions
  - Essay questions
- Set exam duration and passing marks
- Schedule exams
- View student submissions
- Grade essay questions manually
- View exam analytics

### Admin Features
- Complete user management (CRUD)
- User role assignment
- Activate/deactivate accounts
- View all exams
- System-wide analytics
- Manage instructors and candidates

## Tech Stack

### Frontend
- **Framework**: Ionic React
- **Build Tool**: Vite
- **Language**: TypeScript
- **Routing**: React Router
- **HTTP Client**: Axios
- **State Management**: React Context API

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcryptjs, helmet, cors, express-rate-limit
- **Validation**: express-validator

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Bwesun/pleniExam.git
cd pleniExam
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your configuration
# MONGODB_URI=mongodb://localhost:27017/pleniexam
# JWT_SECRET=your_secret_here
# PORT=5000

# Start MongoDB (if running locally)
mongod

# Run the backend
npm run dev
```

The backend will start on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with backend URL
# VITE_API_URL=http://localhost:5000/api
# VITE_API_BASE_URL=http://localhost:5000

# Run the frontend
npm run dev
```

The frontend will start on `http://localhost:3000`

## Project Structure

```
pleniExam/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── server.js
│   ├── .env.example
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── context/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── public/
│   ├── .env.example
│   ├── package.json
│   └── README.md
├── LICENSE
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout user

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `PUT /api/users/:id/role` - Update user role
- `PUT /api/users/:id/status` - Update user status

### Exams
- `POST /api/exams` - Create exam (Instructor/Admin)
- `GET /api/exams` - Get exams (role-filtered)
- `GET /api/exams/:id` - Get exam by ID
- `PUT /api/exams/:id` - Update exam
- `DELETE /api/exams/:id` - Delete exam
- `GET /api/exams/:id/questions` - Get exam questions

### Submissions
- `POST /api/submissions/start` - Start exam (Candidate)
- `PUT /api/submissions/:id/answer` - Save answer
- `POST /api/submissions/:id/submit` - Submit exam
- `GET /api/submissions/my-results` - Get candidate results
- `GET /api/submissions/exam/:examId` - Get exam submissions (Instructor/Admin)
- `PUT /api/submissions/:id/grade` - Grade essay (Instructor/Admin)
- `GET /api/submissions/:id` - Get submission by ID

## Default User Roles

After registration, users can select their role:
- **Candidate** (default): Can take exams and view results
- **Instructor**: Can create exams and grade submissions
- **Admin**: Full system access (typically assigned by another admin)

## Security Features

- Password hashing with bcrypt (10 rounds)
- JWT token authentication
- Role-based authorization middleware
- Rate limiting on authentication endpoints
- Secure HTTP headers (helmet.js)
- CORS configuration
- Input validation and sanitization
- MongoDB injection prevention

## Database Models

### User
- Username, email, password (hashed)
- Role (candidate, instructor, admin)
- First name, last name
- Active status
- Timestamps

### Exam
- Title, description, subject
- Instructor reference
- Duration, total marks, passing percentage
- Questions array
- Active status
- Scheduled start/end times
- Question randomization option

### Question
- Exam reference
- Question text and type
- Options (for MCQ)
- Correct answer
- Marks, order

### Submission
- Exam and candidate references
- Answers array with marks
- Total score and percentage
- Status (in-progress, submitted, graded)
- Timestamps

## Testing

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm test
```

## Deployment

### Backend Deployment
1. Set up MongoDB Atlas or other MongoDB hosting
2. Update environment variables for production
3. Deploy to hosting service (Heroku, AWS, DigitalOcean, etc.)
4. Set `NODE_ENV=production`

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy the `build` folder to hosting service (Netlify, Vercel, AWS S3, etc.)
3. Update `VITE_API_URL` to production backend URL

## Development Guidelines

1. **Code Style**: Follow TypeScript/JavaScript best practices
2. **Commits**: Use descriptive commit messages
3. **Branches**: Create feature branches for new functionality
4. **Testing**: Write tests for new features
5. **Documentation**: Update documentation for significant changes

## Troubleshooting

### Backend Issues
- **Database Connection**: Ensure MongoDB is running and connection string is correct
- **Port Conflicts**: Change PORT in .env if 5000 is already in use
- **JWT Errors**: Verify JWT_SECRET is set in environment variables

### Frontend Issues
- **API Connection**: Check VITE_API_URL in .env
- **CORS Errors**: Ensure backend CORS is properly configured
- **Build Errors**: Clear node_modules and reinstall dependencies

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For issues and questions:
- Create an issue on GitHub
- Check existing documentation in backend/README.md and frontend/README.md

## Acknowledgments

- Ionic Framework for the excellent UI components
- Express.js community for robust backend framework
- MongoDB for flexible database solution

---

Built with ❤️ for education and examination management.
