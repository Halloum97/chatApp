# Chat App

A real-time chat application I'm building with React, Firebase, and Vite. The idea is pretty straightforward — sign up, find people, and start chatting. Messages show up instantly, you can share images, and it works on mobile too.

## What it does

- Sign up / log in with email and password
- Update your profile (name, bio, avatar)
- Search for other users by username
- Real-time messaging with text and images
- See who's online and who isn't
- Shared media gallery in chat

## Tech stack

- **React 18** with React Router for navigation
- **Firebase** — Auth, Firestore (database), Storage (file uploads)
- **Vite** for fast dev builds
- **React Toastify** for notifications

## Getting started

1. Clone the repo
   ```
   git clone <repository-url>
   cd chat-app
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up Firebase — create a `.env` file in the root (see `.env.example` for the format):
   ```
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_AUTH_DOMAIN=your_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. Run it
   ```
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

## Project structure

```
src/
├── assets/          # Icons, images
├── components/
│   ├── ChatBox/     # Message area — send/receive texts and images
│   ├── LeftSidebar/ # Contacts list, user search
│   └── RightSidebar/# Selected user's profile, shared media
├── config/
│   └── firebase.js  # Firebase init + auth helpers
├── context/
│   └── AppContext.jsx # Global state (user data, chat data, active chat)
├── lib/
│   └── upload.js    # Firebase Storage upload helper
├── pages/
│   ├── Chat/        # Main chat page (3-column layout)
│   ├── Login/       # Login & signup form
│   └── ProfileUpdate/ # Edit name, bio, avatar
├── App.jsx          # Routes + auth state listener
└── main.jsx         # Entry point
```

## Scripts

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview the build locally |
| `npm run lint` | Run ESLint |

## Deployment

Build the project and deploy the `dist/` folder to Firebase Hosting, Vercel, or Netlify:
```
npm run build
```

