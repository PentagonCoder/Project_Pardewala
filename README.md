# Full-Stack Authentication Starter Pack

A ready-to-use starting point for applications that need user accounts. It includes a React frontend and an Express/MongoDB API with registration, email verification, login, protected pages, role-based access, refresh tokens, and password-reset flows.

Use it as the foundation for a dashboard, SaaS app, admin panel, or any project where users need to sign in securely.

## What's included

- React 19 + Vite frontend
- Express 5 API with MongoDB and Mongoose
- Register, verify-email, login, logout, and profile endpoints
- JWT access and refresh tokens stored in HTTP-only cookies
- Protected frontend routes and automatic token refresh
- User and admin roles, including an admin-only API route
- Email verification and password-reset links or one-time passwords
- Form validation with Zod and client state with Zustand

## Project structure

```text
starter-pack/
├── frontend/              # React application and protected pages
│   └── src/
│       ├── api/           # Axios client and token refresh handling
│       ├── pages/         # Login, registration, dashboards, and settings
│       ├── routes/        # ProtectedRoute component
│       └── store/         # Authentication state
└── backend/               # Express API
    └── src/
        ├── controllers/   # Request handlers
        ├── services/      # Authentication business logic
        ├── model/         # User schema
        ├── middlewares/   # Auth, roles, validation, and errors
        └── routes/        # API endpoints
```

## Requirements

- Node.js 18 or later
- MongoDB (local installation or MongoDB Atlas)
- An SMTP email account for verification and reset emails

## Quick start

1. Clone or download this project, then install each app's dependencies:

   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. Create the backend environment file:

   ```bash
   cd ../backend
   cp .env.sample .env
   ```

3. Update `backend/.env` with your own values:

   ```env
   PORT=3000
   MONGODB_URI=mongodb://127.0.0.1:27017

   ACCESS_TOKEN_SECRET=replace-with-a-long-random-secret
   REFRESH_TOKEN_SECRET=replace-with-a-different-long-random-secret
   ACCEES_TOKEN_EXPIRES=15m
   REFRESH_TOKEN_EXPIRES=7d

   EMAIL_USER=your-email@example.com
   EMAIL_PASS=your-smtp-password-or-app-password
   VERIFYLINK=http://localhost:5173/verify-email
   ```

   `MONGODB_URI` should be the server/database prefix: the application appends `/test` when it connects. For MongoDB Atlas, use its connection string without adding `/test` yourself.

4. Start the backend in one terminal:

   ```bash
   cd backend
   npm run dev
   ```

5. Start the frontend in another terminal:

   ```bash
   cd frontend
   npm run dev
   ```

6. Open the URL printed by Vite (normally `http://localhost:5173`), register an account, and use the verification email before logging in.

## Available commands

| Location | Command | Purpose |
| --- | --- | --- |
| `backend` | `npm run dev` | Run the API with automatic restart |
| `frontend` | `npm run dev` | Run the Vite development server |
| `frontend` | `npm run build` | Create a production frontend build |
| `frontend` | `npm run lint` | Check frontend code with ESLint |
| `frontend` | `npm run preview` | Preview the production frontend build |

## API overview

All API routes start with `/api/users`.

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| `POST` | `/register` | Create an account and send a verification email | No |
| `GET` | `/verify-email/:token` | Verify an email address | No |
| `POST` | `/login` | Sign in and set access/refresh cookies | No |
| `POST` | `/refresh-Token` | Issue a new token pair | Refresh token |
| `GET` | `/profile` | Get the signed-in user's profile | Yes |
| `POST` | `/logout` | Clear the current session | Yes |
| `GET` | `/admin/dashboard` | Example admin-only endpoint | Admin |
| `POST` | `/forgot-password` | Send a password-reset link | No |
| `POST` | `/reset-password/:token` | Reset a password using a link token | No |
| `POST` | `/forgot-password-Otp` | Send a password-reset OTP | No |
| `POST` | `/reset-password-Otp` | Reset a password with an OTP | No |

Example registration request:

```json
{
  "fullname": "Ada Lovelace",
  "email": "ada@example.com",
  "password": "a-secure-password"
}
```

## Customizing it

- Change the app pages in `frontend/src/pages` and shared layout in `frontend/src/components`.
- Add your own models, routes, and controllers under `backend/src`.
- Keep the API base URL in `frontend/src/api/axios.js` aligned with your backend URL.
- Before deployment, update CORS in `backend/src/app.js` to include your production frontend domain.
- Set strong unique secrets and use an email provider's app password or SMTP credentials. Never commit `.env` files.

## Notes for production

This is a starter, so review it before using it in a public production app. In particular, configure production CORS, HTTPS cookie settings, a real database name, email-provider credentials, rate limiting, logging, and automated tests. Also make sure your frontend and backend are served over HTTPS when cookies use `secure: true`.

## License

No license file is included yet. Add a license before distributing the project so others know how they may use it.
