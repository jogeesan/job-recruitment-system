# job-recruitment-system

Job Recruitment & Applicant Tracking System built with React, Spring Boot, and PostgreSQL.

## Stack

- **Backend:** Java 21, Spring Boot 4.1 (Web, Data JPA, Validation), Maven — [`/backend`](backend)
- **Frontend:** React + TypeScript, Vite — [`/frontend`](frontend)
- **Database:** PostgreSQL (Local)

## Prerequisites

- JDK 21+
- Node.js 20+
- PostgreSQL (Installed locally)

## Running locally

**1. Prepare the Database**

Ensure PostgreSQL service is running and create the `recruitment` database:

```sql
CREATE DATABASE recruitment;
```

Update your database credentials in [backend/src/main/resources/application.properties](file:///c:/Users/Jogeesan/Desktop/job-recruitment-system/backend/src/main/resources/application.properties) if your username/password differs from the defaults (`postgres` / `postgres`).

**2. Start the backend**

```bash
cd backend
./mvnw spring-boot:run
```

Runs on `http://localhost:8080`. Verify with `curl http://localhost:8080/api/health`.

**3. Start the frontend**

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173` and proxies `/api/*` requests to the backend (see `frontend/vite.config.ts`). The home page pings `/api/health` to confirm the two are wired up.

## Project layout

```
backend/    Spring Boot API (Maven)
frontend/   React + TypeScript app (Vite)
myQurery.sql Database Schema scripts
```

## Next steps

- Define the core domain (Job, Employer, Applicant, Application, roles) as JPA entities in `backend`.
- Add Spring Security + auth (JWT or session-based) once the domain model is in place.
- Replace the health-check placeholder on the frontend home page with real routes/pages.
