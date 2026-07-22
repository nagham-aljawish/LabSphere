"""
train_models.py
تدريب 4 نماذج منفصلة لـ LabSphere CDSS:
  1) diabetes      (data/diabetes.csv)
  2) anemia        (data/anemia.csv)
  3) thalassemia   (data/thalassemia.xlsx)
  4) liver         (data/Liver_diseases.xlsx)

كل مرض له ملف بياناته الخاص وأعمدته الخاصة (لا يوجد ملف موحد data.csv).
كل الميزات تُطبَّع (Min-Max Normalization) بمدىً طبي مرجعي حقيقي قبل التدريب،
بنفس الأسلوب المستخدم في api.py حتى تتطابق مدخلات الـ API مع مدخلات التدريب تماماً.
"""

import pandas as pd
import joblib
import os

from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score

os.makedirs("models", exist_ok=True)


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


def normalize_series(series: pd.Series, feature: str) -> pd.Series:
    """تطبيع عمود كامل بنفس منطق normalize() المستخدم بالـ API (Min-Max + clipping)."""
    min_val = RANGES[feature]["min"]
    max_val = RANGES[feature]["max"]
    normalized = (series - min_val) / (max_val - min_val)
    return normalized.clip(0.0, 1.0)


def evaluate_and_save(model_key, disease_label, X, y):
    print(f"\n{'='*50}")
    print(f"تدريب نموذج: {model_key.upper()}")
    print(f"{'='*50}")
    print(f"عدد العينات: {len(y)}  |  مريض: {(y==1).sum()}  |  سليم: {(y==0).sum()}")

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    model = RandomForestClassifier(
        n_estimators=200,
        max_depth=10,
        class_weight="balanced",
        random_state=42,
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)[:, 1]

    print("\nTest classification report:")
    print(classification_report(y_test, y_pred, target_names=["سليم", "مريض"]))
    print("Confusion matrix:")
    print(confusion_matrix(y_test, y_pred))
    print(f"ROC-AUC: {roc_auc_score(y_test, y_proba):.3f}")

    cv_scores = cross_val_score(model, X, y, cv=5)
    print(f"CV Average Accuracy: {cv_scores.mean():.4f}")

    importance = pd.DataFrame({
        "Feature": X.columns,
        "Importance": model.feature_importances_
    }).sort_values("Importance", ascending=False)
    print("\nFeature Importance:")
    print(importance.to_string(index=False))

    model_path = f"models/{model_key}_model.pkl"
    joblib.dump(model, model_path)
    print(f"\n تم حفظ النموذج: {model_path}")


# 1) DIABETES
df_d = pd.read_csv("data/diabetes.csv")
X_d = pd.DataFrame({
    "HbA1c_level":         normalize_series(df_d["HbA1c_level"], "HbA1c_level"),
    "blood_glucose_level": normalize_series(df_d["blood_glucose_level"], "blood_glucose_level"),
})
y_d = df_d["diabetes"].astype(int)
evaluate_and_save("diabetes", "Diabetes", X_d, y_d)

# 2) ANEMIA
df_a = pd.read_csv("data/anemia.csv")
X_a = pd.DataFrame({
    "Hemoglobin": normalize_series(df_a["Hemoglobin"], "Hemoglobin"),
    "MCH":        normalize_series(df_a["MCH"], "MCH"),
    "MCHC":       normalize_series(df_a["MCHC"], "MCHC"),
    "MCV":        normalize_series(df_a["MCV"], "MCV"),
})
y_a = df_a["Result"].astype(int)
evaluate_and_save("anemia", "Anemia", X_a, y_a)

# 3) THALASSEMIA
df_t = pd.read_excel("data/thalassemia.xlsx")
X_t = pd.DataFrame({
    "Hb":        normalize_series(df_t["Hb"], "Hb"),
    "Hct":       normalize_series(df_t["Hct"], "Hct"),
    "MCV":       normalize_series(df_t["MCV"], "MCV"),
    "MCH":       normalize_series(df_t["MCH"], "MCH"),
    "MCHC":      normalize_series(df_t["MCHC"], "MCHC"),
    "RDW":       normalize_series(df_t["RDW"], "RDW"),
    "RBC count": normalize_series(df_t["RBC count"], "RBC count"),
})
y_t = df_t["Group"].astype(int)
evaluate_and_save("thalassemia", "Thalassemia", X_t, y_t)

# 4) LIVER
df_l = pd.read_excel("data/Liver_diseases.xlsx")
df_l["Albumin_and_Globulin_Ratio"] = df_l["Albumin_and_Globulin_Ratio"].fillna(
    df_l["Albumin_and_Globulin_Ratio"].mean()
)
liver_features = [
    "Total_Bilirubin", "Direct_Bilirubin", "Alkaline_Phosphotase",
    "Alamine_Aminotransferase", "Aspartate_Aminotransferase",
    "Total_Protiens", "Albumin", "Albumin_and_Globulin_Ratio",
]
X_l = pd.DataFrame({f: normalize_series(df_l[f], f) for f in liver_features})
# Dataset: 1 = مريض -> 1 | 2 = سليم -> 0
y_l = df_l["Dataset"].map({1: 1, 2: 0}).astype(int)
evaluate_and_save("liver", "Liver", X_l, y_l)

print(f"\n{'='*50}")
print("تم تدريب وحفظ كل النماذج بنجاح!")
print("الملفات المحفوظة:")
for k in ["diabetes", "anemia", "thalassemia", "liver"]:
    print(f"  - models/{k}_model.pkl")
print(f"{'='*50}")
