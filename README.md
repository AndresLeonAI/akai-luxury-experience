<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run locally (frontend + backend)

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1J_o9_7UgWymjj3cPKZ2JhwarluTm5MOD

## Prerequisites

- Node.js
- Postgres (local or Docker)
- Stripe account + test keys

## Setup

1. Install frontend deps:
   - `npm install`
2. Install backend deps:
   - `npm --prefix server install`
3. Configure environment:
   - Frontend (existing): set `GEMINI_API_KEY` in `.env.local` (optional for this feature)
   - Backend: copy `server/.env.example` to `server/.env` and set `DATABASE_URL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
4. Run DB migrations:
   - `npm run prisma:migrate`
5. Start both servers:
   - `npm run dev`

## Stripe webhooks (dev)

Use Stripe CLI to forward webhooks:
- `stripe listen --forward-to http://localhost:4000/api/v1/webhooks/stripe`


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
