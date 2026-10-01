# Iranian Restaurant: Full-Stack Ordering Website

A trilingual (Persian / Arabic / English) restaurant website with online ordering, table reservations, customer accounts and a full admin panel. Built with React and Node.js.

## Features

**Customer side**
- Categorized menu with dish details and images
- Shopping cart and online order checkout
- Customer registration and login (including Google sign-in)
- User profile and order history
- Table reservations
- Reviews and ratings
- Blog / articles section
- Job applications form
- Contact form with email and Telegram notifications
- Responsive design, PWA support, SEO structured data

**Admin panel**
- JWT-protected admin login
- Dashboard with statistics
- Manage orders and update order status
- Manage dishes (create, edit, delete) with image/video upload
- Manage articles, reservations, users and job applications

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Auth | JWT, Google OAuth |
| Security | Helmet, express-rate-limit, route-level auth middleware |
| Other | Multer (uploads), Nodemailer, Telegram Bot API |

## Project Structure

```
backend/
  controllers/   # business logic
  middleware/    # auth middleware
  models/        # Mongoose schemas
  routes/        # API routes
  seed/          # seed data
  utils/         # helpers (Telegram notifier, ...)
  server.js
frontend/
  src/           # React app (pages, components, hooks)
  public/        # static assets, PWA manifest
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Backend

```bash
cd backend
cp .env.example .env     # then fill in your own values
npm install
npm run dev
```

The API runs on `http://localhost:5000`. The server will not start without `JWT_SECRET`.

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The app runs on `http://localhost:5173`.

## Environment Variables

See `backend/.env.example` and `frontend/.env.example`.

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing tokens (required) |
| `EMAIL_USER`, `EMAIL_PASS` | Gmail account and app password for the contact form |
| `CONTACT_TO_EMAIL` | Recipient of contact form messages |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | Telegram notifications |
| `VITE_API_URL` | Backend URL used by the frontend |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID |

## Notes

- Uploaded media (`backend/public/uploads/`) is not included in the repository, so sample images will not appear after cloning.
- Secrets are never committed; use your own `.env` files.

## Author

Fatemeh Rostami, full-stack developer
GitHub: [@fatemerostami2021-hash](https://github.com/fatemerostami2021-hash)
