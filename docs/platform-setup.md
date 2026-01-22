# Datalyze tools platform setup

This document outlines how to wire the Tools page to Firebase Authentication, log tool usage to
BigQuery, and deploy Streamlit tools.

## 1) Firebase project + Auth

1. Create a Firebase project in the Firebase Console.
2. Add a Web app and copy the config into `auth.html` (`window.__FIREBASE_CONFIG__`).
3. In **Authentication → Sign-in method**, enable Email/Password and Google (optional).

## 2) BigQuery dataset

1. In Google Cloud Console, create a BigQuery dataset, e.g. `datalyze_tools`.
2. Create a table named `tool_events` with a schema similar to:

| Field | Type | Mode |
| --- | --- | --- |
| event_id | STRING | REQUIRED |
| event_name | STRING | REQUIRED |
| tool_id | STRING | NULLABLE |
| tool_name | STRING | NULLABLE |
| user_id | STRING | REQUIRED |
| email | STRING | NULLABLE |
| name | STRING | NULLABLE |
| created_at | TIMESTAMP | REQUIRED |
| raw_payload | JSON | NULLABLE |

## 3) Cloud Functions (Node.js) → BigQuery

1. Install Firebase CLI and initialize functions in the `firebase` directory.
2. Add the function in `firebase/functions/index.js` (see template in this repo).
3. Deploy:

```bash
cd firebase/functions
npm install
npm run deploy
```

4. Copy the function base URL into `auth.html` (`window.__CLOUD_FUNCTIONS_BASE_URL__`).

### IAM permissions

- Grant the Cloud Functions service account the `BigQuery Data Editor` role on your dataset.

## 4) Streamlit hosting options

### ✅ Streamlit Community Cloud (fastest)

- Create a GitHub repo per tool (or a monorepo with subfolders).
- Add `requirements.txt` and `app.py`.
- Connect the repo at https://share.streamlit.io.
- Each tool gets a URL like `https://your-tool.streamlit.app`.

### ✅ Google Cloud Run (more control)

- Build a container with Streamlit.
- Deploy multiple tools as separate Cloud Run services.
- Route each tool to its own URL or subdomain.

### ✅ Hugging Face Spaces

- Create a Space using Streamlit.
- Push `app.py` and requirements.
- Great for quick demos.

### ⚠️ Google Colab

Colab is **not recommended for production**. It is ephemeral and the URL changes. Use it only for
quick internal demos or prototyping.

## 5) Recommended multi-tool structure

- Create a `tools/` GitHub org with one repo per tool.
- Standardize on a shared `requirements.txt` + `app.py` template.
- Add a CI step to deploy (Streamlit Cloud or Cloud Run).
- Update `src/auth.js` with the new tool URL and metadata.
