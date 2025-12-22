import os
import sys
from a2wsgi import ASGIMiddleware
from server import app as asgi_app

# Add the current directory to python path so it can find server.py
sys.path.insert(0, os.path.dirname(__file__))

# Create the WSGI adapter
# 'application' is the standard callable name that Passenger looks for
application = ASGIMiddleware(asgi_app)
