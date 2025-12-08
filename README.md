# Scripture Mind - Bible Memory App

A progressive Bible memory application that helps users memorize verses by gradually hiding words.

## Tech Stack

- **Backend:** Django 5+ with Django REST Framework
- **Frontend:** React (Vite) with Tailwind CSS
- **Database:** SQLite (persistent volume on Fly.io)
- **Authentication:** Google OAuth2 via django-allauth
- **Deployment:** Fly.io with Docker

## Features

- Google OAuth authentication
- Add and manage Bible verses
- Progressive word hiding for memorization
- Three verse states: Upcoming, In Progress, Memorized
- Recall helper for memorized verses

## Local Development

### Prerequisites

- Python 3.11+
- Node.js 20+
- npm or yarn

### Quick Start

Follow these steps to run the app locally in development mode:

#### 1. Backend Setup

```bash
# Create and activate a virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py migrate

# Create a superuser for admin access (optional but recommended)
python manage.py createsuperuser

# Start the Django development server
python manage.py runserver
```

The backend will be available at `http://localhost:8000`

#### 2. Frontend Setup (in a new terminal)

```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start the Vite development server
npm run dev
```

The frontend development server will be available at `http://localhost:5173`

#### 3. Running Both Together

For the best development experience, run both servers simultaneously:

**Terminal 1 (Backend):**
```bash
python manage.py runserver
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

Then open your browser to `http://localhost:5173` - the Vite dev server is configured to proxy API requests to the Django backend at `http://localhost:8000`.

### Development Workflow

- **Backend changes**: The Django development server auto-reloads when you modify Python files
- **Frontend changes**: Vite provides hot module replacement (HMR) for instant updates
- **Database changes**: After modifying models, run `python manage.py makemigrations` then `python manage.py migrate`

### Access Points

- **Frontend (Development)**: http://localhost:5173
- **Backend API**: http://localhost:8000/api/
- **Django Admin**: http://localhost:8000/admin/
- **API Documentation**: http://localhost:8000/api/ (browsable API via DRF)

### Common Issues

**Port already in use:**
- Django: Use `python manage.py runserver 8001` to run on a different port
- Vite: The dev server will automatically try the next available port

**CSRF token issues:**
- Make sure both frontend and backend are running
- Check that cookies are enabled in your browser
- The frontend dev server is configured to proxy requests to Django

**Database locked:**
- SQLite doesn't handle concurrent writes well. If you get database locked errors, restart the Django server.

### Building for Production

```bash
# Build frontend
cd frontend
npm run build
cd ..

# Collect static files
python manage.py collectstatic --noinput
```

## Deployment to Fly.io

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login to Fly.io
fly auth login

# Create app and volume
fly launch --no-deploy
fly volumes create scripture_mind_data --region ord --size 1

# Deploy
fly deploy
```

## Project Structure

```
.
├── backend/          # Django project settings
├── frontend/         # React Vite application
├── manage.py         # Django management script
├── Dockerfile        # Multi-stage Docker build
├── fly.toml          # Fly.io configuration
└── requirements.txt  # Python dependencies
```

## License

MIT
