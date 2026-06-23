# LabSphere API Documentation

Base URL: `http://localhost:8000/api`

All responses follow this format:

```json
// Success
{ "success": true, "message": "...", "data": {} }

// Error
{ "success": false, "message": "...", "errors": {} }
```

Authentication header for protected routes:
```
Authorization: Bearer {token}
```

---

## Auth

### POST /auth/register

Register a new patient account.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+963991234567",
  "password": "password123",
  "password_confirmation": "password123",
  "date_of_birth": "1990-01-15",
  "gender": "male",
  "address": "Damascus"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": 6,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+963991234567",
      "role": "patient",
      "status": "active",
      "patient": {
        "id": 2,
        "patient_code": "PAT-48291",
        "date_of_birth": "1990-01-15",
        "gender": "male",
        "address": "Damascus"
      }
    },
    "token": "1|abc123..."
  }
}
```

### POST /auth/login

**Request:**
```json
{
  "email": "patient@labsphere.test",
  "password": "password"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { "id": 5, "name": "Demo Patient", "role": "patient", "status": "active" },
    "token": "2|xyz789..."
  }
}
```

### POST /auth/logout

Requires authentication.

**Response:**
```json
{ "success": true, "message": "Logged out successfully", "data": null }
```

### GET /auth/me

Requires authentication.

**Response:**
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    "id": 5,
    "name": "Demo Patient",
    "email": "patient@labsphere.test",
    "role": "patient",
    "status": "active",
    "patient": { "patient_code": "PAT-32045" }
  }
}
```

---

## Public

### GET /tests

List active lab tests.

**Response:**
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": [
    {
      "id": 1,
      "name": "Complete Blood Count",
      "code": "CBC",
      "category": "Hematology",
      "price": "25.00",
      "is_active": true
    }
  ]
}
```

### GET /tests/{id}

Get a single test.

### POST /contact

**Request:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+963991111111",
  "subject": "Inquiry",
  "message": "I have a question about your services."
}
```

### POST /donations

**Request:**
```json
{
  "donor_name": "Anonymous",
  "email": "donor@example.com",
  "amount": 100.00,
  "method": "bank_transfer",
  "message": "Keep up the good work"
}
```

---

## Patient (auth + role:patient)

### GET /patient/results

List approved results for the authenticated patient.

**Response:**
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": [
    {
      "id": 1,
      "reportName": "Blood Test Report",
      "orderNumber": "ORD-10453",
      "patientId": "PAT-32045",
      "date": "2026-04-20",
      "status": "approved",
      "summaryStatus": "critical"
    }
  ]
}
```

### GET /patient/results/{id}

**Response:**
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    "id": 1,
    "reportName": "Blood Test Report",
    "patientName": "Demo Patient",
    "patientId": "PAT-32045",
    "orderNumber": "ORD-10453",
    "date": "2026-04-20",
    "status": "approved",
    "tests": [
      {
        "name": "Glucose",
        "code": "LOINC:23390-0",
        "result": "135",
        "unit": "mg/dL",
        "range": "70-100 mg/dL",
        "status": "high"
      }
    ]
  }
}
```

### GET /patient/results/{id}/download

Download PDF report (if available).

### POST /payments

**Request:**
```json
{
  "order_id": 1,
  "amount": 37.00,
  "method": "cash",
  "transaction_reference": "TXN-001",
  "notes": "Payment for order ORD-10453"
}
```

### GET /wallet

Get the authenticated patient's wallet balance and recent transactions.

**Response:**
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    "balance": "100.00",
    "patientCode": "PAT-32045",
    "transactions": [
      {
        "id": 1,
        "type": "top_up",
        "amount": "100.00",
        "balanceAfter": "100.00",
        "description": "Demo wallet balance",
        "performedBy": "Admin User",
        "date": "2026-06-12 10:00"
      }
    ]
  }
}
```

### GET /payments/unpaid-orders

List unpaid orders and current wallet balance for the authenticated patient.

**Response:**
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    "walletBalance": "100.00",
    "orders": [
      {
        "id": 2,
        "orderNumber": "ORD-10457",
        "totalAmount": "60.00",
        "status": "processing",
        "tests": ["Liver Panel", "Complete Blood Count"],
        "createdAt": "2026-06-12"
      }
    ]
  }
}
```

