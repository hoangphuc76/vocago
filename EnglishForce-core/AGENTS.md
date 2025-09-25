# Repository Guidelines

## Project Structure & Module Organization
- Monorepo with two apps:
  - `EnglishForce-backend/` — Node.js (Express + Sequelize). Source in `src/`, entry `server.js`. Routes under `src/routes/*`, controllers `src/controllers/*`, models `src/sequelize/models/*`.
  - `EnglishForce-frontend/` — React (CRA). Source in `src/`, static assets in `public/`, production build in `build/`.
- Docker assets: `EnglishForce-backend/Dockerfile`, `EnglishForce-frontend/Dockerfile`.
- Environment files: backend (`.env.development`, `.env.production`), frontend (`EnglishForce-frontend/.env`). Use `env_example.txt` as reference.

## Architecture Overview
- Client: React SPA calls backend via REST under `/api/*`.
- API: Express app with route → controller → service layering and centralized error middleware (`src/middleware/error.js`).
- Data: Sequelize models in `src/sequelize/models/*` connect to PostgreSQL; configure via `.env*` and `src/sequelize/config/*`.
- Auth: JWT-based flows under `/api/auth/*`, with Google/Facebook OAuth via Passport.
- Payments: Stripe webhook mounted at `/api/webhook`.
- AI: Gemini integration used in `AIRoutes` for learning features.
- Deployment: Each app has a Dockerfile; frontend can be served by Nginx (`EnglishForce-frontend/nginx.conf`).

## Build, Test, and Development Commands
- Backend
  - `cd EnglishForce-backend && npm install`
  - `npm run dev` — start API in development.
  - `npm run dev:watch` — dev with nodemon.
  - `npm start` — start in production mode.
- Frontend
  - `cd EnglishForce-frontend && npm install`
  - `npm start` — run React dev server.
  - `npm run build` — production build to `build/`.
  - `npm test` — CRA test runner.

## Coding Style & Naming Conventions
- JavaScript ESM imports (`type: module`). Use 2-space indentation.
- Backend files: lower camelCase (e.g., `userRoutes.js`, `examService.js`). Directories lowercase.
- Frontend React components: PascalCase files/exports (e.g., `CourseCard.jsx`). Hooks as `useXyz.js`.
- Prefer small, focused modules; keep route → controller → service layers.

## Testing Guidelines
- Frontend: Jest via CRA. Place tests next to code as `*.test.js(x)`.
- Backend: no formal tests yet; prefer Jest + Supertest for routes (`src/**/*.test.js`).
- Aim for critical-path coverage (auth, payments, exams). Run with `npm test` per app.

## Commit & Pull Request Guidelines
- Prefer Conventional Commits (`feat:`, `fix:`, `chore:`). Keep messages imperative and concise.
- PRs must include: clear summary, scope (backend/frontend), linked issues, and screenshots or API logs where relevant.
- Ensure lint-free builds and green tests before requesting review.

## Security & Configuration Tips
- Do not commit secrets. Load from `.env*`; see `env_example.txt`.
- Backend requires a reachable database; configure Sequelize in `src/sequelize/config/*`.
- Validate inputs at controllers; centralize error handling via `src/middleware/error.js`.

## Agent Notes
- Follow this file’s scope rules. Make minimal, surgical changes and avoid unrelated refactors.
