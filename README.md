# FlowStyles Client Hub Integration

## Setup
- Install dependencies: `npm install`
- Create `client/.env` with `VITE_API_BASE_URL=https://bug-free-space-robot-7v9v5xxw45p6c4rj-3000.app.github.dev/`
- Start the dev server: `npm run dev` (serves the API and Vite client)

## Environment
- The backend is hosted at the Codespace URL above; all client requests are proxied through that origin.
- Client Hub shares the Neon database used by the AGflow backend. Apply schema changes from the AGflow repository with `npm run db:push` there; this project does not run migrations on its own.

## API integration notes
- Client Hub consumes existing APIs only; it does not execute database migrations.
- Messaging list and read-status endpoints (`/api/messages` collection, `/api/messages/:id/read`) are not yet available. The UI focuses on loading a known conversation and sending replies.
