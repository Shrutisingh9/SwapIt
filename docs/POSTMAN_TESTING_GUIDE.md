# SwapIt API - Postman Testing Guide

Test all SwapIt endpoints using Postman. Base URL: `http://localhost:4000`

## Prerequisites

- Backend running: `cd backend && npm run dev`
- Postman installed

---

## 1. Auth

### Register
- **POST** `/api/v1/auth/register`
- Body (JSON):
```json
{"email":"test@example.com","password":"password123","name":"Test User","location":"Mumbai"}
```
- Copy the `token` from response.

### Login
- **POST** `/api/v1/auth/login`
- Body (JSON):
```json
{"email":"test@example.com","password":"password123"}
```
- Copy the `token`. Use it as **Bearer Token** in Authorization for all protected endpoints.

---

## 2. Items

| Method | Endpoint | Auth | Notes |
|--------|----------|------|-------|
| GET | /api/v1/items | No | Optional: ?q=, ?category=, ?type=swap/donation |
| GET | /api/v1/items/:id | No | Get single item |
| POST | /api/v1/items | Yes | Create item |
| PATCH | /api/v1/items/:id | Yes | Update item |
| DELETE | /api/v1/items/:id | Yes | Delete item |

**Create item body:**
```json
{
  "title":"iPhone 13",
  "description":"Barely used",
  "category":"Electronics",
  "condition":"GOOD",
  "location":"Mumbai",
  "imageUrls":["https://example.com/img.jpg"],
  "isForSwap":true,
  "isForDonation":false
}
```
Condition: `NEW`, `GOOD`, `USED`, `POOR`

---

## 3. Swaps

| Method | Endpoint | Auth |
|--------|----------|------|
| GET | /api/v1/swaps | Yes |
| POST | /api/v1/swaps | Yes |
| POST | /api/v1/swaps/:id/accept | Yes |
| POST | /api/v1/swaps/:id/reject | Yes |
| POST | /api/v1/swaps/:id/cancel | Yes |
| POST | /api/v1/swaps/:id/complete | Yes |

**Create swap body:**
```json
{"requestedItemId":"<id>","offeredItemId":"<id>"}
```

---

## 4. Chat

| Method | Endpoint | Auth |
|--------|----------|------|
| GET | /api/v1/chat/rooms/:roomId/messages | Yes |
| POST | /api/v1/chat/rooms/:roomId/messages | Yes |

**Send message body:**
```json
{"body":"Hello, is this available?"}
```

---

## 5. Ratings

- **POST** `/api/v1/ratings/swaps/:swapId`
- Body: `{"score":5}` (1-5)

---

## 6. NGOs

| Method | Endpoint | Auth |
|--------|----------|------|
| GET | /api/v1/ngos | No |
| POST | /api/v1/ngos | Yes (Admin) |

---

## 7. Notifications

| Method | Endpoint | Auth |
|--------|----------|------|
| GET | /api/v1/notifications | Yes |
| POST | /api/v1/notifications/read-all | Yes |

---

## 8. Reports

- **POST** `/api/v1/reports`
- Body: `{"targetItemId":"<id>","reason":"Suspicious","details":"..."}`

---

## 9. Users

- **GET** `/api/v1/users/me` (Auth required)

---

## 10. Health

- **GET** `/health` → `{"status":"ok"}`

---

## Postman Tips

1. Create Collection variable `token`, set it after login.
2. For protected endpoints: Authorization → Type: Bearer Token → Value: `{{token}}`
3. Add a Login request with Tests script to auto-save token:
```javascript
if (pm.response.code === 200) {
  pm.collectionVariables.set("token", pm.response.json().token);
}
```
