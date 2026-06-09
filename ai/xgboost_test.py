import pandas as pd

from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import LabelEncoder

from xgboost import XGBClassifier


# قراءة البيانات
df = pd.read_csv("data/data.csv")


# فصل المدخلات والهدف
X = df.drop("Disease", axis=1)
y = df["Disease"]


# تحويل أسماء الأمراض إلى أرقام
label_encoder = LabelEncoder()
y = label_encoder.fit_transform(y)


# تقسيم البيانات
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)


# إنشاء موديل XGBoost
model = XGBClassifier(
    n_estimators=100,
    max_depth=5,
    learning_rate=0.1,
    random_state=42,
    eval_metric="mlogloss"
)


# التدريب
model.fit(X_train, y_train)


# التوقع
y_pred = model.predict(X_test)


# حساب الدقة
accuracy = accuracy_score(y_test, y_pred)

print("Accuracy:", accuracy)


# Cross Validation
scores = cross_val_score(
    model,
    X,
    y,
    cv=5
)

print("\nCross Validation Scores:")
print(scores)

print("\nAverage CV Accuracy:")
print(scores.mean())