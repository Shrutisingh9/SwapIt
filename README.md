# SwapIt - Item Exchange Platform

SwapIt is a platform where users can upload items they no longer need and exchange them with others instead of selling them. Built with React.js, Node.js, Express, and MongoDB.

## Tech Stack

- **Frontend**: React.js (JavaScript)
- **Backend**: Node.js + Express (JavaScript)
- **Database**: MongoDB (Mongoose)
- **Real-time**: Socket.io
- **Authentication**: JWT

## Project Structure

```
SwapIt/
├── backend/          # Node.js + Express API
│   ├── src/
│   │   ├── config/   # Database & environment config
│   │   ├── core/     # Auth, HTTP middleware
│   │   ├── models/   # Mongoose models
│   │   └── modules/  # Feature modules (auth, items, swaps, chat, ratings)
│   └── package.json
├── frontend/         # React application
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   └── pages/
│   └── package.json
└── package.json      # Root package.json for running both
```

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 1. Install Dependencies

From the root directory:

```bash
npm run install:all
```

Or install separately:

```bash
# Root dependencies
npm install

# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

Create `backend/.env`:

```env
DATABASE_URL=mongodb://localhost:27017/swapit
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
JWT_EXPIRES_IN=1d
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 3. Start MongoDB

Make sure MongoDB is running locally, or update `DATABASE_URL` to your MongoDB Atlas connection string.

### 4. Run the Application

**Option 1: Run both together (recommended)**

From the root directory:

```bash
npm run dev
```

**Option 2: Run separately**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm start
```

### 5. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- Health Check: http://localhost:4000/health

## Features

### ✅ Authentication
- User registration and login
- JWT-based authentication
- Protected routes

### ✅ Item Management
- Create, view, update, and delete items
- Upload multiple images
- Search and filter items
- Only available items are visible

### ✅ Swap System
- Request swaps with your items
- Accept/reject swap requests
- Complete swaps
- Automatic swap points on completion
- Items marked as swapped after completion

### ✅ Private Chat
- Real-time messaging via Socket.io
- One chat room per swap
- Private communication (no phone numbers exposed)

### ✅ Rating System
- Rate users after completed swaps (1-5 stars)
- Automatic rating aggregation
- Trust building system

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user

### Items
- `GET /api/v1/items` - List available items (with search & category filter)
- `GET /api/v1/items/:id` - Get item details
- `POST /api/v1/items` - Create item (auth required)
- `PATCH /api/v1/items/:id` - Update item (owner only)
- `DELETE /api/v1/items/:id` - Archive item (owner only)

### Swaps
- `GET /api/v1/swaps` - List user's swaps (auth required)
- `POST /api/v1/swaps` - Create swap request (auth required)
- `POST /api/v1/swaps/:id/accept` - Accept swap (responder only)
- `POST /api/v1/swaps/:id/reject` - Reject swap (responder only)
- `POST /api/v1/swaps/:id/cancel` - Cancel swap (participants)
- `POST /api/v1/swaps/:id/complete` - Complete swap (participants)

### Chat
- `GET /api/v1/chat/rooms/:roomId/messages` - Get messages (auth required)
- `POST /api/v1/chat/rooms/:roomId/messages` - Send message (auth required)

### Ratings
- `POST /api/v1/ratings/swaps/:swapId` - Rate user after swap (auth required)

## Development

### Backend Scripts
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

### Frontend Scripts
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## Production Deployment

1. Build frontend:
```bash
cd frontend
npm run build
```

2. Set production environment variables in `backend/.env`

3. Start backend:
```bash
cd backend
npm start
```

4. Serve frontend build (using nginx, Vercel, Netlify, etc.)

## License

MIT
