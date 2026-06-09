from fastapi import FastAPI
import joblib
import pandas as pd

app = FastAPI()

# تحميل الموديل
model = joblib.load("models/model.pkl")


@app.get("/")
def home():
    return {
        "message": "LabSphere CDSS API is running"
    }


@app.get("/predict")
def predict():

    sample = pd.DataFrame([{
        "Glucose": 0.8,
        "Cholesterol": 0.6,
        "Hemoglobin": 0.7,
        "Platelets": 0.5,
        "White Blood Cells": 0.6,
        "Red Blood Cells": 0.7,
        "Hematocrit": 0.8,
        "Mean Corpuscular Volume": 0.7,
        "Mean Corpuscular Hemoglobin": 0.6,
        "Mean Corpuscular Hemoglobin Concentration": 0.7,
        "Insulin": 0.5,
        "BMI": 0.6,
        "Systolic Blood Pressure": 0.7,
        "Diastolic Blood Pressure": 0.6,
        "Triglycerides": 0.5,
        "HbA1c": 0.8,
        "LDL Cholesterol": 0.6,
        "HDL Cholesterol": 0.5,
        "ALT": 0.4,
        "AST": 0.4,
        "Heart Rate": 0.7,
        "Creatinine": 0.5,
        "Troponin": 0.2,
        "C-reactive Protein": 0.3
    }])

    prediction = model.predict(sample)[0]

    probabilities = model.predict_proba(sample)[0]

    confidence = max(probabilities) * 100

    return {
        "prediction": prediction,
        "confidence": round(confidence, 2)
    }