from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI()


diabetes_model = joblib.load("models/diabetes_model.pkl")
anemia_model = joblib.load("models/anemia_model.pkl")
thalassemia_model = joblib.load("models/thalassemia_model.pkl")
thrombocytopenia_model = joblib.load("models/thrombocytopenia_model.pkl")


RANGES = {
    "Glucose":                                  {"min": 50,  "max": 300},
    "HbA1c":                                    {"min": 4,   "max": 15},
    "Insulin":                                  {"min": 2,   "max": 300},
    "BMI":                                      {"min": 15,  "max": 50},
    "Triglycerides":                            {"min": 50,  "max": 500},
    "Cholesterol":                              {"min": 100, "max": 400},
    "LDL Cholesterol":                          {"min": 50,  "max": 300},
    "HDL Cholesterol":                          {"min": 20,  "max": 100},
    "Hemoglobin":                               {"min": 5,   "max": 20},
    "Red Blood Cells":                          {"min": 2,   "max": 7},
    "Hematocrit":                               {"min": 15,  "max": 60},
    "Mean Corpuscular Volume":                  {"min": 50,  "max": 120},
    "Mean Corpuscular Hemoglobin":              {"min": 15,  "max": 40},
    "Mean Corpuscular Hemoglobin Concentration":{"min": 28,  "max": 38},
    "Platelets":                                {"min": 20,  "max": 600},
    "White Blood Cells":                        {"min": 1,   "max": 30},
    "C-reactive Protein":                       {"min": 0,   "max": 200},
}


def normalize(value: float, feature: str) -> float:
    min_val = RANGES[feature]["min"]
    max_val = RANGES[feature]["max"]
    normalized = (value - min_val) / (max_val - min_val)
    return max(0.0, min(1.0, normalized))


class DiabetesInput(BaseModel):
    Glucose: float          
    HbA1c: float            
    Insulin: float          
    BMI: float              
    Triglycerides: float    
    Cholesterol: float      
    LDL_Cholesterol: float  
    HDL_Cholesterol: float  


class AnemiaInput(BaseModel):
    Hemoglobin: float      
    Hematocrit: float       
    Red_Blood_Cells: float  
    MCV: float             
    MCH: float              
    MCHC: float             
    White_Blood_Cells: float 
    Platelets: float        


class ThalassemiaInput(BaseModel):
    MCH: float              
    MCV: float             
    MCHC: float             
    Hemoglobin: float       
    Hematocrit: float       
    Red_Blood_Cells: float  
    White_Blood_Cells: float 
    Platelets: float        


class ThrombocytopeniaInput(BaseModel):
    Platelets: float        
    White_Blood_Cells: float 
    Hemoglobin: float       
    C_reactive_Protein: float 


@app.get("/")
def home():
    return {"message": "LabSphere CDSS API is running "}


@app.post("/predict/diabetes")
def predict_diabetes(data: DiabetesInput):
    sample = pd.DataFrame([{
        "Glucose":          normalize(data.Glucose,         "Glucose"),
        "HbA1c":            normalize(data.HbA1c,           "HbA1c"),
        "Insulin":          normalize(data.Insulin,         "Insulin"),
        "BMI":              normalize(data.BMI,             "BMI"),
        "Triglycerides":    normalize(data.Triglycerides,   "Triglycerides"),
        "Cholesterol":      normalize(data.Cholesterol,     "Cholesterol"),
        "LDL Cholesterol":  normalize(data.LDL_Cholesterol, "LDL Cholesterol"),
        "HDL Cholesterol":  normalize(data.HDL_Cholesterol, "HDL Cholesterol"),
    }])
    result = diabetes_model.predict(sample)[0]
    confidence = max(diabetes_model.predict_proba(sample)[0]) * 100
    return {
        "disease": "Diabetes",
        "prediction": "Positive" if result == 1 else "Negative",
        "confidence": round(confidence, 2)
    }



@app.post("/predict/anemia")
def predict_anemia(data: AnemiaInput):
    sample = pd.DataFrame([{
        "Hemoglobin":                                normalize(data.Hemoglobin,        "Hemoglobin"),
        "Hematocrit":                                normalize(data.Hematocrit,        "Hematocrit"),
        "Red Blood Cells":                           normalize(data.Red_Blood_Cells,   "Red Blood Cells"),
        "Mean Corpuscular Volume":                   normalize(data.MCV,               "Mean Corpuscular Volume"),
        "Mean Corpuscular Hemoglobin":               normalize(data.MCH,               "Mean Corpuscular Hemoglobin"),
        "Mean Corpuscular Hemoglobin Concentration": normalize(data.MCHC,              "Mean Corpuscular Hemoglobin Concentration"),
        "White Blood Cells":                         normalize(data.White_Blood_Cells, "White Blood Cells"),
        "Platelets":                                 normalize(data.Platelets,         "Platelets"),
    }])
    result = anemia_model.predict(sample)[0]
    confidence = max(anemia_model.predict_proba(sample)[0]) * 100
    return {
        "disease": "Anemia",
        "prediction": "Positive" if result == 1 else "Negative",
        "confidence": round(confidence, 2)
    }



@app.post("/predict/thalassemia")
def predict_thalassemia(data: ThalassemiaInput):
    sample = pd.DataFrame([{
        "Mean Corpuscular Hemoglobin":               normalize(data.MCH,               "Mean Corpuscular Hemoglobin"),
        "Mean Corpuscular Volume":                   normalize(data.MCV,               "Mean Corpuscular Volume"),
        "Mean Corpuscular Hemoglobin Concentration": normalize(data.MCHC,              "Mean Corpuscular Hemoglobin Concentration"),
        "Hemoglobin":                                normalize(data.Hemoglobin,        "Hemoglobin"),
        "Hematocrit":                                normalize(data.Hematocrit,        "Hematocrit"),
        "Red Blood Cells":                           normalize(data.Red_Blood_Cells,   "Red Blood Cells"),
        "White Blood Cells":                         normalize(data.White_Blood_Cells, "White Blood Cells"),
        "Platelets":                                 normalize(data.Platelets,         "Platelets"),
    }])
    result = thalassemia_model.predict(sample)[0]
    confidence = max(thalassemia_model.predict_proba(sample)[0]) * 100
    return {
        "disease": "Thalassemia",
        "prediction": "Positive" if result == 1 else "Negative",
        "confidence": round(confidence, 2)
    }


@app.post("/predict/thrombocytopenia")
def predict_thrombocytopenia(data: ThrombocytopeniaInput):
    sample = pd.DataFrame([{
        "Platelets":          normalize(data.Platelets,          "Platelets"),
        "White Blood Cells":  normalize(data.White_Blood_Cells,  "White Blood Cells"),
        "Hemoglobin":         normalize(data.Hemoglobin,         "Hemoglobin"),
        "C-reactive Protein": normalize(data.C_reactive_Protein, "C-reactive Protein"),
    }])
    result = thrombocytopenia_model.predict(sample)[0]
    confidence = max(thrombocytopenia_model.predict_proba(sample)[0]) * 100
    return {
        "disease": "Thrombocytopenia",
        "prediction": "Positive" if result == 1 else "Negative",
        "confidence": round(confidence, 2)
    }
