# Backend folder

FastAPI routes are in `app/api/routes.py`; schemas in `app/schemas.py`; configuration in `app/config.py`; SQLite persistence in `app/storage.py`; feature/profile, adaptation, reporting, simulation adapter and LLM logic are separated under `app/services/`. Run from the repository root with `uvicorn backend.app.main:app --reload --port 8000`.
