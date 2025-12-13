# Sweet Shop Frontend

React SPA built with Vite for the Sweet Shop management system.

## Features

- JWT-based authentication
- User and Admin roles
- Dashboard with sweets display, search, and filter
- Admin panel for CRUD operations on sweets
- Protected routes based on authentication and role

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The app will run on http://localhost:3000

## Build

```bash
npm run build
```

## Test

```bash
npm test
```

## Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable components
│   ├── context/        # React context providers
│   ├── pages/          # Page components
│   ├── services/       # API service layer
│   └── test/           # Test setup files
├── index.html
├── package.json
└── vite.config.js
```

## API Integration

The frontend expects the backend API to be running on `http://localhost:8080`. The Vite proxy is configured to forward `/api` requests to the backend.

## Authentication

- JWT tokens are stored in localStorage
- Tokens are automatically included in API requests
- Protected routes redirect to login if not authenticated
- Admin routes require ADMIN role

