# Setup Instructions

This guide will help you set up and run both the frontend and backend of the News Credibility AI application.

## Prerequisites

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download here](https://www.python.org/downloads/)
- **Git** (optional, for cloning)

## Backend Setup (Python)

1. **Navigate to the backend directory:**
   ```bash
   cd Backend
   ```

2. **Create a virtual environment (recommended):**
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment:**
   - **Windows:**
     ```bash
     venv\Scripts\activate
     ```
   - **macOS/Linux:**
     ```bash
     source venv/bin/activate
     ```

4. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Create a `.env` file in the `News-Credibility-AI-main` directory:**
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL_NAME=gemini-2.5-flash
   ```
   
   Get your Gemini API key from: https://aistudio.google.com/app/apikey

6. **Run the backend server:**
   ```bash
   python run_server.py
   ```
   
   Or alternatively:
   ```bash
   uvicorn src.api:app --host 0.0.0.0 --port 8000 --reload
   ```

   The backend will be available at: `http://localhost:8000`

## Frontend Setup (React/TypeScript)

1. **Navigate to the project root:**
   ```bash
   cd ..
   ```
   (or stay in the root if you're already there)

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env` file in the project root (optional):**
   ```env
   VITE_API_URL=http://localhost:8000
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   
   Note: The `VITE_API_URL` defaults to `http://localhost:8000` if not specified.

4. **Run the frontend development server:**
   ```bash
   npm run dev
   ```

   The frontend will be available at: `http://localhost:3000`

## Running Both Services

You need to run both the backend and frontend simultaneously:

1. **Terminal 1 - Backend:**
   ```bash
   cd Backend
   python run_server.py
   ```

2. **Terminal 2 - Frontend:**
   ```bash
   cd Frontend
   npm run dev
   ```

## API Endpoints

The backend provides the following endpoints:

- `GET /` - Health check
- `GET /health` - Health status
- `POST /analyze` - Analyze news content or URL
  ```json
  {
    "text": "Your news headline or URL here"
  }
  ```
- `GET /news` - Fetch trending news articles

## Troubleshooting

### Backend Issues

- **Import errors:** Make sure you're running from the correct directory and have activated the virtual environment
- **Missing API key:** Ensure your `.env` file is in the `Backend` directory with `GEMINI_API_KEY` set
- **Port already in use:** Change the port in `run_server.py` if port 8000 is occupied

### Frontend Issues

- **Cannot connect to backend:** 
  - Ensure the backend is running on port 8000
  - Check that `VITE_API_URL` in `.env` matches your backend URL
  - Verify CORS settings in `src/api.py` include your frontend URL

- **Module not found:** Run `npm install` again

### CORS Issues

If you encounter CORS errors, make sure:
1. The backend CORS middleware includes your frontend URL (port 3000 or 5173)
2. Both services are running
3. You're accessing the frontend from the correct URL

## Project Structure

```
PROJECT2/
│
├── .venv/                      # Python virtual environment
│
├── Backend/
│   ├── services/
│   ├── src/
│   ├── .env
│   ├── .gitignore
│   └── requirements.txt
│
├── Frontend/
│   ├── node_modules/
│   ├── src/
│   ├── .env
│   ├── App.tsx
│   ├── index.css
│   ├── index.html
│   ├── index.tsx
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.cjs
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── types.ts
│   └── vite.config.ts
│
├── .gitignore
├── CHANGES.md
├── metadata.json
├── package-lock.json
├── README.md
└── SETUP.md

```

## Next Steps

1. Make sure both servers are running
2. Open `http://localhost:3000` in your browser
3. Try analyzing a news headline or URL!
