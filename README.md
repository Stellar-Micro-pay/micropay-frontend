# micropay-frontend

Developer dashboard for monitoring API key status, usage, and Soroban micropayment balance.

This project is funded and governed by the Stellar Treasury system:
https://github.com/YOUR-USERNAME/stellar-treasury

## UI Scope

- Generate and display API key
- Show funding source (treasury vs personal)
- Display usage counters and charged total
- Show on-chain balance
- Submit top-up requests
- Trigger paid endpoint (`/premium-data`)

## Run

```bash
npm install
npm run dev
```

Configure backend URL in `src/api.ts` as needed.
