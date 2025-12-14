Sweet Shop Management System

A full-stack Sweet Shop Management System built as a Test-Driven Development (TDD) kata.
The application simulates a traditional Indian mithai shop where users can browse, search, and filter sweets, while admins can manage inventory.

This project demonstrates clean architecture, REST API design, database modeling, frontend development, testing discipline, and responsible AI usage, aligned with the kata requirements.

1. Project Overview

The application consists of three main layers:

Backend (Spring Boot)

Exposes REST APIs for authentication, sweets management, and inventory operations.

Database (PostgreSQL)

Stores users, sweets, categories, pricing, stock levels, and image references.

Managed using Flyway migrations (persistent storage, not in-memory).

Frontend (React + TypeScript)

A modern single-page application (SPA) for customers and administrators.

User Capabilities

Register and log in

View a catalog of traditional Indian sweets

Search sweets by name or description

Filter sweets by category

View availability and pricing

Purchase sweets (disabled when out of stock)

Admin Capabilities

Add, update, and delete sweets

Restock inventory

Control availability through quantity management

The goal is not just functionality, but maintainable, testable, and well-structured code following modern development practices.

2. Tech Stack
Backend

Java 17

Spring Boot

Spring Security (JWT-based authentication)

Spring Data JPA

Flyway (database migrations)

Database

PostgreSQL (persistent storage)

Frontend

React

TypeScript

Vite / npm

Build & Tooling

Maven (backend)

npm (frontend)

Testing

Backend: JUnit, Spring Boot Test (unit + integration tests)

Frontend: Optional Jest / React Testing Library (if implemented)

3. Features Implemented
3.1 Authentication

User registration and login under /api/auth

JWT-based authentication

Protected endpoints for admin and inventory operations

Frontend authentication forms with session handling

3.2 Sweets API

Core REST endpoints (paths may vary slightly):

POST /api/sweets – Add a new sweet (admin)

GET /api/sweets – Fetch all sweets

GET /api/sweets/search – Search by name, category, or other filters

PUT /api/sweets/{id} – Update sweet details (admin)

DELETE /api/sweets/{id} – Delete a sweet (admin)

Each sweet includes:

id

name

description

category (mithai, ladoo, barfi, halwa, namkeen)

price

quantity

imageUrl (served locally from static resources)

3.3 Inventory Operations

POST /api/sweets/{id}/purchase – Decrease stock on purchase

POST /api/sweets/{id}/restock – Increase stock (admin only)

Purchase is disabled when quantity reaches zero (backend + UI validation)

3.4 Frontend Functionality

Authentication Pages

Login and registration forms integrated with backend APIs

Dashboard / Shop Page

Card-based layout displaying sweets with images

Category filters (All, Mithai, Ladoo, Barfi, Halwa, Namkeen)

Real-time search by name and description

Purchase button disabled when out of stock

Admin UI

Add, update, and delete sweets

Inventory management via protected APIs

Design

Clean, modern “Mithai Palace” themed UI

Focus on usability, spacing, and visual clarity

4. How to Run the Project Locally
4.1 Prerequisites

Java 17+

Maven

Node.js & npm

PostgreSQL (local or remote)

4.2 Database Setup

Create a PostgreSQL database:

Database: sweetshop

User: sweetshop_user

Password: your_password

Update application.yml or application.properties:

jdbc:postgresql://localhost:5432/sweetshop


Flyway migrations will automatically create the schema, including tables and columns such as image_url and category.

4.3 Run the Backend
cd backend
mvn spring-boot:run


Backend runs at:
http://localhost:8080

Static images are served from:
src/main/resources/static/images/sweets/

Spring Security allows public access to /images/** and authentication endpoints.

4.4 Run the Frontend
cd m-frontend
npm install
npm run dev


Frontend runs at:
http://localhost:5173 (or similar)

5. Testing & TDD

This project follows Test-Driven Development (TDD) principles:

Tests written before implementation

Red → Green → Refactor cycles

Commit history reflects incremental development

Run Backend Tests
cd backend
mvn test

Run Frontend Tests (if implemented)
cd m-frontend
npm test

6. Test Report

Backend test suite executed using JUnit and Spring Boot Test

Core business rules covered (sweet creation, purchase, restock)

Authentication and validation logic tested

All tests passing at time of submission

7. Screenshots

A screenshots/ folder can be added containing:

Login page

Dashboard showing sweets, filters, and search

Admin management screens

8. Kata Requirements Mapping
Requirement	Status	Evidence
RESTful Backend API	✅ Completed	Spring Boot controllers
Persistent Database	✅ Completed	PostgreSQL + Flyway
JWT Authentication	✅ Completed	/api/auth endpoints
Sweets CRUD	✅ Completed	/api/sweets
Inventory Purchase	✅ Completed	/purchase endpoint
Inventory Restock	✅ Completed	/restock endpoint
Frontend SPA	✅ Completed	React + TypeScript
Search & Filter	✅ Completed	UI + backend support
Disable Purchase on Zero Stock	✅ Completed	Backend + UI validation
TDD & Tests	✅ Completed	JUnit tests
Git Commit Quality	✅ Completed	Incremental commits
AI Usage Transparency	✅ Completed	“My AI Usage” section
Deployment	⚠️ Optional	Attempted (not required)
9. My AI Usage

This project intentionally uses AI tools as part of the development workflow, following responsible and transparent practices.

Tools Used

ChatGPT

Claude

Cursor AI (IDE-integrated pair programming)

How AI Was Used

1. Brainstorming & Design (ChatGPT)

Clarified kata requirements

Broke work into phases (auth, CRUD, inventory, frontend)

Designed API structure and entity relationships

Evaluated trade-offs (frontend vs backend filtering)

2. Boilerplate & Scaffolding (Cursor AI)

Generated initial Spring Boot skeletons

Created JPA entities and Flyway migrations

Assisted in propagating new fields consistently

3. Debugging & Problem Solving (ChatGPT + Claude)

Diagnosed PostgreSQL and schema issues

Resolved Spring Security access issues

Addressed image hosting and CORS problems

Assisted with combined search and filter logic

4. Documentation & Communication (ChatGPT)

Helped draft and structure this README

Suggested clear commit message formats

Reflection on AI Impact

AI improved development speed and clarity, especially during early design and debugging.
All AI-generated suggestions were reviewed, modified, and validated manually.

AI was used as a pair programmer, not a replacement for understanding or ownership.

Co-Authorship Transparency

For commits where AI contributed substantially, co-author trailers were added:

Co-authored-by: ChatGPT <chatgpt@users.noreply.github.com>
Co-authored-by: Claude <claude@users.noreply.github.com>
Co-authored-by: Cursor AI <cursor@users.noreply.github.com>


This maintains a clear audit trail, as required by the kata.

10. Limitations & Trade-offs

Frontend testing was kept minimal to prioritize backend TDD and business rules.

Deployment is optional per kata guidelines; focus was placed on correctness, testing, and architecture.

Some search and filtering logic is handled on the frontend for responsiveness.

 Final Note

This submission focuses on engineering quality, clarity of thought, and responsible AI usage, in line with the kata’s evaluation criteria
