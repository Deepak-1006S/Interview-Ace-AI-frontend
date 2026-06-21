# InterviewAce AI

Full-stack interview preparation platform with AI-driven mock interviews, resume analysis, coding practice, analytics, and real-time collaboration.

## Project overview

This repository contains two main applications:

- `Backend/` - Node.js + Express API, MongoDB persistence, JWT authentication, Socket.io realtime, and Anthropic Claude AI integration.
- `Frontend/` - React + Vite SPA with Tailwind CSS, user auth, interview flows, analytics, resume analyzer, coding challenges, and admin support.

## Key features

- User registration, login, profile management, and JWT-protected routes
- Real-time interview sessions and socket events
- AI-generated interview questions and answer evaluation
- Resume ATS analysis and follow-up question support
- Interview history, performance analytics, and leaderboard
- Admin dashboard and user/question management paths

## Repository structure

- `Backend/`
  - `src/app.js` - Express app setup and route registration
  - `src/server.js` - HTTP server + Socket.io initialization
  - `src/routes/` - REST API route definitions
  - `src/controllers/` - Request handling logic
  - `src/models/` - Mongoose models for users, interviews, and questions
  - `src/services/` - AI service and socket service logic
  - `src/middleware/` - auth, validation, error handling, not found handlers
  - `src/config/` - CORS and MongoDB connection config
  - `src/utils/seed.js` - sample data seeding script

- `Frontend/`
  - `src/main.jsx` - React app entry point
  - `src/App.jsx` - route definitions and protected routes
  - `src/context/` - auth and socket context providers
  - `src/lib/api.js` - Axios API client with token handling
  - `src/lib/pages/` - public and authenticated page views
  - `src/components/` - shared UI components
  - `src/hooks/` - reusable hooks such as interview timer

## Requirements

- Node.js 18 or newer
- MongoDB deployment or MongoDB Atlas cluster
- Anthropic API key for AI-powered question generation and answer evaluation

## Backend setup

1. Change to the backend directory:

```bash
cd Backend
```

2. Install dependencies:

```bash
npm install
```

3. Create or update `.env` with the required values:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/interviewace
JWT_SECRET=your_jwt_secret_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

4. Optionally seed the database with sample data:

```bash
npm run seed
```

5. Start the backend server:

```bash
npm run dev
```

The API will be available at `http://localhost:5000/api/v1` and health checks at `http://localhost:5000/health`.

## Frontend setup

1. Change to the frontend directory:

```bash
cd Frontend
```

2. Install dependencies:

```bash
npm install
```

3. Optional Vite environment configuration:

- `VITE_API_URL` — set this if your backend is hosted somewhere other than the Vite dev proxy.

Example `.env` file:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

4. Start the frontend app:

```bash
npm run dev
```

Open the app at the URL shown by Vite, typically `http://localhost:5173`.

## Available scripts

### Backend

- `npm run dev` — start server with nodemon
- `npm start` — run production server
- `npm run seed` — populate sample data

### Frontend

- `npm run dev` — start Vite dev server
- `npm run build` — create production build
- `npm run preview` — preview production build locally

## Notes

- The backend uses `express-rate-limit` and `helmet` for security.
- The frontend stores JWT tokens locally and refreshes expired access tokens automatically.
- `Frontend/src/lib/api.js` expects backend responses to use a wrapper format like `{ success, message, data }`.
- The realtime interview flow is powered by `socket.io-client` and `SocketProvider`.

## Useful URLs

- API base: `http://localhost:5000/api/v1`
- Frontend dev: `http://localhost:5173`
- Backend health: `http://localhost:5000/health`

## Contributions

If you want to extend the project, start by adding new interview types, improving AI prompts, or polishing frontend pages under `src/lib/pages`.
