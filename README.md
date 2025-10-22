# Student Management System

A full-stack web application for managing student records and their academic performance. This project demonstrates a modern PostgreSQL, Express.js, React, Node.js (PERN) stack application with a clean architecture and responsive UI, using Supabase as the database backend.

## 🚀 Features

- **Student Management**
  - Add, view, edit, and delete student records
  - View detailed student information
  - Paginated student listing with search and filter capabilities

- **Marks Management**
  - Track student academic performance
  - Add and manage marks for different terms
  - View performance history

- **User Experience**
  - Responsive design for all devices using Bootstrap 5
  - Intuitive user interface with React components
  - Real-time feedback with toast notifications
  - Form validation and error handling

## 🛠️ Tech Stack

### Frontend (React)
- React 18 with Hooks
- React Router v6 for navigation
- Axios for API requests
- Bootstrap 5 with custom styling
- React Icons for consistent icons
- SweetAlert2 for beautiful alerts and confirmations
- Vite for fast development and building

### Backend (Node.js/Express)
- Node.js with Express.js framework
- PostgreSQL database with Supabase
- RESTful API architecture
- CORS enabled for cross-origin requests
- Environment-based configuration

## 📁 Project Structure

```
nadsoft-machine-test/
├── client/                     # Frontend React application
│   ├── public/                # Static files
│   └── src/
│       ├── assets/            # Images, fonts, and other static assets
│       ├── components/        # Reusable React components
│       │   ├── StudentList.jsx # Main student listing and management
│       │   └── ...            # Other components
│       ├── styles/            # Global styles and CSS modules
│       ├── App.jsx            # Main App component
│       └── main.jsx           # Application entry point
│
└── server/                    # Backend Node.js application
    ├── src/
    │   ├── controllers/      # Route controllers (business logic)
    │   ├── routes/           # API route definitions
    │   └── sql/              # SQL queries and migrations
    ├── .env                  # Environment variables
    └── package.json          # Backend dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database (Supabase recommended)
- Git for version control


### Running the Application

1. **Start the backend server**
 
   cd server
   npm run dev

2. **Start the frontend development server**
  
   cd ../client
   npm start
  

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🌐 API Endpoints

### Students
- `GET /api/students` - Get all students (paginated)
- `POST /api/students` - Create a new student
- `GET /api/students/:id` - Get a single student
- `PUT /api/students/:id` - Update a student
- `DELETE /api/students/:id` - Delete a student

### Marks
- `GET /api/marks?studentId=:id` - Get marks for a student
- `POST /api/marks` - Add marks for a student
- `PUT /api/marks/:id` - Update student marks
- `DELETE /api/marks/:id` - Delete student marks

## 📝 Development Notes

- **Frontend**: Built with modern React practices using functional components and hooks
- **Backend**: RESTful API with Express.js and PostgreSQL
- **Database**: Utilizes Supabase for PostgreSQL database with proper schema design
- **Styling**: Responsive design using Bootstrap 5 with custom theming
- **State Management**: React Context API for global state management
- **Environment Variables**: Uses `.env` for configuration (see `.env.example` for required variables)

## 🔧 Development Scripts

### Client
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Server
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
