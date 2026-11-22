# Trading-Dashboard
A full-stack trading dashboard for simulating stock trading, managing portfolios, and tracking investment performance.

## Features
- User registration and JWT-based authentication
- Stock search and market data using the Finnhub API
- Account balance system
- Personal stock watchlist
- Simulated buy and sell orders
- Portfolio and holdings management
- Realised and unrealised gain/loss tracking
- Portfolio performance metrics
- Average cost-basis calculation based on trade history
- Caching system to minimise API usage and prevent rate limiting
- Protected backend API endpoints through custom [guard](https://docs.nestjs.com/guards)

## Gallery
<p align="center">
<img width="640" height="360" alt="login" src="https://github.com/user-attachments/assets/99378fbd-86e0-453d-a6e8-8016b572fb89" />
<img width="640" height="360" alt="registration" src="https://github.com/user-attachments/assets/7add92a5-ef14-4b23-8ccb-1b0aa963b087" />
 <br>
 <em>Login/registration pages</em>
</p>
<hr/>
<p align="center">

  <img width="640" height="360" alt="dashboard" src="https://github.com/user-attachments/assets/58c5adb2-f8ea-4b52-8c28-417302211fc8" />
<br>
 <em>Dashboard page</em>
</p>
<hr/>
<p align="center">
<img width="640" height="360" alt="portfolio" src="https://github.com/user-attachments/assets/8364434a-907a-4794-92fb-86b35e2e06d4" />

  <br>
 <em>Portfolio section</em>
</p>
<hr/>
<p align="center">
<img width="640" height="360" alt="trade" src="https://github.com/user-attachments/assets/9df2415e-b65d-4f1b-92c6-1734aac12e70" />
 <br>
 <em>Trade section</em>
</p>
<hr/>
<p align="center">

  <img width="640" height="360" alt="history" src="https://github.com/user-attachments/assets/c9efeb27-5eb8-487c-bf74-f9dfa334692f" />
<br>
 <em>Trade history section</em>
</p>
<hr/>
<p align="center">
<img width="640" height="360" alt="accounts" src="https://github.com/user-attachments/assets/e82e8c94-3141-41b0-8f27-fa95a08dff0d" />

  <br>
 <em>Accounts page</em>
</p>

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
- Jest (60+ endpoint and service tests implemented so far)

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
