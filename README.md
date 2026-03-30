# Kanban App

![Kanban App Overview](https://img.shields.io/badge/Status-Active-success)
![Next.js](https://img.shields.io/badge/Next.js-15.1.9-black?logo=next.js)
![NestJS](https://img.shields.io/badge/NestJS-11.0.1-red?logo=nestjs)
![Prisma](https://img.shields.io/badge/Prisma-7.4.2-blue?logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2.1-38B2AC?logo=tailwind-css)

A full-stack, responsive, and secure Kanban board application designed to help users efficiently organize and track their tasks.

**Live Frontend Demo:** [Kanban App on Vercel](https://kanban-app-livid-nine.vercel.app/)  
  *(Demo Credentials — Email: `test@test.com` | Password: `test123`)*  
**Live Backend Swagger UI:** [Kanban API on Render](https://kanban-backend-qd2o.onrender.com/api)

## Features

- **Secure Authentication:** User registration, login, and protected routes using JWT tokens and bcrypt.
- **Interactive Kanban Board:** Drag-and-drop tasks between "To Do", "In Progress", and "Done" columns smoothly using `@dnd-kit`.
- **Task Management:** Create, read, update, and delete tasks with specific statuses and priorities (Low, Medium, High).
- **Advanced Filtering & Search:** Real-time search by task title/description and filtering by priority, synchronized with URL parameters using `nuqs`.
- **Analytics Dashboard:** Visualize task distribution and completion rates with vibrant charts and statistics counters.
- **Responsive Design:** A polished, modern UI built with Tailwind CSS, Shadcn UI components, and Radix UI primitives.

## Technology Stack

### Frontend (`/client`)

- **Framework:** Next.js 15 (App Router, React 19)
- **Styling:** Tailwind CSS 4, Tailwind-merge, clsx
- **UI Components:** Shadcn UI, Radix UI, Tremor (for charts), Lucide React (icons)
- **State & Data Management:** React Query (TanStack), `nuqs` (URL state)
- **Drag & Drop:** `@dnd-kit/core`, `@dnd-kit/sortable`
- **Testing:** Vitest, React Testing Library
- **Deployment:** Vercel

### Backend (`/server`)

- **Framework:** NestJS 11
- **Database:** PostgreSQL (Hosted on [Neon.tech](https://neon.tech/))
- **ORM:** Prisma Client & Adapter-PG
- **Authentication:** Passport, JWT (`@nestjs/jwt`), bcryptjs
- **Validation:** `class-validator`, `class-transformer`
- **Documentation:** Swagger (`@nestjs/swagger`)
- **Testing:** Jest, Supertest
- **Deployment:** Render

---

## Getting Started (Local Development)

### Prerequisites

- Node.js (v20 or higher)
- npm or yarn
- A PostgreSQL database (or a Neon.tech connection string)

### 1. Clone the repository

```bash
git clone https://github.com/rafiquee3/Kanban-app.git
cd Kanban-app
```

### 2. Backend Setup (`/server`)

Navigate to the server directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Set up Environment Variables:
Create a `.env` file in the `/server` root and add the following:

```env
DATABASE_URL="postgresql://<USER>:<PASSWORD>@<HOST>:<PORT>/<DATABASE>?sslmode=require"
JWT_SECRET="your_super_secret_jwt_key_here"
PORT=4000
```

Initialize the database schema:

```bash
npx prisma db push
```

_(Note: Prisma client is generated automatically via the `postinstall` script)._

Start the development server:

```bash
npm run start:dev
```

The API will be running at `http://localhost:4000`. You can view the Swagger documentation at `http://localhost:4000/api`.

### 3. Frontend Setup (`/client`)

Open a new terminal session and navigate to the client directory:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Set up Environment Variables:
Create a `.env.local` file in the `/client` root:

```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

Start the development server:

```bash
npm run dev
```

The frontend will be running at `http://localhost:3000`.

---

## Run with Docker

For a quick and consistent setup across different environments, you can use Docker Compose. This will spin up the Frontend, Backend, and a local PostgreSQL database automatically.

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### Quick Start

1. **Configure Environment Variables:**
   Ensure you have a `.env` file in the **root directory** of the project. It should contain the database credentials and JWT secret. Example:
   ```env
   DB_USER=rafiquee
   DB_PASSWORD=skl123456
   DB_NAME=task_db
   JWT_SECRET=your_jwt_secret
   ```

2. **Build and Start:**
   Run the following command from the root folder:
   ```bash
   docker-compose up --build
   ```

3. **Access the Services:**
   - **Frontend:** [http://localhost:3000](http://localhost:3000)
   - **Backend API:** [http://localhost:4000](http://localhost:4000)
   - **Swagger UI:** [http://localhost:4000/api](http://localhost:4000/api)

4. **Demo Credentials:**
   You can log in to the application (both locally and on the demo site) using the following test account:
   - **Email:** `test@test.com`
   - **Password:** `test123`

5. **Stopping:**
   To stop and remove the containers, run:
   ```bash
   docker-compose down
   ```

---

## Running Tests

Both the frontend and backend contain automated test suites to ensure code reliability.

### Backend Tests (NestJS / Jest)

```bash
cd server

# Run unit tests
npm run test

# Run integration tests (Requires .env.test configured)
npm run test:int
```

### Frontend Tests (Next.js / Vitest)

```bash
cd client

# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch
```

---

## Deployment Details

- The **PostgreSQL database** is managed via **Neon.tech** for serverless scaling.
- The **NestJS API** is hosted on **Render** (Web Service), utilizing a fast, reliable Node environment.
- The **Next.js Frontend** is deployed via **Vercel**, taking advantage of their global Edge Network.

## License

This project is explicitly marked as UNLICENSED. Please contact the author for usage permissions.
