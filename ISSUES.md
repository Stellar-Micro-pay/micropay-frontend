# GitHub Issues — micropay-frontend

## Open Issues

1. **feat(ui): add Freighter wallet connect button**
   Let developers authenticate with Stellar Freighter browser extension.

2. **feat(ui): add live balance auto-refresh every 30 seconds**
   Poll `/balance` periodically and update stats without page reload.

3. **feat(ui): show treasury vs self-funded balance split**
   Visual breakdown: how much came from treasury vs self-deposit.

4. **feat(ui): add usage chart (bar chart by day)**
   Recharts or Chart.js line chart of daily API spend.

5. **feat(ui): export usage CSV**
   Allow developers to download their usage history as a CSV.

6. **feat(ui): add dark/light mode toggle**
   Currently dark-only; add system preference detection.

7. **feat(ui): persist API key in localStorage**
   Avoid re-entering key on page refresh (with user consent).

8. **fix(ui): handle 402 Insufficient Balance with top-up prompt**
   When premium call returns 402, auto-scroll to top-up section.

9. **fix(ui): add loading skeleton for stats grid**
   Replace `—` placeholders with skeleton loaders during initial fetch.

10. **fix(ui): mobile responsive layout for usage table**
    Horizontal scroll or card view on narrow screens.

11. **test(ui): add React Testing Library tests for Dashboard**
    Test balance display, top-up flow, and premium call states.

12. **test(ui): add test for SetupScreen form validation**
    Verify error message on empty wallet address submit.

13. **chore(ui): set up GitHub Actions build + test CI**
    Run `npm test -- --watchAll=false` and `npm run build` on PR.

14. **docs(ui): add Storybook stories for Badge, StatCard, Spinner**
    Component-level documentation and visual testing.

15. **feat(ui): add transaction history deep link to Stellar Explorer**
    Link tx hashes to `https://stellar.expert/explorer/testnet/tx/{hash}`.
