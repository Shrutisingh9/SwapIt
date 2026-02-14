# SwapIt - Complete Site Workflow

This document describes the end-to-end user and system workflow for SwapIt.

---

## High-Level Overview

SwapIt is an item swapping and donation platform. Users can:
- List items for **swap** or **donation**
- Browse and search items
- Initiate swap requests
- Chat with other users about swaps
- Donate items to NGOs
- Rate users after completed swaps
- Report items/users
- Get notifications

---

## Workflow Diagrams

### 1. User Registration & Login

```
User → Register (email, password, name, location)
     → Backend creates User, returns JWT
User → Login (email, password)
     → Backend validates, returns JWT
Frontend stores JWT (localStorage) for subsequent API calls
```

**API Calls:**
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`

---

### 2. Browse & Search Items

```
User lands on Home (/) or Explore (/explore)
  → GET /api/v1/items (optional: ?q=, ?category=, ?type=)
  → Display grid of items

User can:
  - Search via navbar (updates ?q=)
  - Filter by category pills (updates ?category=)
  - Filter by Swap/Donation on Explore (updates ?type=)
  - Click "Load more" to show more items (client-side pagination)
```

**API Calls:**
- `GET /api/v1/items`
- `GET /api/v1/items?q=laptop&category=Electronics&type=swap`

---

### 3. View Item Detail

```
User clicks an item card
  → Navigate to /items/:id
  → GET /api/v1/items/:id
  → Show full details, images, owner, Swap/Request Swap / Donate buttons
```

**API Calls:**
- `GET /api/v1/items/:id`

---

### 4. Add Item (List for Swap or Donation)

```
User clicks "+ ADD ITEM" (navbar) or "Start listing"
  → Navigate to /items/create (requires login)
  → User fills form: title, description, category, condition, location, images
  → User chooses: Swap / Donate
  → If Donate: optionally select NGO
  → POST /api/v1/items
  → Redirect to item detail or home
```

**API Calls:**
- `GET /api/v1/ngos` (if Donate selected – to populate NGO dropdown)
- `POST /api/v1/items`

---

### 5. Initiate Swap

```
User A views User B's item
  → Clicks "Request Swap"
  → Must select own item to offer in exchange
  → POST /api/v1/swaps { requestedItemId, offeredItemId }
  → Swap created (status: PENDING)
  → User B gets notification
```

**API Calls:**
- `POST /api/v1/swaps`

---

### 6. Accept / Reject Swap

```
User B sees swap in "My Swaps"
  → Opens swap detail
  → Can Accept or Reject
  → POST /api/v1/swaps/:id/accept  OR  POST /api/v1/swaps/:id/reject
  → If accepted: swap status → ACCEPTED, chat room created
```

**API Calls:**
- `POST /api/v1/swaps/:id/accept`
- `POST /api/v1/swaps/:id/reject`

---

### 7. Chat (Swap Negotiation)

```
Both users in accepted swap
  → Navigate to /swaps/:id (SwapDetail)
  → GET /api/v1/chat/rooms/:roomId/messages (roomId = swap._id)
  → Real-time chat via Socket.io (or poll)
  → POST /api/v1/chat/rooms/:roomId/messages to send
```

**API Calls:**
- `GET /api/v1/chat/rooms/:roomId/messages`
- `POST /api/v1/chat/rooms/:roomId/messages`

---

### 8. Complete Swap

```
Users finalize exchange in person
  → Either party clicks "Complete Swap"
  → POST /api/v1/swaps/:id/complete
  → Swap status → COMPLETED
  → Items marked SWAPPED
  → Both users can rate each other
```

**API Calls:**
- `POST /api/v1/swaps/:id/complete`

---

### 9. Rate User (After Swap)

```
After swap completed
  → User sees "Rate this swap" prompt
  → POST /api/v1/ratings/swaps/:swapId { score: 1-5 }
  → Rating stored, user's average rating updated
```

**API Calls:**
- `POST /api/v1/ratings/swaps/:swapId`

---

### 10. Donate to NGO

```
User lists item as Donation, selects NGO
  → POST /api/v1/items (isForDonation: true, ngoId: "...")
  → NGO can be contacted / item handed off per platform flow
```

**API Calls:**
- `GET /api/v1/ngos` (to list NGOs)
- `POST /api/v1/items` (with isForDonation, ngoId)

---

### 11. Notifications

```
System creates notifications for:
  - New swap request
  - Swap accepted/rejected
  - New chat message
  - Swap completed

User opens Notifications page
  → GET /api/v1/notifications
  → Can mark all as read: POST /api/v1/notifications/read-all
```

**API Calls:**
- `GET /api/v1/notifications`
- `POST /api/v1/notifications/read-all`

---

### 12. Report Item / User

```
User sees "Report" on item detail or profile
  → Clicks Report
  → Fills reason, details
  → POST /api/v1/reports { targetItemId, reason, details }
```

**API Calls:**
- `POST /api/v1/reports`

---

### 13. Profile

```
User opens Profile
  → GET /api/v1/users/me
  → Shows name, email, stats (items listed, swaps, rating)
```

**API Calls:**
- `GET /api/v1/users/me`

---

## Page-to-API Mapping

| Page              | Main API Calls                                      |
|-------------------|------------------------------------------------------|
| Home (/)          | GET /api/v1/items                                   |
| Explore           | GET /api/v1/items                                   |
| Item Detail       | GET /api/v1/items/:id                               |
| Create Item       | GET /api/v1/ngos, POST /api/v1/items                |
| My Swaps          | GET /api/v1/swaps                                   |
| Swap Detail       | GET /api/v1/swaps (or single), GET/POST chat        |
| Profile           | GET /api/v1/users/me                                |
| Notifications     | GET /api/v1/notifications, POST read-all            |
| Login/Register    | POST /api/v1/auth/login, /register                  |

---

## Suggested Testing Order in Postman

1. **Health** – `GET /health`
2. **Register** – `POST /auth/register` → save token
3. **Login** – `POST /auth/login` → save token
4. **List items** – `GET /items`
5. **Create item** – `POST /items`
6. **Get item** – `GET /items/:id`
7. **Create swap** – `POST /swaps` (use two item IDs)
8. **List swaps** – `GET /swaps`
9. **Accept swap** – `POST /swaps/:id/accept`
10. **Chat** – `GET/POST /chat/rooms/:roomId/messages`
11. **Complete swap** – `POST /swaps/:id/complete`
12. **Rate** – `POST /ratings/swaps/:swapId`
13. **Profile** – `GET /users/me`
14. **Notifications** – `GET /notifications`
15. **Report** – `POST /reports`
