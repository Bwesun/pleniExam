# PleniExam Setup Guide

Complete step-by-step guide to set up and run the PleniExam application.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Bwesun/pleniExam.git
cd pleniExam
```

### 2. Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your settings
# You can use nano, vim, or any text editor
nano .env
```

**Required Environment Variables:**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pleniexam
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=24h
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this
JWT_REFRESH_EXPIRE=7d
BCRYPT_ROUNDS=10
```

**Important**: Change the JWT secrets to secure random strings in production!

### 3. Setup MongoDB

#### Option A: Local MongoDB

Start MongoDB service:

**On macOS:**
```bash
brew services start mongodb-community
```

**On Ubuntu/Linux:**
```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```

**On Windows:**
```bash
net start MongoDB
```

#### Option B: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Update `MONGODB_URI` in backend `.env` file:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pleniexam?retryWrites=true&w=majority
```

### 4. Start Backend Server

```bash
# From backend directory
npm run dev
```

You should see:
```
Server running in development mode on port 5000
MongoDB Connected: localhost
```

### 5. Setup Frontend

Open a new terminal window:

```bash
# Navigate to frontend directory from project root
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env if needed (default is correct for local development)
nano .env
```

**Frontend Environment Variables:**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 6. Start Frontend Application

```bash
# From frontend directory
npm start
```

The application will open in your browser at `http://localhost:3000`

## Testing the Application

### 1. Register a New User

1. Go to `http://localhost:3000/register`
2. Fill in the registration form:
   - Username: testcandidate
   - Email: candidate@test.com
   - Password: password123
   - Role: Candidate
3. Click "Register"

### 2. Login

You'll be automatically redirected to the appropriate dashboard based on your role.

### 3. Create Test Users for Different Roles

**Instructor Account:**
- Register with role: "Instructor"
- Username: testinstructor
- Email: instructor@test.com

**Admin Account:**
- Register with role: "Candidate" first
- Then use MongoDB to manually change role to "admin"

```bash
# Connect to MongoDB
mongo pleniexam

# Update user role to admin
db.users.updateOne(
  { email: "admin@test.com" },
  { $set: { role: "admin" } }
)
```

Or register as instructor, then manually update in database to admin.

## Project Structure

```
pleniExam/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── models/         # MongoDB models
│   │   ├── controllers/    # Route controllers
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── utils/          # Utility functions
│   │   └── server.js       # Main server file
│   ├── .env.example        # Environment template
│   ├── .gitignore
│   ├── package.json
│   └── README.md
│
├── frontend/               # Ionic React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API services
│   │   ├── context/       # React context
│   │   ├── types/         # TypeScript types
│   │   ├── App.tsx        # Main app component
│   │   └── index.tsx      # Entry point
│   ├── .env.example       # Environment template
│   ├── .gitignore
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── .gitignore
├── LICENSE
├── README.md
├── SECURITY.md
└── SETUP.md (this file)
```

## Common Issues and Solutions

### Issue: MongoDB Connection Error

**Error:** `MongoNetworkError: failed to connect to server`

**Solutions:**
1. Ensure MongoDB is running:
   ```bash
   # Check MongoDB status
   brew services list  # macOS
   systemctl status mongod  # Linux
   ```

2. Check connection string in `.env`
3. Try connecting manually:
   ```bash
   mongo pleniexam
   ```

### Issue: Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solutions:**
1. Change port in backend `.env`:
   ```env
   PORT=5001
   ```

2. Or kill the process using the port:
   ```bash
   # Find process using port 5000
   lsof -ti:5000 | xargs kill -9
   ```

### Issue: CORS Error

**Error:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Solutions:**
1. Ensure backend is running
2. Check `REACT_APP_API_URL` in frontend `.env`
3. Backend CORS is already configured for local development

### Issue: JWT Token Invalid

**Error:** `Invalid or expired token`

**Solutions:**
1. Clear browser local storage
2. Logout and login again
3. Check JWT_SECRET in backend `.env`

### Issue: Frontend Build Error

**Error:** `Cannot find module` or TypeScript errors

**Solutions:**
1. Delete node_modules and reinstall:
   ```bash
   rm -rf node_modules
   npm install
   ```

2. Clear npm cache:
   ```bash
   npm cache clean --force
   npm install
   ```

## Development Workflow

### Backend Development

```bash
cd backend
npm run dev  # Starts with nodemon for auto-reload
```

### Frontend Development

```bash
cd frontend
npm start  # Starts with hot reload
```

### Testing API Endpoints

Use tools like:
- **Postman** - [Download](https://www.postman.com/)
- **Insomnia** - [Download](https://insomnia.rest/)
- **cURL** - Command line tool

Example API test:
```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "role": "candidate"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

## Production Deployment

### Backend Deployment (Example: Heroku)

```bash
cd backend

# Login to Heroku
heroku login

# Create app
heroku create pleniexam-backend

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_production_secret
heroku config:set MONGODB_URI=your_mongodb_atlas_uri

# Deploy
git push heroku main
```

### Frontend Deployment (Example: Netlify)

```bash
cd frontend

# Build production version
npm run build

# Deploy to Netlify
# Option 1: Drag and drop build folder to netlify.com
# Option 2: Use Netlify CLI
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

**Important**: Update `REACT_APP_API_URL` to your production backend URL before building!

## Next Steps

1. ✅ Create test accounts for each role
2. ✅ Test authentication flow
3. ✅ Instructor: Create a test exam
4. ✅ Candidate: Take the exam
5. ✅ Instructor: Grade essay questions (if any)
6. ✅ Admin: Manage users
7. ✅ Review security recommendations in SECURITY.md

## Additional Resources

- [Backend API Documentation](backend/README.md)
- [Frontend Documentation](frontend/README.md)
- [Security Guidelines](SECURITY.md)
- [Main README](README.md)

## Getting Help

If you encounter issues:

1. Check this setup guide
2. Review error messages carefully
3. Check backend/frontend logs
4. Review documentation in README files
5. Create an issue on GitHub

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Happy Coding! 🚀**

For questions or support, please open an issue on GitHub.
