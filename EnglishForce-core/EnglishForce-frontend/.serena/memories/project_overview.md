
# EnglishForce Frontend Project Overview

## Project Purpose

This project is the frontend for the e-learning platform "EnglishForce". It is a single-page application (SPA) built with React that provides the user interface for interacting with the backend services.

## Tech Stack

- **Framework:** React (bootstrapped with Create React App)
- **UI Library:** Material-UI (`@mui/material`)
- **Routing:** React Router (`react-router-dom`)
- **HTTP Client:** Axios
- **Payments:** Stripe.js

## Codebase Structure

The project follows a standard Create React App structure with some additional organization:

- `src/index.js`: The main entry point of the application.
- `src/App.js`: The root component that sets up the main routing structure.
- `src/Pages/`: Contains the main pages of the application, divided into `user` and `admin` sections.
- `src/Components/`: Contains reusable React components, also divided into `user` and `admin` subdirectories.
- `src/Api/`: Contains the configured `axios` instance for making API requests to the backend.
- `src/Context/`: Holds React Context providers for managing global state like the shopping cart and search functionality.
- `src/Layouts/`: Provides layout components for different parts of the application (e.g., `UserLayout`, `AdminLayout`).
- `src/Routes/`: Defines the routes for the user and admin sections of the application.
