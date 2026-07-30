# GDG On Campus HIT – Management Portal (Frontend)

## Overview

This repository contains the **frontend** of the GDG On Campus HIT Management Portal.

It is intended for the frontend team to collaboratively build and improve the user interface while the backend team develops the APIs and business logic separately.

At this stage, the project focuses only on the UI, navigation, layouts, responsiveness, and overall user experience. Backend integration will be done once the corresponding APIs are available.

---

# Frontend Status

### ✅ Completed

- Complete application UI
- Responsive layouts (Desktop, Tablet & Mobile)
- Dashboard
- Calendar
- Tasks
- Meetings
- Registry
- Applications
- Repository
- Forms
- Chat
- Notifications
- Admin Panel
- Profile
- Settings
- Authentication Screens (UI)
- Shared Components
- Dark Mode
- Navigation & Routing

### 🚧 Backend Integration Pending

The following features currently contain placeholder actions and will be connected to real backend APIs later.

- User Login & Authentication
- Task CRUD Operations
- Meeting CRUD Operations
- Repository Upload & Download
- Form Submission
- Notifications
- Chat Messaging
- User Management
- Leave Applications
- Dashboard Analytics
- File Storage
- Email / Push Notifications

---

# Tech Stack

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- SWR
- Lucide Icons
- Recharts

---

# Getting Started

Clone the repository

```bash
git clone <repository-url>
```

Go to the frontend folder

```bash
cd web
```

Install dependencies

```bash
npm install
```

Start the development server

```bash
npm run dev
```

Open

```
http://localhost:3000
```

---

# Project Structure

```
web/
│
├── src/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── styles/
│   └── types/
│
├── public/
│
├── package.json
└── README.md
```

---

# Working with the Backend

This repository intentionally **does not contain backend code**.

There are:

- No API routes
- No database
- No authentication server
- No ORM
- No backend services

Pages that require backend functionality currently contain placeholder handlers (for example `TODO: Connect Backend API`) so the UI can be developed independently.

Once the backend APIs are ready, these placeholders can be replaced with actual API calls without redesigning the interface.

---

## Repository Purpose

This repository is maintained by the frontend team for UI development.

The backend will be developed and integrated separately. Until then, pages render using static placeholder data and empty states so the interface can be designed, reviewed, and improved independently.

When backend APIs become available, placeholder handlers can be replaced with real API calls without redesigning the UI.

---

# Contribution Guidelines

If you're working on the frontend:

- Keep the UI responsive.
- Reuse existing components whenever possible.
- Follow the current design system.
- Avoid changing project structure unless necessary.
- Write clean and readable code.
- Remove unused code before creating a pull request.
- Test your changes on desktop and mobile layouts.

Before pushing changes, run:

```bash
npm run lint
npm run build
```

---

# Notes

- This repository is maintained only for the frontend development team.
- Backend development is handled in a separate repository.
- Please avoid adding backend logic, databases, authentication services, or environment variables to this project.

---

Happy Coding! 🚀
