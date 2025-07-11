# Administration Panel - Course Management System

A comprehensive Single Page Application (SPA) for user and course management with authentication and role-based access control.

## Features

### Authentication System
- User registration and login
- Session management with localStorage
- Role-based access control (Administrator & Visitor)
- Input validation and error handling

### Administrator Features
- **Dashboard**: Overview with statistics and recent activity
- **User Management**: Full CRUD operations for users
- **Course Management**: Create, read, update, and delete courses
- **Enrollment Tracking**: Monitor course enrollments

### Visitor Features
- **Course Browsing**: View available courses with search functionality
- **Course Enrollment**: Enroll in and unenroll from courses
- **My Courses**: View personal enrolled courses

### Technical Features
- **Responsive Design**: Mobile-first approach with breakpoints
- **Modern UI**: Clean, professional interface with smooth animations
- **Modular Architecture**: Organized file structure with separation of concerns
- **Real-time Validation**: Form validation with immediate feedback
- **Modal System**: Reusable modal components for forms and confirmations

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Backend**: JSON Server (REST API simulation)
- **Build Tool**: Vite
- **Styling**: Custom CSS with CSS Grid and Flexbox
- **Architecture**: Modular JavaScript with ES6 modules

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

This will start both the JSON server (port 3000) and Vite development server (port 5173).

## Usage

### Demo Credentials

**Administrator:**
- Email: admin@admin.com
- Password: admin123

**Visitor:**
- Email: john@example.com
- Password: visitor123

### File Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.js       # Application header
│   ├── Sidebar.js      # Navigation sidebar
│   └── Modal.js        # Modal component
├── pages/              # Page components
│   ├── LoginPage.js    # Login page
│   ├── RegisterPage.js # Registration page
│   ├── DashboardPage.js # Admin dashboard
│   ├── UsersPage.js    # User management
│   ├── CoursesPage.js  # Course management
│   ├── PublicPage.js   # Public course view
│   └── MyCoursesPage.js # User's enrolled courses
├── services/           # API services
│   ├── auth.js         # Authentication service
│   ├── users.js        # User management service
│   ├── courses.js      # Course management service
│   └── enrollments.js  # Enrollment service
├── utils/              # Utility functions
│   ├── validation.js   # Input validation
│   ├── storage.js      # LocalStorage wrapper
│   └── router.js       # Client-side routing
├── styles/             # Styling
│   └── main.css        # Main stylesheet
└── main.js             # Application entry point
```

## Features Overview

### Authentication
- Secure login/logout functionality
- User registration with validation
- Session persistence using localStorage
- Role-based page access control

### User Management (Admin Only)
- Create, read, update, and delete users
- Search and filter users by role
- Form validation with real-time feedback
- Confirmation dialogs for destructive actions

### Course Management (Admin Only)
- Full CRUD operations for courses
- Course search functionality
- Enrollment tracking
- Date formatting and validation

### Public Features (Visitors)
- Browse available courses
- Search courses by title or description
- Enroll in courses with instant feedback
- View enrolled courses
- Unenroll from courses

### UI/UX Features
- Responsive design for all screen sizes
- Professional color scheme and typography
- Smooth animations and transitions
- Loading states and error handling
- Accessible form design
- Mobile-optimized navigation

## API Endpoints

The application uses JSON Server to simulate a REST API:

- `GET /users` - Get all users
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `GET /courses` - Get all courses
- `POST /courses` - Create new course
- `PUT /courses/:id` - Update course
- `DELETE /courses/:id` - Delete course
- `GET /enrollments` - Get all enrollments
- `POST /enrollments` - Create enrollment
- `DELETE /enrollments/:id` - Delete enrollment

## Development

### Building for Production

```bash
npm run build
```

### Running Only the API Server

```bash
npm run server
```

## License

MIT License