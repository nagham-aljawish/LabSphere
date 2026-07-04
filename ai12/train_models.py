import pandas as pd
import joblib
import os

from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

os.makedirs("models", exist_ok=True)

df = pd.read_csv("data/data.csv")

MODELS_CONFIG = {
    "diabetes": {
        "disease_name": "Diabetes",
        "features": [
            "Glucose",                  
            "HbA1c",                    
            "Insulin",                  
            
            "BMI",                     
            "Triglycerides",           
            "Cholesterol",              
            "LDL Cholesterol",         
            "HDL Cholesterol",         
        ]
    },
    "anemia": {
        "disease_name": "Anemia",
        "features": [
            
            "Hemoglobin",                               
            "Hematocrit",                               
            "Red Blood Cells",                          
            
            "Mean Corpuscular Volume",                 
            "Mean Corpuscular Hemoglobin",             
            "Mean Corpuscular Hemoglobin Concentration", 
           
            "White Blood Cells",                      
            "Platelets",                                
        ]
    },
    "thalassemia": {
        "disease_name": "Thalasse",
        "features": [
            "Mean Corpuscular Hemoglobin",              
            "Mean Corpuscular Volume",                   
            "Mean Corpuscular Hemoglobin Concentration", 
            
            "Hemoglobin",                              
            "Hematocrit",                               
            "Red Blood Cells",                          
            "White Blood Cells",                        
            "Platelets",                                
        ]
    },
    "thrombocytopenia": {
        "disease_name": "Thromboc",
        "features": [
            
            "Platelets",                
            "White Blood Cells",        
           
            "Hemoglobin",               
            "C-reactive Protein",       
        ]
    }
}


for model_key, config in MODELS_CONFIG.items():
    print(f"\n{'='*50}")
    print(f"تدريب نموذج: {model_key.upper()}")
    print(f"{'='*50}")

    disease = config["disease_name"]
    features = config["features"]

   
    df_filtered = df[df["Disease"].isin([disease, "Healthy"])].copy()
    df_filtered["label"] = (df_filtered["Disease"] == disease).astype(int)

    print(f"عدد صفوف الداتا: {len(df_filtered)}")
    print(f"  - {disease}: {(df_filtered['label'] == 1).sum()}")
    print(f"  - Healthy: {(df_filtered['label'] == 0).sum()}")

   
    X = df_filtered[features]
    y = df_filtered["label"]

    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"\nTest Accuracy: {accuracy:.4f}")

    
    cv_scores = cross_val_score(model, X, y, cv=5)
    print(f"CV Average: {cv_scores.mean():.4f}")

    
    importance = pd.DataFrame({
        "Feature": features,
        "Importance": model.feature_importances_
    }).sort_values("Importance", ascending=False)
    print(f"\nFeature Importance:")
    print(importance.to_string(index=False))

    
    model_path = f"models/{model_key}_model.pkl"
    joblib.dump(model, model_path)
    print(f"\nتم حفظ النموذج: {model_path}")

print(f"\n{'='*50}")
print(" تم تدريب وحفظ كل النماذج بنجاح!")
print("الملفات المحفوظة:")
for model_key in MODELS_CONFIG.keys():
    print(f"  - models/{model_key}_model.pkl")
print(f"{'='*50}")
