# CivicLens

**CivicLens** is a civic waste-management platform that helps citizens report waste, helps authorities track and resolve issues, and keeps the public informed through a live, real-time cleanliness view.

It is designed as a role-based React application with separate experiences for citizens, authorities, administrators, organizations, NGOs, and government bodies.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [User Roles](#user-roles)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Environment Variables](#environment-variables)
- [How It Works](#how-it-works)
- [Future Improvements](#future-improvements)
- [License](#license)

---

## Overview

CivicLens turns civic cleanliness into a structured, trackable workflow.

Citizens can capture and submit waste reports with location data, authorities can review and assign cleanup work, and the platform can surface live cleanliness status through maps and dashboards. The project also includes AI-assisted image validation and guidance for waste segregation and disposal.

---

## Key Features

- **Waste reporting** with photo capture and location tagging
- **AI image validation** to reject invalid or clean-image submissions
- **Live cleanliness heatmap** to visualize problem areas
- **Real-time notifications** for new reports and status changes
- **Authority dashboard** for reviewing, assigning, and resolving reports
- **Bulk waste pickup flow** for large or scheduled disposal requests
- **Segregation guidance** for correct waste handling
- **Facility locator** to help users find disposal and drop-off points
- **Campaign and cleanup participation** for civic engagement
- **Role-based access control** across multiple user types
- **Analytics and escalation logic** for unresolved reports

---

## User Roles

### Citizen
Reports waste, tracks submissions, finds disposal facilities, requests bulk pickup, and checks impact status.

### Authority
Reviews incoming reports, assigns work, marks resolution, uploads proof, and escalates overdue cases.

### Organization
Supports collective reporting for apartments, offices, restaurants, and other bulk generators.

### Admin
Manages platform-wide configuration, user flows, analytics, and escalation policies.

### NGO / Government Body
Coordinates awareness campaigns, contributes segregation guidance, and monitors city-level patterns.

---

## Tech Stack

### Frontend
- **React 19**
- **Vite**
- **React Router**
- **Tailwind CSS**
- **Framer Motion**
- **Lucide React**

### Maps and Visualization
- **Leaflet**
- **React Leaflet**
- **react-globe.gl**
- **dotted-map**
- **Recharts**
- **Three.js**

### State and Data
- **Zustand**
- **Axios**
- **Socket.io Client**

---

## Project Structure

```bash
CivicLens/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── lib/
│   ├── pages/
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── authority/
│   │   ├── citizen/
│   │   └── public/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── civiclens_master_prompt.md
├── package.json
└── vite.config.js
```

---

## Getting Started

### Prerequisites
- Node.js 18+ recommended
- npm or yarn

### Installation

```bash
git clone https://github.com/anuragcode-16/CivicLens.git
cd CivicLens
npm install
```

### Run locally

```bash
npm run dev
```

Open the app in your browser at the local Vite URL shown in the terminal.

---

## Available Scripts

```bash
npm run dev
```
Start the development server with Vite.

```bash
npm run build
```
Create a production build.

```bash
npm run preview
```
Preview the production build locally.

```bash
npm run lint
```
Run ESLint across the codebase.

---

## Environment Variables

This project may require backend and AI service configuration depending on your deployment setup.

Create a `.env` file if your app uses variables such as:

```bash
VITE_API_URL=
VITE_SOCKET_URL=
VITE_GEMINI_API_KEY=
VITE_MAPS_API_KEY=
```

Use the exact names expected by your implementation.

---

## How It Works

1. A citizen opens the app and signs in.
2. The citizen captures a waste photo and submits it with location details.
3. The AI layer validates whether the image actually contains waste.
4. Valid reports are stored and routed to the correct authority queue.
5. Authorities review the report, assign cleanup tasks, and resolve the issue.
6. The report status updates in real time across dashboards and maps.
7. Citizens receive feedback when the report is resolved.

---

## Future Improvements

- Mobile-first progressive web app support
- Stronger offline-first reporting flow
- Advanced escalation and SLA analytics
- Region-wise waste classification models
- Multilingual user experience expansion
- Automated before/after resolution comparison
- Public leaderboard and impact scoring refinements

---

## License

This project is licensed under the terms specified in the repository license.

---

## Acknowledgements

Built for civic accountability, cleaner neighborhoods, and faster public service response.
