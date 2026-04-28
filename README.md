# micropay-frontend

> Developer dashboard for the MicroPay API platform.

This project is funded and governed by the Stellar Treasury system:
**https://github.com/YOUR-USERNAME/stellar-treasury**

---

## Overview

`micropay-frontend` is a React single-page application that gives developers a clean
interface to manage their MicroPay API access:

- Generate an API key tied to their Stellar wallet
- View real-time on-chain balance (stroops and XLM)
- Top-up balance via smart contract deposit
- Trigger a sample paid API request and see on-chain deduction
- Browse full usage history

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/YOUR-USERNAME/micropay-frontend
cd micropay-frontend

# 2. Install
npm install

# 3. Configure
cp .env.example .env
# REACT_APP_API_URL=http://localhost:3001

# 4. Start (requires micropay-backend running)
npm start
```

Dashboard will open at **http://localhost:3000**

---

## Screens

### Setup Screen
- Enter your Stellar wallet address (`G…`)
- Choose funding source: **Self-funded** or **Treasury-funded**
- Click **Generate API Key** → stored in session

### Dashboard
| Section | Description |
|---|---|
| API Key | Full key with copy button |
| Stats Grid | Balance, request count, total spent, cost/request |
| Top-Up | Deposit XLM to the smart contract |
| Premium Call | Make a live paid request, see tx hash |
| Usage History | Timestamp, endpoint, charge, tx hash |

---

## Environment Variables

| Variable | Description |
|---|---|
| `REACT_APP_API_URL` | Backend API URL (default: `http://localhost:3001`) |

---

## Build for Production

```bash
npm run build
# Outputs to /build — serve with any static host (Vercel, Netlify, Nginx)
```

---

## Related Repositories

| Repo | Purpose |
|---|---|
| [micropay-contracts](https://github.com/YOUR-USERNAME/micropay-contracts) | Soroban contract |
| [micropay-backend](https://github.com/YOUR-USERNAME/micropay-backend) | Node.js API gateway |
| [micropay-docs](https://github.com/YOUR-USERNAME/micropay-docs) | Full documentation |
| [stellar-treasury](https://github.com/YOUR-USERNAME/stellar-treasury) | Governing DAO |
