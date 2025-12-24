# Mqudah Platform API (Backend)

The backend service for the Mqudah Platform, built with [NestJS](https://nestjs.com/).

## Description
This service provides the REST API for the educational platform, handling authentication, course management, student enrollment, and payments. It serves as the single source of truth for all business logic.

## Setup Local Environment

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Database**:
    Ensure PostgreSQL is running (via Docker in root):
    ```bash
    docker compose up -d
    ```
3.  **Environment Variables**:
    Copy `.env.example` to `.env`:
    ```bash
    cp .env.example .env
    ```
    *See `.env.example` for all required keys (DATABASE_URL, JWT_SECRET, etc).*

## Running the Application

*   **Development**:
    ```bash
    npm run start:dev
    ```
*   **Production**:
    ```bash
    npm run build
    npm run start:prod
    ```

## Automated Tests

*   **Unit Tests**:
    ```bash
    npm run test
    ```
*   **E2E Tests**:
    ```bash
    npm run test:e2e
    ```

## API Documentation
Interactive API documentation is currently under development (Swagger/OpenAPI).
Access it at `/api/docs` when the server is running.
