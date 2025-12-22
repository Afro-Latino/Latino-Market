"""
Vercel serverless function entry point for FastAPI application
"""
import sys
from pathlib import Path

# Add parent directory to path to import server module
sys.path.insert(0, str(Path(__file__).parent.parent))

# Import the FastAPI app from server.py
from server import app

# Export the app for Vercel
handler = app

