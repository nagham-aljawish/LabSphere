import joblib
import pandas as pd

# تحميل الموديل
model = joblib.load("models/model.pkl")

# بيانات مريض للتجربة
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

# التوقع
prediction = model.predict(sample)

# نسب الثقة
probabilities = model.predict_proba(sample)[0]

# أسماء الأمراض
classes = model.classes_

# ترتيب النتائج من الأعلى إلى الأدنى
results = sorted(
    zip(classes, probabilities),
    key=lambda x: x[1],
    reverse=True
)

print("\nMost Likely Disease:")
print(prediction[0])

print("\nTop Predictions:")

for disease, probability in results:
    print(f"{disease}: {probability * 100:.2f}%")