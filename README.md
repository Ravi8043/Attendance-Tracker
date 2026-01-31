# Attendance Tracker

A full-stack web application for tracking class attendance. Built in one week to learn React, TypeScript, Django REST Framework, and production deployment workflows.

🌐 **Live Demo:** [https://attendancetracker-bay.vercel.app](https://attendancetracker-bay.vercel.app)

## What It Does

- User registration and JWT authentication
- Add and manage subjects
- Mark attendance (present/absent)
- View attendance percentage per subject
- Track overall attendance statistics
- Manage class timetable

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite
- React Router
- Axios (with JWT interceptors)
- TailwindCSS

**Backend:**
- Django 5
- Django REST Framework
- PostgreSQL (Supabase)
- JWT Authentication (simplejwt)
- Gunicorn

**Deployment:**
- Frontend: Vercel
- Backend: Render
- Database: Supabase (PostgreSQL with connection pooling)

## What I Learned

This was a learning project focused on full-stack fundamentals:

- **Production deployment** - Configured CORS, environment variables, SSL, and database connection pooling
- **JWT authentication** - Implemented access/refresh tokens with automatic token refresh on expiration
- **TypeScript patterns** - Built type-safe React components with proper error handling
- **Debugging production issues** - Solved CORS conflicts, database connection errors (IPv6 vs IPv4), CSRF middleware configuration
- **API design** - RESTful endpoints with proper authentication and authorization

The goal was to build deployment muscle memory before moving on to AI/ML projects.

## Local Setup

### Backend
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Create a `.env` file in `/backend`:
```env
DATABASE_URL=your_postgresql_url
SECRET_KEY=your_secret_key
DEBUG=True
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Create a `.env` file in `/frontend`:
```env
VITE_API_BASE_URL=http://localhost:8000
```

## Project Structure
```
├── backend/
│   ├── accounts/        # User authentication
│   ├── attendance/      # Attendance tracking
│   ├── subjects/        # Subject management
│   ├── timetable/       # Timetable management
│   └── backend/         # Django settings
│
└── frontend/
    ├── src/
    │   ├── api/         # Axios instance + API calls
    │   ├── components/  # React components
    │   ├── context/     # Auth context
    │   ├── pages/       # Route pages
    │   └── types/       # TypeScript types
    └── package.json
```

## API Endpoints

**Auth:**
- `POST /api/v1/accounts/register/` - Register new user
- `POST /api/v1/accounts/token/` - Login (get JWT)
- `POST /api/v1/accounts/token/refresh/` - Refresh access token

**Subjects:**
- `GET /api/v1/subjects/` - List subjects
- `POST /api/v1/subjects/` - Create subject
- `DELETE /api/v1/subjects/{id}/` - Delete subject

**Attendance:**
- `GET /api/v1/attendance/` - List attendance records
- `POST /api/v1/attendance/` - Mark attendance
- `GET /api/v1/attendance/overall-stats/` - Get statistics

## Deployment Notes

- Backend uses connection pooling (port 6543) for Supabase to avoid IPv6 connection issues on Render
- JWT tokens stored in localStorage with automatic refresh via Axios interceptors
- CORS configured for cross-origin requests between Vercel and Render
- Static files served via WhiteNoise

## What's Next

This project served its purpose as a React learning exercise. Moving forward to AI/ML projects focused on LLM agents, RAG systems, and model deployment.

---

**Built by** [Ravi](https://github.com/Ravi8043) | Learning in public 
