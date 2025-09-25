# EnglishForce Backend - Project Documentation

## Project Overview

This is the backend for the EnglishForce e-learning platform, built with Node.js and Express.js. It provides server-side logic for user management, courses, exams, and other e-learning features.

## Tech Stack

- **Backend:** Node.js, Express.js (ES Modules)
- **Database:** PostgreSQL with Sequelize ORM
- **Authentication:** JWT for local authentication, Passport.js for Google and Facebook OAuth
- **Payments:** Stripe
- **Media:** Cloudinary for image and video storage
- **AI Integration:** Communicates with a separate Python/FastAPI server for AI-powered features

## Project Structure

```
├── server.js              # Main entry point
├── src/
│   ├── app.js             # Express app configuration
│   ├── config/            # Configuration files
│   ├── controllers/       # Request handlers
│   ├── services/          # Business logic
│   ├── routes/            # API route definitions
│   ├── sequelize/         # Database models and migrations
│   │   ├── models/        # Sequelize models
│   │   └── seeders/       # Database seeders
│   └── middleware/        # Custom middleware
├── package.json           # Dependencies and scripts
└── .env*                  # Environment configuration files
```

## Key Features

1. **User Management**
   - User registration and authentication
   - OAuth integration (Google, Facebook)
   - Role-based access control
   - Password management

2. **Course Management**
   - Course creation and enrollment
   - Content organization (sections, lessons)
   - Progress tracking
   - User interactions (comments, ratings)

3. **Exam System**
   - Exam creation and management
   - Question banks
   - Automated scoring
   - Attempt tracking

4. **Learning Programs**
   - Structured learning paths
   - Unit and lesson organization
   - Exercise systems
   - Progress monitoring

5. **Payment Integration**
   - Stripe payment processing
   - Subscription management

6. **AI Features**
   - Integration with external AI services
   - Chatbot functionality
   - Recommendation systems

## Development Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   - Copy `.env.example` to `.env` and configure values
   - Set up required services (PostgreSQL, Cloudinary, Stripe, etc.)

3. **Database Setup**
   - Configure database connection in environment files
   - Run migrations: `npx sequelize-cli db:migrate`
   - Seed initial data: `npx sequelize-cli db:seed:all`

4. **Run the Application**
   - Development mode: `npm run dev`
   - Development with auto-reload: `npm run dev:watch`
   - Production mode: `npm run start`

## Code Style and Conventions

- ES Modules (`import`/`export`)
- Async/await for asynchronous operations
- camelCase naming convention
- Semicolons at end of statements
- JSDoc-style comments for functions
- Consistent formatting with existing code

## Important Notes

- The application uses ES Modules, so ensure all imports/exports follow this pattern
- Environment variables must be loaded before any modules that depend on them
- Database models use UUIDs for public identifiers but integers for internal IDs
- OAuth integrations require proper client IDs and secrets in environment variables