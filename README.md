Sweet Shop Management System
This is a full‑stack Sweet Shop Management System built as a TDD kata. It simulates a simple mithai shop where users can browse sweets, search and filter them, and (optionally) purchase or manage inventory. The project is designed to show skills in API design, database modeling, frontend development, testing, and responsible AI usage.​

1. Project Overview
The application has three main parts:

A Spring Boot backend that exposes REST APIs for authentication, sweets management, and inventory actions.​

A PostgreSQL database that stores users, sweets, and related data.​

A React frontend that provides a modern single‑page UI for customers and admins.​

From a user’s perspective, the app allows:

Registering and logging in.

Viewing a catalog of traditional Indian sweets with images, prices, categories, and descriptions.

Searching sweets by name or description and filtering by category (Mithai, Ladoo, Barfi, Halwa, Namkeen).

Seeing which sweets are available and their prices.

From an admin’s perspective (depending on how far you implement):

Adding, editing, and deleting sweets.

Managing stock by restocking or marking purchases.

The goal is not just to “make it work”, but to follow clean architecture, tests, and modern dev practices.​

2. Tech Stack
Backend: Java, Spring Boot (REST API, Spring Security, Spring Data JPA).​

Database: PostgreSQL (persistent storage, not in‑memory).​

Frontend: React + TypeScript (SPA with modern component‑based UI).​

Build & Tools: Maven for backend, npm/Vite (or React scripts) for frontend.

Testing:

Backend: JUnit / Spring Boot test stack (unit + integration where implemented).

Frontend: Optional React testing (you can mention Jest/RTL if used).

3. Features Implemented
3.1 Authentication
User registration and login endpoints under /api/auth.

Token‑based authentication (JWT) to protect certain endpoints, such as sweets management and inventory operations.​

Frontend forms for registering and logging in, with context/state to store the current user session.

3.2 Sweets API
Core sweets endpoints (exact path names may vary slightly depending on your implementation):​

POST /api/sweets – Add a new sweet (admin).

GET /api/sweets – View all available sweets.

GET /api/sweets/search – Search sweets by name, category, or price range (if implemented).

PUT /api/sweets/{id} – Update sweet details (admin).

DELETE /api/sweets/{id} – Delete a sweet (admin only).

Each sweet has:

id – unique identifier.

name – e.g. Laddu, Jalebi.

description – short text description.

category – e.g. mithai, barfi, halwa, namkeen.

price – numeric value.

quantity – stock level (used with purchase/restock).

imageUrl – path to a local image served by Spring from src/main/resources/static/images/sweets/….

3.3 Inventory Operations
POST /api/sweets/{id}/purchase – Decrease quantity when a sweet is purchased; disabled when quantity is zero.​

POST /api/sweets/{id}/restock – Admin‑only endpoint to increase stock.​

3.4 Frontend Functionality
The React SPA includes:​

Auth Pages:

Register and Login forms that talk to the backend auth APIs.

Dashboard / Shop Page:

Displays all sweets with name, price, description, category badge, and image.

Category buttons (All Sweets, Mithai, Ladoo, Barfi, Halwa, Namkeen) to filter the list.

A search bar that filters sweets in real time by name and description, combined with the category filter.

A “Purchase” button on each sweet, disabled if quantity is 0 (if inventory is wired through).

Admin UI (if enabled):

Forms to add, edit, and delete sweets (hooked to the protected sweets endpoints).

Design:

Designed as a modern “Mithai Palace” style dashboard with card‑based layout, colors, fonts, and spacing tuned to look like a clean product UI.

4. How to Run the Project Locally
4.1 Prerequisites
Java 17+

Maven

Node.js and npm

PostgreSQL running locally (or accessible DB instance)

4.2 Set up the database
Create a PostgreSQL database user and database, for example:

Database: sweetshop

User: sweetshop_user

Password: your_password

Update the Spring Boot configuration (usually application.yml or application.properties) with your DB URL, username, and password, e.g.:

jdbc:postgresql://localhost:5432/sweetshop

Flyway migrations will run automatically on backend startup and create the schema, including the sweets table and new columns like image_url and category.

4.3 Run the backend
bash
cd backend
mvn spring-boot:run
The API will be available at http://localhost:8080.

Static images are served from src/main/resources/static/images/sweets, accessible via URLs like /images/sweets/laddu.jpg. Spring Security is configured to permit /images/** and public API endpoints, while protecting others.​

4.4 Run the frontend
bash
cd m-frontend
npm install
npm run dev
The React dev server will start (commonly on http://localhost:5173 or similar).

The frontend is configured to talk to the backend at http://localhost:8080 for API calls and images.

5. Testing & TDD
This kata expects Test‑Driven Development:​

Backend tests are written around core logic (e.g., sweets creation, purchase/restock rules, and possibly auth).

The goal is to follow Red → Green → Refactor cycles, which should be visible in the commit history:

First commit a failing test.

Then commit the implementation that makes it pass.

Then clean up and refactor when needed.

To run backend tests:

bash
cd backend
mvn test
If you have frontend tests (Jest/React Testing Library), they can be run from m-frontend with:

bash
npm test
You can export test reports or screenshots of the test output as part of the deliverables.

6. Screenshots
In the final repo, add a screenshots/ folder and include images such as:​

Login page.

Dashboard showing sweets with categories and search bar.

Admin page showing add/update sweet form.


7. My AI Usage
This project intentionally uses AI tools as part of the development workflow, following the kata’s AI usage policy.​

Tools Used
ChatGPT

Claude

Cursor AI (AI pair‑programming inside the IDE)

How AI was used
Brainstorming & design (ChatGPT):

Used to clarify the kata requirements in plain English, break down the work into phases (auth, sweets CRUD, images, categories, search), and design the API shape and entity relationships.

Helped reason about trade‑offs, such as doing search on the frontend vs backend first.​

Boilerplate & scaffolding (Cursor):

Used to generate initial Spring Boot boilerplate: controller skeletons, service interfaces, JPA entities, Flyway migration files, and some React components.

Used to add fields like imageUrl and category across entity, migration, repository, and DTO in a consistent way with minimal manual typing.

Debugging & fixes (ChatGPT + Claude):

Helped debug PostgreSQL authentication issues, schema mismatches, and Spring Security 403 errors for /api/sweets and /images/**.

Assisted in diagnosing why external image URLs (Unsplash, Pexels) were returning 403 due to hotlinking/CORS, and led to the decision to store images locally in resources/static.

Guided the implementation of the combined search + category filter on the frontend, including state handling and filtering logic.

Documentation & commit messages (ChatGPT):

Helped draft the README content you are reading now, keeping it aligned with the kata document and making sure the “My AI Usage” section is explicit.​

Suggested commit message formats that respect co-author requirements.

Co‑Authorship in Git
For commits where AI tools contributed significantly (for example, generating boilerplate code or suggesting a complete fix), co-author trailers were added, such as:

Co-authored-by: ChatGPT <chatgpt@users.noreply.github.com>

Co-authored-by: Claude <claude@users.noreply.github.com>

Co-authored-by: Cursor AI <cursor@users.noreply.github.com>

This makes the AI involvement transparent and keeps a clear audit trail in the commit history, as required by the kata.​

