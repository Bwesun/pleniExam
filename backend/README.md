# PleniExam Backend API

Backend API for PleniExam - A comprehensive examination management system built with Node.js, Express, and MongoDB.

## Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Candidate, Instructor, Admin)
  - Secure password hashing with bcrypt
  - Token refresh mechanism

- **User Management**
  - User registration and login
  - Role assignment and management
  - Account activation/deactivation
  - User CRUD operations (Admin only)

- **Exam Management**
  - Create and manage exams
  - Multiple question types (MCQ, True/False, Essay)
  - Exam scheduling
  - Question randomization
  - Role-based exam access

- **Submission & Grading**
  - Start and take exams
  - Auto-save answers
  - Automatic grading for MCQ and True/False
  - Manual grading for essay questions
  - Results and analytics

## Tech Stack

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

1. Clone the repository:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pleniexam
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=24h
JWT_REFRESH_SECRET=your_refresh_secret_key_change_in_production
JWT_REFRESH_EXPIRE=7d
BCRYPT_ROUNDS=10
```

5. Make sure MongoDB is running:
```bash
# For local MongoDB
mongod
```

## Running the Application

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in .env)

## API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "role": "candidate",  // optional, defaults to "candidate"
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "johndoe",  // or email
  "password": "password123"
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <access_token>
```

#### Refresh Token
```
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "<refresh_token>"
}
```

#### Logout
```
POST /api/auth/logout
Authorization: Bearer <access_token>
```

### User Endpoints (Admin Only)

#### Get All Users
```
GET /api/users
Authorization: Bearer <access_token>
Query Parameters: ?role=candidate&isActive=true&search=john
```

#### Get User by ID
```
GET /api/users/:id
Authorization: Bearer <access_token>
```

#### Update User
```
PUT /api/users/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "username": "newusername",
  "email": "newemail@example.com",
  "firstName": "NewFirst",
  "lastName": "NewLast"
}
```

#### Delete User
```
DELETE /api/users/:id
Authorization: Bearer <access_token>
```

#### Update User Role
```
PUT /api/users/:id/role
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "role": "instructor"
}
```

#### Update User Status
```
PUT /api/users/:id/status
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "isActive": false
}
```

### Exam Endpoints

#### Create Exam (Instructor/Admin)
```
POST /api/exams
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Mathematics Final Exam",
  "description": "Final exam for Math course",
  "subject": "Mathematics",
  "duration": 60,
  "totalMarks": 100,
  "passingPercentage": 60,
  "scheduledStart": "2024-01-01T09:00:00Z",
  "scheduledEnd": "2024-01-01T18:00:00Z",
  "randomizeQuestions": true,
  "questions": [
    {
      "questionText": "What is 2+2?",
      "questionType": "mcq",
      "options": ["3", "4", "5", "6"],
      "correctAnswer": "4",
      "marks": 5
    }
  ]
}
```

#### Get All Exams
```
GET /api/exams
Authorization: Bearer <access_token>
Query Parameters: ?subject=Mathematics&isActive=true&search=final
```

#### Get Exam by ID
```
GET /api/exams/:id
Authorization: Bearer <access_token>
```

#### Update Exam (Instructor/Admin)
```
PUT /api/exams/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Updated Title",
  "duration": 90
}
```

#### Delete Exam (Instructor/Admin)
```
DELETE /api/exams/:id
Authorization: Bearer <access_token>
```

#### Get Exam Questions
```
GET /api/exams/:id/questions
Authorization: Bearer <access_token>
```

### Submission Endpoints

#### Start Exam (Candidate)
```
POST /api/submissions/start
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "examId": "exam_id_here"
}
```

#### Save Answer (Candidate)
```
PUT /api/submissions/:id/answer
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "questionId": "question_id_here",
  "answer": "4"
}
```

#### Submit Exam (Candidate)
```
POST /api/submissions/:id/submit
Authorization: Bearer <access_token>
```

#### Get My Results (Candidate)
```
GET /api/submissions/my-results
Authorization: Bearer <access_token>
```

#### Get Exam Submissions (Instructor/Admin)
```
GET /api/submissions/exam/:examId
Authorization: Bearer <access_token>
```

#### Grade Essay Question (Instructor/Admin)
```
PUT /api/submissions/:id/grade
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "questionId": "question_id_here",
  "marksObtained": 8
}
```

#### Get Submission by ID
```
GET /api/submissions/:id
Authorization: Bearer <access_token>
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js      # MongoDB connection
│   │   └── config.js        # App configuration
│   ├── models/
│   │   ├── User.js          # User model
│   │   ├── Exam.js          # Exam model
│   │   ├── Question.js      # Question model
│   │   └── Submission.js    # Submission model
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── exam.controller.js
│   │   └── submission.controller.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── exam.routes.js
│   │   └── submission.routes.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   └── validation.middleware.js
│   ├── utils/
│   │   ├── jwt.utils.js
│   │   └── password.utils.js
│   └── server.js            # Main application file
├── .env.example             # Example environment variables
├── package.json
└── README.md
```

## Security Features

- **Password Hashing**: Bcrypt with configurable rounds
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Prevents brute force attacks on auth endpoints
- **Helmet**: Sets secure HTTP headers
- **CORS**: Configurable cross-origin resource sharing
- **Input Validation**: Express-validator for request validation
- **Role-based Access Control**: Middleware for authorization

## Error Handling

The API uses standard HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

All responses follow this format:
```json
{
  "success": true/false,
  "message": "Description",
  "data": {} // or "errors": []
}
```

## Testing

To run tests:
```bash
npm test
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT License
