"""
Vercel serverless function entry point for FastAPI application
"""
import sys
import os
from pathlib import Path

# Add parent directory to path to import server module
backend_dir = Path(__file__).parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

# Import the FastAPI app from server.py
# This must be at module level for Vercel to detect it
try:
    from server import app
except ValueError as e:
    # If environment variables are missing, create a minimal app that shows the error
    from fastapi import FastAPI
    app = FastAPI()
    
    @app.get("/")
    async def root():
        return {
            "error": "Configuration error",
            "message": str(e),
            "hint": "Please set MONGO_URL and DB_NAME environment variables in Vercel dashboard"
        }
    
    @app.get("/api/{path:path}")
    async def api_error(path: str):
        return {
            "error": "Configuration error",
            "message": str(e),
            "hint": "Please set MONGO_URL and DB_NAME environment variables in Vercel dashboard"
        }
except Exception as e:
    # Catch any other import errors
    from fastapi import FastAPI
    app = FastAPI()
    
    @app.get("/")
    async def root():
        return {
            "error": "Import error",
            "message": str(e),
            "type": type(e).__name__
        }

