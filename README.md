# PeopleDesk – Employee Management System

> An enterprise-grade, understated HR workforce management and employee directory system built with the MERN stack (MongoDB Atlas, Express.js, React 19, Node.js).

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Technology Stack](#-technology-stack)
3. [Key Features](#-key-features)
4. [Design System & Tokens](#-design-system--tokens)
5. [Project Architecture & Directory Structure](#-project-architecture--directory-structure)
6. [Prerequisites](#-prerequisites)
7. [Installation & Setup](#-installation--setup)
8. [Environment Variables](#-environment-variables)
9. [Running the Application](#-running-the-application)
10. [Database Configuration & Seeding](#-database-configuration--seeding)
11. [REST API Documentation](#-rest-api-documentation)
12. [Visual Dashboard & UI Layout](#-visual-dashboard--ui-layout)
13. [Testing & Quality Assurance](#-testing--quality-assurance)
14. [Security & Production Readiness](#-security--production-readiness)

---

## 🌟 Project Overview

**PeopleDesk** is a modern Employee Management System engineered for human resource operations. Built for enterprise reliability, it offers high-performance employee directory management, live workforce analytics, debounced searching, multi-criteria filtering, server-driven pagination, and instant RFC 4180 CSV export.

The application avoids SaaS design clichés (such as neon glassmorphism, oversized statistics cards, and unnecessary animations) in favor of a warm, restrained palette with clear typography and high data density.

---

## 🛠 Technology Stack

### Frontend
- **Framework**: React 19 (Hooks, Context, Functional Components)
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite`
- **Iconography**: Lucide React
- **HTTP Client**: Axios (configured with unified base URL and interceptors)
- **Linter**: Oxlint (0 warnings, 0 errors across all 21 components)

### Backend
- **Runtime**: Node.js (v20+)
- **Server Framework**: Express.js (ES Modules)
- **Database**: MongoDB Atlas
- **ODM**: Mongoose 9
- **Process Manager**: Nodemon
- **Security**: CORS origin restriction, centralized input validation, error shielding

---

## ✨ Key Features

- **Employee Lifecycle (CRUD)**:
  - Add personnel via a modal dialog with real-time field validation.
  - Inspect personnel records with avatar initials, role, and department.
  - Edit existing records with pre-populated fields and duplicate-conflict checks.
  - Delete records with an accessible confirmation dialog.
- **Interactive Status Management**:
  - Toggle between `Active` and `Inactive` status directly from the table.
  - In-flight request locking prevents rapid duplicate clicks.
  - Optimistic UI updates with automatic rollback on server error.
- **Search & Multi-Filter Engine**:
  - 350ms debounced search matching Full Name, Email, Department, and Designation.
  - Department filtering (Engineering, Product Design, Operations, Finance, HR, Marketing, Legal).
  - Status filtering (`Active` / `Inactive`).
  - Column sorting with ascending/descending visual indicators.
- **Live Workforce Dashboard**:
  - Live statistics calculated directly from MongoDB Atlas: Total Workforce, Active Personnel, Inactive Records, and Active Department count.
  - Visual department allocation percentage breakdown.
- **RFC 4180 CSV Export**:
  - Single-click export of filtered employee datasets with proper comma, quote, and newline escaping.
- **Non-Intrusive Notifications**:
  - Toast notification system with auto-dismissal for success, error, and info states.

---

## 🎨 Design System & Tokens

- **Canvas Background**: `#F7F7F5` (Warm off-white)
- **Sidebar Background**: `#202421` (Deep charcoal)
- **Primary Accent**: `#54745D` (Muted forest green)
- **Hover Accent**: `#45614D`
- **Primary Typography**: `#191C1A` (Near-black)
- **Secondary Typography**: `#5C625E` / `#79807B`
- **Borders & Dividers**: Thin 1px subtle lines (`#E2E4DE` / `#E8E8E3`)
- **Typography Stack**: Inter / system-ui sans-serif

---

## 📁 Project Architecture & Directory Structure

```text
peopledesk/
├── client/                               # Frontend Application
│   ├── public/
│   │   └── favicon.svg                   # Custom PeopleDesk SVG brand mark
│   ├── src/
│   │   ├── assets/                       # Static media (.gitkeep)
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Badge.jsx             # Atomic multi-variant chip
│   │   │   │   ├── Pagination.jsx        # Server-driven pagination bar
│   │   │   │   └── StatusBadge.jsx       # Interactive status toggle
│   │   │   ├── employees/
│   │   │   │   ├── DeleteConfirmationModal.jsx # Deletion safeguard modal
│   │   │   │   ├── EmployeeDirectoryView.jsx   # Directory view orchestrator
│   │   │   │   ├── EmployeeModal.jsx     # Reusable Add & Edit form modal
│   │   │   │   ├── EmployeeTable.jsx     # Data table with loading skeletons
│   │   │   │   └── FilterControls.jsx    # Debounced search & dropdowns
│   │   │   ├── layout/
│   │   │   │   ├── AppLayout.jsx         # Responsive desktop/mobile shell
│   │   │   │   ├── Header.jsx            # Top navigation bar
│   │   │   │   └── Sidebar.jsx           # Persistent charcoal sidebar
│   │   │   ├── overview/
│   │   │   │   └── OverviewView.jsx      # Live workforce metrics dashboard
│   │   │   └── settings/
│   │   │       └── SettingsView.jsx      # System settings and environment state
│   │   ├── context/
│   │   │   ├── ToastContextDef.js        # React context instance
│   │   │   ├── ToastContext.jsx          # Toast container & provider
│   │   │   └── useToast.js               # Toast hook
│   │   ├── services/
│   │   │   ├── api.js                    # Base Axios instance & interceptors
│   │   │   └── employeeService.js        # Employee REST API service layer
│   │   ├── App.jsx                       # Application root
│   │   ├── index.css                     # Tailwind v4 theme & global styles
│   │   └── main.jsx                      # DOM mount
│   ├── .env.example                      # Client environment template
│   ├── index.html                        # Application entry point
│   ├── package.json                      # Client dependencies & scripts
│   └── vite.config.js                    # Vite configuration
├── server/                               # Backend Application
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                     # MongoDB connection with credential masking
│   │   ├── controllers/
│   │   │   └── employeeController.js     # Express CRUD controllers
│   │   ├── middleware/
│   │   │   ├── errorHandler.js           # Centralized JSON error handler
│   │   │   └── notFound.js               # 404 handler
│   │   ├── models/
│   │   │   └── Employee.js               # Mongoose schema with validations
│   │   ├── routes/
│   │   │   ├── api.js                    # Root API router & /health
│   │   │   └── employeeRoutes.js         # Employee REST routes
│   │   └── server.js                     # Express application bootstrap
│   ├── .env.example                      # Server environment template
│   ├── package.json                      # Server dependencies & scripts
│   ├── seed.js                           # Initial database seeder
│   ├── test-phase3.js                    # Frontend-backend integration suite
│   └── test-suite.js                     # Complete backend CRUD test suite
├── .gitignore                            # Git exclusion rules
├── package.json                          # Root repository orchestration
└── README.md                             # Documentation
```

---

## ⚙️ Prerequisites

- **Node.js**: `v20.0.0` or higher (tested with `v22.20.0`)
- **npm**: `v10.0.0` or higher (tested with `v10.9.3`)
- **MongoDB Atlas**: An active MongoDB Atlas cluster URI or local MongoDB instance

---

## 🔑 Environment Variables

### Backend Configuration (`server/.env`)

Copy `server/.env.example` to `server/.env`:

```bash
cp server/.env.example server/.env
```

Configure the following variables:

```env
# Server port
PORT=5000

# Environment mode (development / production)
NODE_ENV=development

# MongoDB Atlas Connection URI (Replace placeholders with your cluster details)
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/peopledesk?retryWrites=true&w=majority

# Permitted Client Origin for CORS
CLIENT_URL=http://localhost:5173
```

> **Security Note**: Never commit `server/.env` to Git. The `.gitignore` file is pre-configured to strictly ignore all `.env` files.

### Frontend Configuration (`client/.env`)

Copy `client/.env.example` to `client/.env`:

```bash
cp client/.env.example client/.env
```

```env
# Target API Base URL
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Running the Application

### 1. Install Dependencies

Install root, client, and server dependencies:

```bash
# In client/
cd client && npm install && cd ..

# In server/
cd server && npm install && cd ..
```

### 2. Seed Database (Optional)

Populate MongoDB Atlas with 6 initial enterprise employee records:

```bash
npm run seed:server
```

### 3. Start Development Servers

Run from the repository root:

```bash
# Terminal 1: Start Express API server (http://localhost:5000)
npm run dev:server

# Terminal 2: Start Vite React client (http://localhost:5173)
npm run dev:client
```

Open your browser at `http://localhost:5173`.

---

## 📡 REST API Documentation

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description | Request Body / Query Params | Success Status |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/health` | Server and MongoDB Atlas readiness probe | None | `200 OK` |
| `GET` | `/employees` | List employees with search, filter, sort & pagination | `?search=`, `?department=`, `?status=`, `?sortBy=`, `?sortOrder=`, `?page=`, `?limit=` | `200 OK` |
| `GET` | `/employees/:id` | Retrieve single employee by MongoDB ObjectId | URL param `:id` | `200 OK` |
| `POST` | `/employees` | Create a new employee | `{ fullName, email, department, designation, status? }` | `201 Created` |
| `PUT` | `/employees/:id` | Update existing employee details | `{ fullName?, email?, department?, designation?, status? }` | `200 OK` |
| `PATCH` | `/employees/:id/status` | Update employee status (`Active` / `Inactive`) | `{ status: "Active" \| "Inactive" }` | `200 OK` |
| `DELETE` | `/employees/:id` | Permanently delete employee record | URL param `:id` | `200 OK` |

### Query Parameter Details for `GET /api/employees`

- `search` *(string)*: Case-insensitive regex across `fullName`, `email`, `department`, and `designation`.
- `department` *(string)*: Exact or case-insensitive match for department name.
- `status` *(string)*: Filters by `Active` or `Inactive`.
- `sortBy` *(string)*: Sort field (`fullName`, `department`, `designation`, `status`, `createdAt`).
- `sortOrder` *(string)*: `asc` or `desc` (default: `desc`).
- `page` *(number)*: Active page (default: `1`).
- `limit` *(number)*: Records per page (default: `10`, maximum: `100`).

---

## 🖥 Visual Dashboard & UI Layout

```text
+------------------------------------------------------------------------------------------------+
|  [PeopleDesk HRMS]  |  Human Resources / Directory                 [Search ⌘K]  [🔔] [AD Admin]|
+------------------------------------------------------------------------------------------------+
|  📊 Overview        |  Employee Directory                                                      |
|  👥 Employees (●)   |  Manage organization members, verify roles, and monitor headcount.      |
|  ⚙️ Settings         |  [🔄 Refresh]  [📥 Export CSV]  [+ Add Employee]                        |
|                     |--------------------------------------------------------------------------|
|                     |  [🔍 Search by name...]  [Dept: All ▾]  [Status: All ▾]  [↺ Reset]       |
|                     |--------------------------------------------------------------------------|
|                     |  EMPLOYEE        DEPARTMENT       DESIGNATION       STATUS    ACTIONS    |
|                     |  SJ S. Jenkins   Engineering      Staff Architect   ● Active  [Edit][🗑] |
|                     |  MV M. Vance     Product Design   UX Lead           ● Active  [Edit][🗑] |
|                     |  DS D. Sterling  Engineering      Security Lead     ○ Inactive[Edit][🗑] |
|                     |--------------------------------------------------------------------------|
|                     |  Showing 1 to 3 of 3 employee records                      [ < ][ 1 ][ > ]|
|  [● Operational]    |                                                                          |
+------------------------------------------------------------------------------------------------+
```

---

## 🧪 Testing & Quality Assurance

All test suites can be executed directly from the root repository:

```bash
# 1. Run complete backend CRUD, validation, and error test suite (21 assertions)
npm run test:server

# 2. Run frontend-backend end-to-end integration test suite (13 assertions)
npm run test:phase3

# 3. Build frontend bundle for production
npm run build:client

# 4. Run frontend linter (oxlint)
npm run lint:client
```

---

## 🔒 Security & Production Readiness

- **Secret Isolation**: All credentials reside exclusively in `server/.env`. Neither connection strings nor passwords are committed to source control or logged to the console.
- **Log Masking**: Database connection logs only report the remote cluster hostname (`conn.connection.host`) without revealing credentials.
- **CORS Protection**: Restricted to `CLIENT_URL` with credentials support.
- **Server Safety**: Express awaits MongoDB connection before opening the listening socket.
- **RFC 4180 CSV Compliant**: Escapes double quotes (`""`), commas, and special characters with UTF-8 BOM encoding.
- **Git State**: Verified clean git tree with `.env`, `node_modules`, and `dist` safely ignored.

---

## 📦 Recommended Git Workflow

To commit the clean project to your Git repository:

```bash
# Check status to verify .env is ignored
git status

# Stage all project files
git add .

# Create initial production release commit
git commit -m "feat: complete PeopleDesk Employee Management System (MERN Stack)"

# Link your GitHub remote repository (replace with your repository URL)
git remote add origin https://github.com/<your-username>/peopledesk.git
git branch -M main

# Push to GitHub
git push -u origin main
```
