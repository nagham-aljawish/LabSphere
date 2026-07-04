import joblib
import pandas as pd
 
# ============================
# تحميل النماذج
# ============================
diabetes_model = joblib.load("models/diabetes_model.pkl")
anemia_model = joblib.load("models/anemia_model.pkl")
thalassemia_model = joblib.load("models/thalassemia_model.pkl")
thrombocytopenia_model = joblib.load("models/thrombocytopenia_model.pkl")
 
print("✅ كل النماذج اتحملت بنجاح\n")
 
 
# ============================
# اختبار نموذج السكري
# ============================
diabetes_sample = pd.DataFrame([{
    "Glucose": 0.9,
    "HbA1c": 0.85,
    "Insulin": 0.8,
    "BMI": 0.7,
    "Triglycerides": 0.75,
    "Cholesterol": 0.8
}])
 
result = diabetes_model.predict(diabetes_sample)[0]
confidence = max(diabetes_model.predict_proba(diabetes_sample)[0]) * 100
 
print("=== اختبار السكري ===")
print(f"النتيجة: {'مريض - Diabetes' if result == 1 else 'سليم - Healthy'}")
print(f"الثقة: {confidence:.1f}%\n")
 
 
# ============================
# اختبار نموذج فقر الدم
# ============================
anemia_sample = pd.DataFrame([{
    "Hemoglobin": 0.2,
    "Red Blood Cells": 0.3,
    "Hematocrit": 0.25,
    "Mean Corpuscular Volume": 0.3,
    "Mean Corpuscular Hemoglobin": 0.25,
    "Mean Corpuscular Hemoglobin Concentration": 0.3
}])
 
result = anemia_model.predict(anemia_sample)[0]
confidence = max(anemia_model.predict_proba(anemia_sample)[0]) * 100
 
print("=== اختبار فقر الدم ===")
print(f"النتيجة: {'مريض - Anemia' if result == 1 else 'سليم - Healthy'}")
print(f"الثقة: {confidence:.1f}%\n")
 
 
# ============================
# اختبار نموذج التلاسيميا
# ============================
thalassemia_sample = pd.DataFrame([{
    "Hemoglobin": 0.3,
    "Red Blood Cells": 0.4,
    "Mean Corpuscular Volume": 0.2,
    "Mean Corpuscular Hemoglobin": 0.15,
    "Mean Corpuscular Hemoglobin Concentration": 0.2,
    "Hematocrit": 0.3
}])
 
result = thalassemia_model.predict(thalassemia_sample)[0]
confidence = max(thalassemia_model.predict_proba(thalassemia_sample)[0]) * 100
 
print("=== اختبار التلاسيميا ===")
print(f"النتيجة: {'مريض - Thalassemia' if result == 1 else 'سليم - Healthy'}")
print(f"الثقة: {confidence:.1f}%\n")
 
 
# ============================
# اختبار نموذج نقص الصفائح
# ============================
thrombocytopenia_sample = pd.DataFrame([{
    "Platelets": 0.1,
    "White Blood Cells": 0.2,
    "C-reactive Protein": 0.8
}])
 
result = thrombocytopenia_model.predict(thrombocytopenia_sample)[0]
confidence = max(thrombocytopenia_model.predict_proba(thrombocytopenia_sample)[0]) * 100
 
print("=== اختبار نقص الصفائح ===")
print(f"النتيجة: {'مريض - Thrombocytopenia' if result == 1 else 'سليم - Healthy'}")
print(f"الثقة: {confidence:.1f}%\n")
 
print(" كل النماذج شغالة بنجاح!")
 