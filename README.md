# Trading-Dashboard
A full-stack trading dashboard for simulating stock trading, managing portfolios, and tracking investment performance.

> **Work in Progress:** This project is actively being developed. Core functionality is implemented, with further work planned around refining core functionality and the user interface, and implementing data visualisations and additional features.

## Features
- User registration and JWT-based authentication
- Stock search and market data using the Finnhub API
- Personal stock watchlist
- Simulated buy and sell orders
- Portfolio and holdings management
- Realised and unrealised gain/loss tracking
- Portfolio performance metrics
- Average cost-basis calculation based on trade history
- Protected backend API endpoints through custom [guard](https://docs.nestjs.com/guards)

## Tech Stack
### Frontend
- Next.js
- TypeScript
- Tailwind CSS

### Backend
- NestJS
- TypeScript
- Prisma ORM
- JWT Authentication

### Database
- PostgreSQL
- Docker

### External APIs
- Finnhub API

## Project Structure
The application is split into a Next.js frontend and a NestJS backend.

```text
trading-dashboard/
├── frontend/    # Next.js frontend
└── backend/     # NestJS API
```
