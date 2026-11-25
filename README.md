# Trading-Dashboard
A full-stack trading dashboard for simulating stock trading, managing portfolios, and tracking investment performance.

### Features
- User registration and JWT-based authentication
- Stock search and real-time market data integration via Finnhub
- Account balance management and multiple accounts
- Personal stock watchlists
- Simulated stock trading (buy/sell orders)
- Portfolio, holdings, and trade history management
- Realised and unrealised profit/loss tracking (including daily performance)
- Portfolio performance metrics and analytics
- Weighted-average cost basis calculated from trade history
- Caching to reduce external API requests and mitigate rate limiting
- Protected API endpoints using custom [NestJS guards](https://docs.nestjs.com/guards)

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
<img width="640" height="360" alt="watchlist" src="https://github.com/user-attachments/assets/13d4b6ed-0392-4c7d-b832-91e3eaef0a73" /><br>
 <em>Watchlist section</em>
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
- Jest

### Database
- PostgreSQL
- Docker

### External APIs
- Finnhub API

## Project Structure
The application is split into a Next.js frontend and a NestJS backend, with a PostgreSQL database containerised using Docker.

```text
trading-dashboard/
├── frontend/          # Next.js frontend
├── backend/           # NestJS backend
└── docker-compose.yml # Docker container with PostgreSQL database
```
