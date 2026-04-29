# API Reference — Trust-Mediated Grievance Platform

Base URL: `http://localhost:5000/api`

All responses follow this structure:
```json
{
  "success": true|false,
  "message": "Human readable message",
  "data": { ... },
  "errors": [ ... ]  // Only on validation failures
}
```

Authorization: `Authorization: Bearer <JWT_TOKEN>`

---

## Auth

### POST /auth/signup
Create a new account.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+919876543210",
  "password": "MyPass123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "user": { "id": "uuid", "name": "John Doe", "email": "john@example.com", "role": "citizen" },
    "token": "eyJhbG..."
  }
}
```

### POST /auth/login
Authenticate and receive JWT.

**Body:**
```json
{
  "email": "john@example.com",
  "password": "MyPass123"
}
```

### POST /auth/admin-login
Same as login but restricted to admin role.

---

## Complaints

### POST /complaints/create
Submit a new complaint. Requires auth.

**Body:**
```json
{
  "title": "Broken water pipe flooding street",
  "raw_text": "There has been a broken water pipe on MG Road for 3 days...",
  "category": "water_supply",
  "location": "MG Road, Bangalore 560001",
  "anonymous": true,
  "proxy_mode": false,
  "priority": "high"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "complaint_code": "GRV-A3F8K2M1",
    "pin_code": "482910",
    "status": "submitted",
    "...": "..."
  }
}
```

### GET /complaints/track/:code?pin=XXXXXX
Public tracking — no auth required.

### GET /complaints/list?status=submitted&category=water_supply&page=1&limit=20
Paginated list with filters. Citizens see only their own.

### PUT /complaints/:id/update
Update complaint fields. Status transitions are validated.

### POST /complaints/:id/upload-proof
Upload files (max 5, max 10MB each). Use `multipart/form-data` with field name `files`.

---

## Timeline

### POST /timeline/:complaintId/add
Add timeline entry. Admin/NGO only.

**Body:**
```json
{
  "status": "under_review",
  "note": "Investigation team dispatched to location"
}
```

### GET /timeline/:complaintId
Get full chronological timeline.

---

## Validation

### POST /validation/:complaintId/vote
Add community support vote. One per user per complaint.

### POST /validation/:complaintId/verify
Trusted verification. Validator role only. Boosts genuineness score by 5x.

---

## AI

### POST /ai/process-complaint
Trigger AI analysis. Admin only.

**Body:**
```json
{ "complaintId": "uuid" }
```

**Response:**
```json
{
  "data": {
    "complaint": { "...updated fields..." },
    "analysis": {
      "summary": "...",
      "suggested_category": "water_supply",
      "suggested_priority": "high",
      "urgency_score": 72,
      "key_issues": ["flooding", "public safety"],
      "sentiment": "negative"
    }
  }
}
```

---

## Admin

### GET /admin/dashboard-stats
Returns total complaints, counts by status and category.

### GET /admin/queues?status=submitted
Filtered complaint queues for admin workflow.

### POST /admin/assign/:complaintId
**Body:**
```json
{
  "assigned_to": "user-uuid",
  "assigned_role": "ngo"
}
```

### POST /admin/resolve/:complaintId
**Body:**
```json
{
  "resolution_note": "Water pipe repaired and road surface restored. Issue resolved."
}
```

---

## Error Codes

| Code | Meaning |
|---|---|
| 400 | Bad Request / Validation Failed |
| 401 | Unauthorized / Invalid Token |
| 403 | Forbidden / Insufficient Role |
| 404 | Resource Not Found |
| 409 | Conflict / Duplicate |
| 413 | File Too Large |
| 429 | Rate Limit Exceeded |
| 500 | Internal Server Error |
