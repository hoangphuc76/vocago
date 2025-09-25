
# EnglishForce Backend Project Overview

## Project Purpose

This project is the backend for the e-learning platform "EnglishForce". It provides the server-side logic for user management, courses, exams, and other features of the application.

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL with Sequelize ORM
- **Authentication:** JWT for local authentication, Passport.js for Google and Facebook OAuth
- **Payments:** Stripe
- **Media:** Cloudinary for image and video storage
- **AI:** Communicates with a separate Python/FastAPI server for AI-powered features like a chatbot and recommendation system.

## Codebase Structure

The project follows a structure similar to the Model-View-Controller (MVC) pattern:

- `server.js`: The main entry point of the application. It initializes the database connection and starts the Express server.
- `src/app.js`: Configures the Express application, including middleware and API routes.
- `src/config/`: Contains configuration files for the database, Cloudinary, and environment variables.
- `src/controllers/`: Contains the controllers that handle incoming HTTP requests and orchestrate the business logic.
- `src/services/`: Implements the core business logic of the application and interacts with the database models.
- `src/sequelize/models/`: Defines the database schema using Sequelize models.
- `src/routes/`: Defines the API endpoints and maps them to the corresponding controllers.
