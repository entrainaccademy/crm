# ENTRAIN CRM

Frontend-only CRM built with Next.js 16, React 19, Tailwind CSS 4, Lucide React, and Recharts.

## Run

- `npm install`
- `npm run dev`
- `npm run build` for the production check.

Open the URL printed by Next.js. The preview currently uses port 3001 because another application occupies port 3000.

## Demo

Open the profile menu to switch between all six roles. Navigation and route guards reflect the selected role. Sales executives see their own leads; team leaders see Team Alpha. The leaderboard is available to everyone.

Mock leads, follow-ups, targets, and role selection persist in sessionStorage for the current tab. No database, authentication, telephony, messaging, or external service is connected. Call and recording actions explicitly show demo notices. Exports download mock records as CSV or an Excel-readable HTML table.

## Structure

- `src/lib/data.js`: mock entities, permissions, currency helpers, and ranking function.
- `src/components/ui.js`: shared display, input, table, modal, timeline, and feedback components.
- `src/components/crm-app.js`: persistent workspace shell, role access, navigation, demo state, and forms.
- `src/components/dashboard.js`: dashboard, target tracking, leaderboard, and charts.
- `src/components/sales-pages.js`: leads, detail history, follow-ups, pipeline, customers, and calls.
- `src/components/management-pages.js`: targets, team, analytics, users, permissions, tasks, and settings.
- `src/app/[[...slug]]/page.js`: workspace route entry. The root layout maintains the interactive workspace across navigation.

Replace mock state operations with authenticated service adapters during the backend phase. Client-side role gating is a demo UI feature, not security enforcement. Analytics and historical periods use illustrative mock series. Integration settings intentionally remain placeholders.
