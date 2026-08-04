# LabSphere CDSS Service

A small FastAPI service that hosts the four Clinical Decision Support System
(CDSS) models used by LabSphere: **diabetes**, **anemia**, **thalassemia** and
**liver disease**. The Laravel backend calls this service over HTTP when a
technician submits a result in **AI (CDSS) mode**.

## Layout

- `api.py` — FastAPI app exposing `POST /predict/{disease}`
- `train_models.py` — regenerates the `.pkl` models from the datasets
- `models/` — trained scikit-learn models (`*_model.pkl`)
- `data/` — training datasets

## Run

Use an isolated virtual environment so the pinned `scikit-learn` (which must
match the version the models were trained with) does not disturb your global
Python packages.

```powershell
cd ai
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn api:app --host 127.0.0.1 --port 8001
```

On later runs you only need the last line. The backend expects the service at
the URL configured by `CDSS_API_URL` (defaults to `http://127.0.0.1:8001`).
Set it in `backend/.env`.

> Note: do not run `pip install` globally while a `uvicorn` server is still
> running — the locked `uvicorn.exe` will abort the install midway. The venv
> avoids this entirely.

## Endpoints

`GET /` — health check.

`POST /predict/{disease}` where `{disease}` is one of `diabetes`, `anemia`,
`thalassemia`, `liver`. Body is a JSON object of raw clinical values keyed by
the model's feature names (see `api.py`). Response:

```json
{
  "disease": "diabetes",
  "outcome": "positive",
  "prediction": "Diabetes Suspected",
  "recommendation": "Clinical evaluation is recommended.",
  "confidence": 100.0
}
```

`outcome` is `positive` (disease suspected) or `negative` (normal). Missing
features fall back to a clinical mean before being normalised, so partial input
still returns a prediction.
