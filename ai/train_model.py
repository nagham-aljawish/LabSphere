# import pandas as pd

# # قراءة ملف البيانات
# df = pd.read_csv("data/data.csv")

# # عدد الصفوف والأعمدة
# print("Dataset Shape:")
# print(df.shape)

# # أسماء الأعمدة
# print("\nColumns:")
# print(df.columns.tolist())


# import pandas as pd

# # قراءة البيانات
# df = pd.read_csv("data/data.csv")

# print("Dataset Shape:")
# print(df.shape)

# print("\nColumns:")
# print(df.columns.tolist())

# # فحص القيم المفقودة
# print("\nMissing Values:")
# print(df.isnull().sum())

# # أنواع البيانات
# print("\nData Types:")
# print(df.dtypes)

# # عدد الأمراض الموجودة
# print("\nDisease Distribution:")
# print(df["Disease"].value_counts())

# import pandas as pd

# from sklearn.model_selection import train_test_split
# from sklearn.ensemble import RandomForestClassifier
# from sklearn.metrics import accuracy_score


# # قراءة البيانات
# df = pd.read_csv("data/data.csv")


# # فصل المدخلات والهدف
# X = df.drop("Disease", axis=1)
# y = df["Disease"]


# # تقسيم البيانات
# X_train, X_test, y_train, y_test = train_test_split(
#     X,
#     y,
#     test_size=0.2,
#     random_state=42
# )


# # إنشاء الموديل
# model = RandomForestClassifier(
#     n_estimators=100,
#     random_state=42
# )


# # تدريب الموديل
# model.fit(X_train, y_train)


# # التوقع
# y_pred = model.predict(X_test)


# # حساب الدقة
# accuracy = accuracy_score(y_test, y_pred)

# print("Accuracy:", accuracy)

# import joblib

# joblib.dump(model, "models/model.pkl")

# print("Model saved successfully!")


import pandas as pd
import joblib

from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score


# قراءة البيانات
df = pd.read_csv("data/data.csv")


# فصل المدخلات والهدف
X = df.drop("Disease", axis=1)
y = df["Disease"]


# تقسيم البيانات
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)


# إنشاء الموديل
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)


# تدريب الموديل
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


# Feature Importance
importance = pd.DataFrame({
    "Feature": X.columns,
    "Importance": model.feature_importances_
})

print("\nFeature Importance:")
print(
    importance.sort_values(
        by="Importance",
        ascending=False
    )
)


# حفظ الموديل
joblib.dump(model, "models/model.pkl")

print("\nModel saved successfully!")

print("\nDisease Distribution:")
print(df["Disease"].value_counts())