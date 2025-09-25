# EnglishForce Frontend - Project Documentation

## Project Overview

This is the frontend for the EnglishForce e-learning platform, built with React. It's a single-page application (SPA) that provides the user interface for interacting with the backend services.

## Tech Stack

- **Framework:** React (bootstrapped with Create React App)
- **UI Library:** Material-UI (`@mui/material`)
- **Routing:** React Router (`react-router-dom`)
- **HTTP Client:** Axios
- **State Management:** React Context API
- **Payments:** Stripe.js
- **Charts:** Recharts and MUI X Charts
- **UI Components:** React Slick for carousels

## Project Structure

```
├── public/                 # Static assets
├── src/
│   ├── App.js              # Main application component
│   ├── index.js            # Entry point
│   ├── Pages/              # Page components (user and admin)
│   ├── Components/         # Reusable UI components
│   ├── Layouts/            # Layout components
│   ├── Routes/             # Route definitions
│   ├── Api/                # Axios instance and API configuration
│   ├── Context/            # React Context providers
│   └── ...
├── package.json            # Dependencies and scripts
└── .env                    # Environment variables
```

## Key Features

1. **User Authentication**
   - Login/registration pages
   - OAuth integration (Google, Facebook)
   - Token-based authentication with automatic refresh
   - Protected routes

2. **Course Management**
   - Course browsing and searching
   - Course details and enrollment
   - User course dashboard

3. **Exam System**
   - Exam browsing
   - Exam taking interface
   - Result display

4. **Learning Programs**
   - Structured learning paths
   - Unit and lesson navigation
   - Progress tracking

5. **Payment Integration**
   - Shopping cart functionality
   - Stripe payment processing

6. **Admin Dashboard**
   - Course management
   - User management
   - Analytics and reporting

## Development Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   - Copy `env_example.txt` to `.env` and configure values
   - Set `REACT_APP_BACKEND_URL` to point to the backend server

3. **Run the Application**
   - Development mode: `npm start`
   - Production build: `npm run build`
   - Run tests: `npm test`

## Code Style and Conventions

- Component-Based Architecture with functional components
- React Hooks for state and side effects management
- Material-UI for UI components and styling
- Axios for HTTP requests with interceptors for auth handling
- React Context for global state management
- ESLint with Create React App configuration

## Important Notes

- The application uses React Router v7 for routing
- Authentication tokens are stored in localStorage
- API calls are made through an axios instance with interceptors
- Responsive design using Material-UI's responsive utilities
- Environment variables must be prefixed with `REACT_APP_`