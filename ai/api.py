from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
import os
import joblib
import pandas as pd

app = FastAPI(title="LabSphere CDSS API")


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")

diabetes_model = joblib.load(os.path.join(MODELS_DIR, "diabetes_model.pkl"))
anemia_model = joblib.load(os.path.join(MODELS_DIR, "anemia_model.pkl"))
thalassemia_model = joblib.load(os.path.join(MODELS_DIR, "thalassemia_model.pkl"))
liver_model = joblib.load(os.path.join(MODELS_DIR, "liver_model.pkl"))

RANGES = {
    # Diabetes
    "HbA1c_level":                {"min": 3.5,  "max": 15,   "mean": 5.7},
    "blood_glucose_level":        {"min": 50,   "max": 300,  "mean": 120},

    # Anemia
    "Hemoglobin":                 {"min": 5,    "max": 20,   "mean": 13.5},
    "MCH":                        {"min": 15,   "max": 40,   "mean": 29},
    "MCHC":                       {"min": 28,   "max": 38,   "mean": 33},
    "MCV":                        {"min": 50,   "max": 120,  "mean": 88},

    # Thalassemia 
    "Hb":                         {"min": 5,    "max": 20,   "mean": 13.5},
    "Hct":                        {"min": 15,   "max": 60,   "mean": 40},
    "RDW":                        {"min": 10,   "max": 30,   "mean": 14},
    "RBC count":                  {"min": 2,    "max": 7,    "mean": 4.8},

    # Liver
    "Total_Bilirubin":            {"min": 0.1,  "max": 20,   "mean": 1.0},
    "Direct_Bilirubin":           {"min": 0.1,  "max": 10,   "mean": 0.3},
    "Alkaline_Phosphotase":       {"min": 44,   "max": 500,  "mean": 150},
    "Alamine_Aminotransferase":   {"min": 7,    "max": 500,  "mean": 40},
    "Aspartate_Aminotransferase": {"min": 8,    "max": 500,  "mean": 40},
    "Total_Protiens":             {"min": 2.7,  "max": 9.6,  "mean": 6.8},
    "Albumin":                    {"min": 0.9,  "max": 5.5,  "mean": 3.5},
    "Albumin_and_Globulin_Ratio": {"min": 0.3,  "max": 2.8,  "mean": 1.0},
}


def normalize(value: Optional[float], feature: str) -> float:
    """يستقبل قيمة سريرية حقيقية (raw) ويرجع قيمة مطبعة بين 0 و1."""
    if value is None:
        value = RANGES[feature]["mean"]
    min_val = RANGES[feature]["min"]
    max_val = RANGES[feature]["max"]
    return max(0.0, min(1.0, (value - min_val) / (max_val - min_val)))


class DiabetesInput(BaseModel):
    HbA1c_level: Optional[float] = None
    blood_glucose_level: Optional[float] = None


class AnemiaInput(BaseModel):
    Hemoglobin: Optional[float] = None
    MCH: Optional[float] = None
    MCHC: Optional[float] = None
    MCV: Optional[float] = None


class ThalassemiaInput(BaseModel):
    Hb: Optional[float] = None
    Hct: Optional[float] = None
    MCV: Optional[float] = None
    MCH: Optional[float] = None
    MCHC: Optional[float] = None
    RDW: Optional[float] = None
    RBC_count: Optional[float] = None


class LiverInput(BaseModel):
    Total_Bilirubin: Optional[float] = None
    Direct_Bilirubin: Optional[float] = None
    Alkaline_Phosphotase: Optional[float] = None
    Alamine_Aminotransferase: Optional[float] = None
    Aspartate_Aminotransferase: Optional[float] = None
    Total_Protiens: Optional[float] = None
    Albumin: Optional[float] = None
    Albumin_and_Globulin_Ratio: Optional[float] = None


