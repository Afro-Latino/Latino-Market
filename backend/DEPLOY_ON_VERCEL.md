# Deploying Backend to Vercel

Since your project is a monorepo (frontend and backend in the same repository), you have two main options for deploying the Python backend to Vercel.

## Option 1: Using Vercel CLI (Recommended for quick test)

1.  **Install Vercel CLI** (if you haven't):

    ```bash
    npm install -g vercel
    ```

2.  **Navigate to the backend directory**:

    ```bash
    cd backend
    ```

3.  **Run Deploy Command**:

    ```bash
    vercel
    ```

    - Follow the prompts.
    - Set up and deploy? **Y**
    - Which scope? (Select your team/user)
    - Link to existing project? **N** (creates a new one for the backend)
    - Project Name: `afrolatino-market-backend` (or similar)
    - In which directory is your code located? **./** (Keep default)
    - Want to modify these settings? **N**

4.  **Set Environment Variables**:

    - Go to the Vercel Dashboard for your project.
    - Navigate to **Settings > Environment Variables**.
    - Add the following variables (from your `.env` file):
      - `MONGO_URL`
      - `DB_NAME`
      - `STRIPE_API_KEY`
      - Any other secrets.

5.  **Redeploy**:
    ```bash
    vercel --prod
    ```

## CRITICAL: Dependencies Check

I noticed `server.py` imports `emergentintegrations`, but it is commented out in `requirements.txt`.
**This will likely cause the deployment to fail** if the package is not available to Vercel.

- If this is a private custom package, you must include the source code in the `backend/` folder (e.g., in a folder named `emergentintegrations` with an `__init__.py`).
- If it is a public package, uncomment it in `requirements.txt`.

## Option 2: Using GitHub Integration (Continuous Deployment)

1.  Push your code to GitHub.
2.  Log in to Vercel and click **"Add New..."** > **"Project"**.
3.  Import your GitHub repository.
4.  **Important: Configure Root Directory**:
    - In the "Root Directory" section, click "Edit" and select `backend`.
    - This tells Vercel that this project specifically builds the backend folder.
5.  **Environment Variables**:
    - Expand the "Environment Variables" section.
    - Add your secrets (`MONGO_URL`, `DB_NAME`, etc.).
6.  Click **Deploy**.

## Updating Frontend

Once deployed, Vercel will give you a domain (e.g., `https://afrolatino-market-backend.vercel.app`).
You will need to update your Frontend `.env` file to point to this new URL:

```
NEXT_PUBLIC_API_URL=https://afrolatino-market-backend.vercel.app/api
```

(Adjust the variable name according to what your frontend expects).

## Note on `vercel.json`

Your `vercel.json` is already configured to use the Python runtime for `server.py`.

```json
{
    "builds": [
        {
            "src": "server.py",
            "use": "@vercel/python"
        }
    ],
    "routes": [
        {
            "src": "/(.*)",
            "dest": "server.py"
        }
    ]
}
```

This configuration directs all traffic to your FastAPI app entry point.
