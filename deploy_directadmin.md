# Deployment Guide for DirectAdmin

This guide covers how to deploy the **Afro-Latino Market** application (React Frontend + FastAPI Backend) on a server managed by DirectAdmin.

## Prerequisites

1.  **MongoDB Database**: DirectAdmin servers usually run MySQL. For MongoDB, we recommend using [MongoDB Atlas](https://www.mongodb.com/atlas) (Cloud) and getting a connection string (e.g., `mongodb+srv://...`).
2.  **Domain/Subdomain**: You should have a domain (e.g., `example.com`) and ideally a subdomain for the API (e.g., `api.example.com`), although you can run everything on one domain with path routing if configured correctly.

---

## Part 1: Backend Deployment (FastAPI)

FastAPI requires an **ASGI** server. Standard shared hosting often only supports **WSGI** (for Django/Flask).

### Option A: You have a VPS / Root Access (Recommended)

If you have full control over the server, the best way is to run the backend as a system service.

1.  **SSH into your server**.
2.  **Install Python 3.10+**: Ensure python is installed.
3.  **Clone/Upload the code**: Upload the `backend` folder to a location like `/home/admin/domains/api.example.com/app`.
4.  **Install Dependencies**:
    ```bash
    cd /home/admin/domains/api.example.com/app
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    pip install uvicorn
    ```
5.  **Configure Environment Variables**:
    Create a `.env` file in the `backend` folder with your production secrets:
    ```env
    MONGO_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
    DB_NAME=afrolatino_db
    STRIPE_API_KEY=sk_live_...
    ```
6.  **Create a Systemd Service**:
    Create `/etc/systemd/system/afrolatino-backend.service`:

    ```ini
    [Unit]
    Description=AfroLatino Backend
    After=network.target

    [Service]
    User=admin
    Group=admin
    WorkingDirectory=/home/admin/domains/api.example.com/app
    EnvironmentFile=/home/admin/domains/api.example.com/app/.env
    ExecStart=/home/admin/domains/api.example.com/app/venv/bin/uvicorn server:app --host 127.0.0.1 --port 8000
    Restart=always

    [Install]
    WantedBy=multi-user.target
    ```

    Enable and start it:

    ```bash
    sudo systemctl enable afrolatino-backend
    sudo systemctl start afrolatino-backend
    ```

7.  **Configure DirectAdmin Proxy**:
    - Go to DirectAdmin -> **Custom HTTPD Configurations**.
    - Select your domain (`api.example.com`).
    - Add this ProxyPass configuration:
      ```apache
      ProxyRequests Off
      ProxyPreserveHost On
      ProxyPass / http://127.0.0.1:8000/
      ProxyPassReverse / http://127.0.0.1:8000/
      ```

### Option B: Shared Hosting (Using "Setup Python App")

If you are limited to the DirectAdmin UI:

1.  Go to **Setup Python App** in DirectAdmin.
2.  **Create Application**:
    - Python Version: 3.9+
    - App Root: `backend`
    - Application URL: `api.example.com` (or `example.com/api`)
    - Application Startup File: `passenger_wsgi.py`
3.  **Create `passenger_wsgi.py`**:
    Startups file needs to bridge Passenger (WSGI) to FastAPI (ASGI). You might need to install `a2wsgi`.
    Create a file named `passenger_wsgi.py` in your backend directory:

    ```python
    from a2wsgi import ASGIMiddleware
    from server import app

    application = ASGIMiddleware(app)
    ```

    _Note: You must add `a2wsgi` to your `requirements.txt`._

---

## Part 2: Frontend Deployment (React)

1.  **Configure Production URL**:
    In your local `frontend` folder, create or edit `.env`:

    ```env
    REACT_APP_API_URL=https://api.example.com/api
    ```

    _Note: Make sure your backend URL matches where you deployed Part 1._

2.  **Build the Project**:
    Run this command locally:

    ```bash
    cd frontend
    npm run build
    ```

    This creates a `build` folder.

3.  **Upload to DirectAdmin**:

    - Go to DirectAdmin **File Manager**.
    - Navigate to `public_html` of your frontend domain.
    - Upload the **contents** of the `build` folder (index.html, static, etc.) directly into `public_html`.

4.  **Routing Support**:
    We have already created a `.htaccess` file in your `public` folder. Ensure this file was uploaded to `public_html` along with the other files. It handles React Router page refreshes.

---

## Summary of URLs

- **Frontend**: `https://example.com` (Served by Apache/Nginx from `public_html`)
- **Backend**: `https://api.example.com` (Proxied to Python App)
