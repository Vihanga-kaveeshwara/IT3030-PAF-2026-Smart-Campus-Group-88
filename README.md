# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Smart Campus Operations Hub — IT3030 PAF 2026

Group project for IT3030 Programming Applications and Frameworks.

## Stack
- **Backend:** Java 21, Spring Boot 3.4, Spring Data MongoDB, Spring Security, OAuth 2.0
- **Frontend:** React (Vite), React Router, Axios
- **Database:** MongoDB
- **Version Control:** Git + GitHub Actions

## Project Structure
- `smart-campus-api/` — Spring Boot REST API
- `smart-campus-client/` — React web application

## Setup Instructions

### Backend
1. Ensure Java 21 and Maven are installed
2. Install and start MongoDB locally (port 27017)
3. `cd smart-campus-api`
4. `mvn spring-boot:run`
5. API runs at `http://localhost:8080`
6. Health check: `GET http://localhost:8080/api/health`

### Frontend
1. `cd smart-campus-client`
2. `npm install`
3. `npm run dev`
4. App runs at `http://localhost:5173`

## Branching Strategy
- `main` — stable, tested code only
- `dev` — integration branch, merge features here first
- `feature/module-a-resources` — Member 1
- `feature/module-b-bookings` — Member 2
- `feature/module-c-tickets` — Member 3
- `feature/module-d-notifications-auth` — Member 4

## Team Contributions
| Member | Module | Endpoints |
|--------|--------|-----------|
| Member 1 | Facilities & Assets Catalogue | TBD |
| Member 2 | Booking Management | TBD |
| Member 3 | Incident Ticketing | TBD |
| Member 4 | Notifications + OAuth | TBD |