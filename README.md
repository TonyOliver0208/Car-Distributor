# 🚗 Car Distributor

Car Distributor is a full-stack car listing platform where users can post cars for sale, view car details, calculate financing, chat with owners, and more — supporting multilingual (English/Vietnamese) and featuring real-time messaging!

# 📋 Features

- 🚀 Fast front-end built with React + Vite

- 🌍 Multilingual support (English + Vietnamese) via i18next

- 💬 Real-time messaging with Sendbird UIKit

- 🔒 Authentication using Clerk

- ☁️ Image upload/storage using Cloudinary

- 🔥 Searching car listing with image (ML-Powered FastAPI Server)

- 📊 Car listing stats, reviews, and traffic analysis

- 🎨 Beautiful UI with TailwindCSS + Radix UI + shadcn

- 🔥 Database managed with Drizzle ORM and Neon PostgreSQL

# 📦 Tech Stack

| Frontend | Backend     | Database   | Realtime            | Styling   |
| -------- | ----------- | ---------- | ------------------- | --------- |
| React 19 | Vite        | Neon DB    | Sendbird            | Tailwind  |
| Clerk    | Drizzle ORM | PostgreSQL | Firebase (optional) | Shadcn UI |

# 🛠️ Setup Instructions

1. Clone the Repo

```
git clone https://github.com/TonyOliver0208/Car-Distributor.git
cd car-project
```

2. Install Dependencies

```
npm install
//or if you vibe with pnpm:

pnpm install
```

3. Set Up Environment Variables
   Create a file named .env.local at the root of your project and add:

```
// Clerk
VITE_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key

// Database
VITE_DRIZZLE_DATABASE_URL=your-neon-database-url

// Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_API_KEY=your-api-key
VITE_CLOUDINARY_API_SECRET=your-api-secret
VITE_CLOUDINARY_PRESET=your-upload-preset

// Sendbird
VITE_SENDBIRD_APP_ID=your-sendbird-app-id
VITE_SENDBIRD_API_TOKEN=your-sendbird-api-token
```

4. Setup Drizzle Configuration
   Make sure you have a drizzle.config.js at the root level:

```
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./configs/schema.js",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: your-neon-database-url,
  },
});
```

🛠 Adjust dbCredentials.url if your database URL changes in .env.local.

5. Push Database Schema

After you edit or create database tables with Drizzle ORM, push the changes to your Neon DB:

```
npm run db:push
```

If you wanna visually manage your DB, open Drizzle Studio:

```
npm run db:studio
```

6. Start Development Server

```
npm run dev
```

It will start the app on:

http://localhost:5173
(Or whatever port Vite picks 👀)

7. Build for Production

When you're ready to launch:

```
npm run build
```

Preview production build:

```
npm run preview
```

8. 🔥 (Optional) Setup ML Server for Image Search Feature
   If you want the Search Car by Image feature to work, you have two options:

- (Easy way) Use the hosted API by replacing the API URL in the SearchBar.jsx component with: "https://car-model-server.onrender.com/predict"
  ⚡ Note: The hosted API is on free hosting (Render), so it may be a bit slow.
- (Recommended) Run the ML server locally for faster predictions:
  Steps to set up the local ML server:

```
# Move into the ML server directory
cd ../model-backend

# (Optional) Create and activate a virtual environment
python -m venv venv
source venv/bin/activate   # macOS/Linux
.\venv\Scripts\activate    # Windows

# Install required Python packages
pip install -r requirements.txt

# Start the ML server
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

The ML API will be running at: http://localhost:8000

# 🖼️ UI Screenshots

Here’s what CarDeal website looks like 👇

## Homepage

![Homepage Screenshot](https://res.cloudinary.com/da2j53n0s/image/upload/v1745869826/homepage_uh8ghb.png)
![Homepage Second Screenshot](https://res.cloudinary.com/da2j53n0s/image/upload/v1745869968/homepage_2_w9hr7g.png)

## Messaging

![Messaging Screenshot](https://res.cloudinary.com/da2j53n0s/image/upload/v1745870054/messaging_xmde5t.png)

## Image Searching

![Image Searching Screenshot](https://res.cloudinary.com/da2j53n0s/image/upload/v1745870178/searching_rlww92.png)
