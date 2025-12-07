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

### Backend Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

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
