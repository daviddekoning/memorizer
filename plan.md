# Project Implementation Brief: Bible Memory App

## 1. Project Overview
We are building a simple Bible memory application called "Scripture Mind". 
The app helps users memorize verses by progressively hiding words in a text.
It is a single-page application (SPA) served by a Django backend, deployed on a single Fly.io machine with a persistent SQLite volume.

## 2. Tech Stack & Architecture
- **Backend:** Django 5+ (Python 3.11+), Django REST Framework (DRF).
- **Database:** SQLite (persisted via Docker Volume on Fly.io).
- **Frontend:** React (Vite), Tailwind CSS (optional, but preferred for speed).
- **Authentication:** Django Session Authentication (Cookies). Google OAuth2 via `django-allauth`.
- **Deployment:** Fly.io (Single container: Django serves React static files via Whitenoise).

## 3. Data Model
### Core App: `core`

#### Model: `Verse`
- `user`: ForeignKey to User (Cascade).
- `reference`: CharField (e.g., "John 3:16").
- `translation`: CharField (e.g., "ESV", "NIV").
- `text_content`: TextField (The actual verse text).
- `status`: CharField (Choices: 'upcoming', 'in_progress', 'memorized'). Default: 'upcoming'.
- `hidden_indices`: JSONField (Default: `[]`). Stores a list of integers representing which words are currently hidden (e.g., `[0, 4, 7]`).
- `created_at` / `updated_at`: DateTimeFields.

## 4. Business Logic & Feature Specs

### A. Authentication
- Use `django-allauth` for Google OAuth.
- Use standard Session Cookies (not JWT). The frontend and backend run on the same domain.

### B. Verse Lifecycle
1.  **Add Verse:** User manually pastes `reference`, `translation`, and `text_content`. Status defaults to `upcoming`.
2.  **Upcoming View:** User sees full text. Button available to move to `in_progress`.
3.  **In Progress View (The Core Mechanic):**
    - **Tokenization:** Frontend splits `text_content` into an array of words/punctuation.
    - **Rendering:** Words are displayed. If a word's index is in `hidden_indices`, render a blank line/gap.
    - **Interaction:**
        - User clicks a visible word -> Add index to `hidden_indices`.
        - "Random Hide" button -> Selects a random *visible* index and adds to `hidden_indices`.
    - **Persistence:** The `hidden_indices` array is saved to the DB (PATCH request).
4.  **Memorized View:**
    - Shows `reference` only.
    - **Recall Helper:** "Next Word" button reveals the text one word at a time from start to finish.
    - **Check:** "Show All" button reveals full text.

## 5. API Endpoints (REST)
- `GET /api/verses/`: List verses (filtered by current user).
- `POST /api/verses/`: Create new verse.
- `PATCH /api/verses/{id}/`: Update status or `hidden_indices`.
- `DELETE /api/verses/{id}/`: Remove verse.
- Standard `dj-rest-auth` or `allauth` endpoints for login/logout.

## 6. Frontend UI Structure
- **Global:** Left-hand navigation sidebar ("My Verses", "Add New", "Profile/Logout").
- **Page: Login:** Simple view with "Login with Google" button.
- **Page: Dashboard (Home):** Lists verses currently `in_progress`.
- **Page: Verse Detail:**
    - Detects `status` of verse and renders the appropriate view component (`UpcomingView`, `InProgressView`, `MemorizedView`).

## 7. Implementation Roadmap (Step-by-Step)

### Step 1: Project Skeleton
1. Initialize Django project (`backend`) and React Vite project (`frontend`).
2. Configure `Dockerfile` (Multi-stage):
   - Stage 1: Build React (`npm run build`).
   - Stage 2: Python environment. Copy React build to a folder Django can access.
3. Configure `fly.toml` to mount a volume at `/data` and set `DATABASE_URL` to point to `/data/db.sqlite3`.

### Step 2: Backend Core
1. Create `core` app.
2. Implement `Verse` model.
3. Set up `django-allauth` for Google.
4. Create Serializers and ViewSets. Ensure users can only access their own data.

### Step 3: Frontend Integration
1. Set up React Router.
2. Create API service (Axios or Fetch) ensuring CSRF tokens are handled (Django Cookie security).
3. Build the "Add Verse" form.

### Step 4: Memorization Logic
1. Implement the tokenizer utility in JS.
2. Build the `InProgress` component:
   - Handle word clicking.
   - Handle "Random Hide".
   - Sync state to backend (debounce the API call to avoid flooding).

### Step 5: Final Polish
1. Build `Memorized` view (Reveal logic).
2. Ensure static files are served correctly via Whitenoise in production mode.