### POST /payments

Use `method: "wallet"` to pay instantly from the patient's LabSphere wallet.
Use `method: "syriatel_cash"` for external transfer (status stays `pending`).

### GET /payments/my

List authenticated user's payments.

### POST /financial-aid

Multipart form data with optional file uploads.

**Fields:**
- `full_name` (required)
- `phone` (optional)
- `reason` (required)
- `files[]` (optional, pdf/jpg/jpeg/png, max 5MB each)

### GET /financial-aid/my

List authenticated user's financial aid requests.

---

## Admin (auth + role:admin)

### GET /admin/users

Query params: `role`, `status`

### PATCH /admin/users/{id}/status

**Request:**
```json
{ "status": "active" }
```

### GET /admin/tests

### POST /admin/tests

**Request:**
```json
{
  "name": "Vitamin D",
  "code": "VIT-D",
  "category": "Chemistry",
  "description": "Vitamin D level test",
  "sample_type": "Blood",
  "price": 30.00,
  "is_active": true
}
```

### PUT /admin/tests/{id}

### DELETE /admin/tests/{id}

### GET /admin/orders

Query params: `status`

### POST /admin/orders

**Request:**
```json
{
  "patient_id": 1,
  "test_ids": [2, 3, 4],
  "notes": "Fasting required"
}
```

### GET /admin/orders/{id}

### PATCH /admin/orders/{id}/status

**Request:**
```json
{ "status": "sample_collected" }
```

### GET /admin/results

Query params: `status`

### POST /admin/results

**Request:**
```json
{
  "order_id": 1,
  "report_name": "Blood Test Report",
  "items": [
    {
      "test_name": "Glucose",
      "test_code": "LOINC:23390-0",
      "result_value": "95",
      "unit": "mg/dL",
      "normal_range": "70-100 mg/dL",
      "status": "normal"
    }
  ]
}
```

### GET /admin/results/{id}

### PUT /admin/results/{id}

### PATCH /admin/results/{id}/submit-review

### PATCH /admin/results/{id}/approve

### PATCH /admin/results/{id}/reject

### GET /admin/financial-aid

### PATCH /admin/financial-aid/{id}/status

**Request:**
```json
{
  "status": "approved",
  "admin_notes": "Approved based on documentation"
}
```

### GET /admin/contact-messages

### PATCH /admin/contact-messages/{id}/read

### GET /admin/wallets

List all patient wallets with balances.

### GET /admin/wallets/{patient_id}

Get wallet details and transaction history for a patient.

### POST /admin/wallets/{patient_id}/top-up

Top up a patient's wallet.

**Request:**
```json
{
  "amount": 50.00,
  "notes": "Cash deposit at reception"
}
```

---

## Doctor (auth + role:doctor)

### GET /doctor/results/pending

List results awaiting review.

### PATCH /doctor/results/{id}/approve

Approve a pending result.

### PATCH /doctor/results/{id}/reject

Reject a pending result.

---

## Technician (auth + role:technician)

### GET /technician/orders

List orders ready for processing.

### POST /technician/results

Create a draft result (same body as admin POST /results).

### PUT /technician/results/{id}

Update a draft or rejected result.

### PATCH /technician/results/{id}/submit-review

Submit result for doctor review.

---

## Reception (auth + role:reception)

### POST /reception/orders

Create order for a patient (same body as admin POST /orders).

### GET /reception/orders

List orders.

### GET /reception/patients

Query params: `search` (name, email, phone, patient_code)

---

## Status Values

| Entity | Values |
|--------|--------|
| User status | `active`, `pending`, `blocked` |
| User role | `admin`, `doctor`, `technician`, `reception`, `patient` |
| Order status | `pending`, `sample_collected`, `processing`, `completed`, `cancelled` |
| Lab result status | `draft`, `pending_review`, `approved`, `rejected` |
| Result item status | `normal`, `high`, `low`, `critical` |
| Payment method | `cash`, `syriatel_cash`, `bank_transfer`, `other`, `wallet` |
| Wallet transaction type | `top_up`, `payment` |
| Payment status | `pending`, `paid`, `failed`, `cancelled` |
