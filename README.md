# job-recruitment-system

Job Recruitment & Applicant Tracking System built with React, Spring Boot, and PostgreSQL.

## Stack

- **Backend:** Java 21, Spring Boot 4.1 (Web, Data JPA, Validation), Maven — [`/backend`](backend)
- **Frontend:** Next.js 16 (React 19, TypeScript, Tailwind CSS v4, App Router) — [`/frontend`](frontend)
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

Runs on `http://localhost:8080`.

**3. Start the frontend**

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:3000`.

## Project layout

```
backend/    Spring Boot API (Maven)
frontend/   Next.js App Router (TypeScript, Tailwind CSS)
myQurery.sql Database Schema scripts
```

## Next steps

- Define the core domain (Job, Employer, Applicant, Application, roles) as JPA entities in `backend`.
- Add Spring Security + auth (JWT or session-based) once the domain model is in place.
- Build out the frontend home page with real routes/pages.