DISEASE_TEXT = {
    "diabetes": {
        "positive": "Diabetes Suspected",
        "positive_rec": "Clinical evaluation is recommended.",
        "negative": "No Evidence of Diabetes",
        "negative_rec": "No laboratory pattern suggesting diabetes.",
    },
    "anemia": {
        "positive": "Anemia Suspected",
        "positive_rec": "Further laboratory evaluation is recommended.",
        "negative": "No Evidence of Anemia",
        "negative_rec": "No laboratory pattern suggesting anemia.",
    },
    "thalassemia": {
        "positive": "Thalassemia Suspected",
        "positive_rec": "Hemoglobin electrophoresis is recommended for further evaluation.",
        "negative": "No Evidence of Thalassemia",
        "negative_rec": "No laboratory pattern suggesting thalassemia.",
    },
    "liver": {
        "positive": "Liver Disease Suspected",
        "positive_rec": "Clinical evaluation is recommended.",
        "negative": "No Evidence of Liver Disease",
        "negative_rec": "No laboratory pattern suggesting liver disease.",
    },
}


def build_response(disease_key: str, result: int, confidence: float) -> dict:
    text = DISEASE_TEXT[disease_key]
    if result == 1:
        prediction = text["positive"]
        recommendation = text["positive_rec"]
        outcome = "positive"
    else:
        prediction = text["negative"]
        recommendation = text["negative_rec"]
        outcome = "negative"
    return {
        "disease": disease_key,
        "outcome": outcome,
        "prediction": prediction,
        "recommendation": recommendation,
        "confidence": round(confidence, 2),
    }


@app.get("/")
def home():
    return {"message": "LabSphere CDSS API is running", "models": ["diabetes", "anemia", "thalassemia", "liver"]}


@app.post("/predict/diabetes")
def predict_diabetes(data: DiabetesInput):
    sample = pd.DataFrame([{
        "HbA1c_level":         normalize(data.HbA1c_level, "HbA1c_level"),
        "blood_glucose_level": normalize(data.blood_glucose_level, "blood_glucose_level"),
    }])
    result = diabetes_model.predict(sample)[0]
    confidence = max(diabetes_model.predict_proba(sample)[0]) * 100
    return build_response("diabetes", result, confidence)


@app.post("/predict/anemia")
def predict_anemia(data: AnemiaInput):
    sample = pd.DataFrame([{
        "Hemoglobin": normalize(data.Hemoglobin, "Hemoglobin"),
        "MCH":        normalize(data.MCH, "MCH"),
        "MCHC":       normalize(data.MCHC, "MCHC"),
        "MCV":        normalize(data.MCV, "MCV"),
    }])
    result = anemia_model.predict(sample)[0]
    confidence = max(anemia_model.predict_proba(sample)[0]) * 100
    return build_response("anemia", result, confidence)


@app.post("/predict/thalassemia")
def predict_thalassemia(data: ThalassemiaInput):
    sample = pd.DataFrame([{
        "Hb":        normalize(data.Hb, "Hb"),
        "Hct":       normalize(data.Hct, "Hct"),
        "MCV":       normalize(data.MCV, "MCV"),
        "MCH":       normalize(data.MCH, "MCH"),
        "MCHC":      normalize(data.MCHC, "MCHC"),
        "RDW":       normalize(data.RDW, "RDW"),
        "RBC count": normalize(data.RBC_count, "RBC count"),
    }])
    result = thalassemia_model.predict(sample)[0]
    confidence = max(thalassemia_model.predict_proba(sample)[0]) * 100
    return build_response("thalassemia", result, confidence)


@app.post("/predict/liver")
def predict_liver(data: LiverInput):
    sample = pd.DataFrame([{
        "Total_Bilirubin":            normalize(data.Total_Bilirubin, "Total_Bilirubin"),
        "Direct_Bilirubin":           normalize(data.Direct_Bilirubin, "Direct_Bilirubin"),
        "Alkaline_Phosphotase":       normalize(data.Alkaline_Phosphotase, "Alkaline_Phosphotase"),
        "Alamine_Aminotransferase":   normalize(data.Alamine_Aminotransferase, "Alamine_Aminotransferase"),
        "Aspartate_Aminotransferase": normalize(data.Aspartate_Aminotransferase, "Aspartate_Aminotransferase"),
        "Total_Protiens":             normalize(data.Total_Protiens, "Total_Protiens"),
        "Albumin":                    normalize(data.Albumin, "Albumin"),
        "Albumin_and_Globulin_Ratio": normalize(data.Albumin_and_Globulin_Ratio, "Albumin_and_Globulin_Ratio"),
    }])
    result = liver_model.predict(sample)[0]
    confidence = max(liver_model.predict_proba(sample)[0]) * 100
    return build_response("liver", result, confidence)
