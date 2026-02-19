# SwapIt – Deployment Guide & AI Ideas

## User Data Policy (Verified)

**No automatic removal** – All removals are user-initiated only:

- **Chats** – Removed only when user clicks "Remove" on a contact
- **Wishlist** – Removed only when user clicks heart to unsave
- **Deleted contacts** – Only hidden after user explicitly deletes
- **Items** – Deleted only by owner
- **Profile/logout** – User-initiated only

Nothing is auto-deleted, auto-cleared, or auto-hidden without user action.

---

## Deployment Checklist

### Environment Variables

**Backend** (`backend/.env`):

- `DATABASE_URL` – MongoDB connection string
- `JWT_SECRET` – Min 32 chars
- `PORT` – Default 4000
- `FRONTEND_URL` – e.g. `https://yourdomain.com` (for CORS & Socket.io)

**Frontend** (set in build or hosting):

- `REACT_APP_API_URL` – Backend API URL, e.g. `https://api.yourdomain.com`  
  - If empty, falls back to `http://localhost:4000` (used for Socket.io)

### Build & Run

```bash
# Install
npm run install:all

# Dev
npm run dev

# Build frontend (static files in frontend/build)
npm run build

# Start backend
npm start
```

### Hosting Options

- **Frontend:** Vercel, Netlify, GitHub Pages, or any static host  
- **Backend:** Railway, Render, Fly.io, Heroku, or a VPS  
- **Database:** MongoDB Atlas (already in use)

### Production Checklist

1. Set `NODE_ENV=production`
2. Set `FRONTEND_URL` to the deployed frontend URL
3. Update frontend proxy / `REACT_APP_API_URL` to the deployed API URL
4. Keep `JWT_SECRET` secure and never commit it
5. Use HTTPS in production
6. Optionally disable or guard index-dropping logic in `backend/src/config/db.js`

### Proxy Note

Frontend uses `"proxy":"http://localhost:4000"` in development. In production, configure your frontend hosting to proxy `/api` to the backend, or set `REACT_APP_API_URL` and update API calls to use it.

---

## AI Ideas for SwapIt

### High Impact

1. **Smart Search** – Semantic search over item titles/descriptions for natural queries
2. **Item Descriptions** – Generate descriptions from photos (image-to-text)
3. **Fair Value Suggestions** – Rough value ranges based on category, condition, and demand
4. **Matching & Recommendations** – “Items you might like” / “Users with similar tastes”
5. **Chat Summaries** – Summarize swap discussions (what was offered, agreed, pending)
6. **Smart Categories** – Auto-suggest category from title/description or image

### Medium Impact

7. **Image Moderation** – Check for inappropriate content before publish
8. **Fraud / Risk Hints** – Flag suspicious patterns (e.g. too many swaps, odd behavior)
9. **Translation** – Translate item descriptions and chat for multilingual use
10. **Price / Condition Insights** – “Similar items typically swap in X days” or condition tips

### Nice to Have

11. **Voice Search** – Speech-to-text for search
12. **Accessibility** – Alt-text generation for images
13. **Notifications** – Summaries like “3 new swaps, 2 chats need reply”
14. **Support Bot** – FAQ and basic help answers

---

## Codebase Notes

- **Backend:** Node.js + Express; no TypeScript
- **Frontend:** React (Create React App)
- **DB:** MongoDB + Mongoose
- **Real-time:** Socket.io for chat
