# Quiz Web Application

An interactive quiz platform built with MERN stack (MongoDB, Express.js, React.js, Node.js) that allows users to create, manage, and participate in quizzes.

## Features

- *User Authentication*
  - Register and login functionality
  - JWT-based authentication
  - Secure password hashing
  - Profile management

- *Quiz Management*
  - Create custom quizzes with multiple question types
  - Upload PDF files to generate AI-powered quizzes
  - Edit existing quizzes
  - Set quiz start and end dates
  - Multiple choice and single choice questions
  - Shuffle questions functionality

- *Quiz Taking*
  - User-friendly quiz interface
  - Real-time score calculation
  - Quiz history tracking
  - View detailed results

- *Dashboard*
  - View quiz submissions
  - Export results to PDF and Excel
  - Sort and filter submissions
  - Delete submission records

## Tech Stack

### Frontend
- React.js
- Redux for state management
- Tailwind CSS for styling
- Axios for API calls

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

## Environment Variables

Create a .env file in the root directory with the following variables:

env
PORT=8080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret
JWT_EXP=1h
SENDGRID_API_KEY=your_sendgrid_api_key
GEMINI_API_KEY=your_gemini_api_key
origin=http://localhost:3000


## Installation

1. Clone the repository
bash
git clone <repository-url>
cd Quiz_app


2. Install backend dependencies
bash
cd backend
npm install


3. Install frontend dependencies
bash
cd ../frontend
npm install


4. Start the backend server
bash
cd ../backend
npm start


5. Start the frontend development server
bash
cd ../frontend
npm start


## API Endpoints

### User Routes
- POST /api/register - Register new user
- POST /api/login - User login
- POST /api/logout - User logout
- GET /api/current-user - Get current user details
- PUT /api/update-user - Update user profile

### Quiz Routes
- POST /api/quiz/create - Create new quiz
- GET /api/quiz/all - Get all quizzes
- PUT /api/quiz/edit/:code - Edit quiz
- DELETE /api/quiz/delete/:code - Delete quiz
- GET /api/quiz/submissions/:code - Get quiz submissions

## Project Structure


Quiz_app/
├── backend/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── index.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── redux/
│   │   ├── utils/
│   │   └── App.js
│   └── package.json
└── README.md


## Future Enhancements

- Real-time quiz collaboration
- Advanced analytics dashboard
- More question types
- Social sharing features
- Timer-based quizzes

## Contributing

Feel free to fork the repository and submit pull requests for any improvements.

## License

This project is licensed under the MIT License.
