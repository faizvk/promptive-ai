# Promptive AI 🚀

AI Image Generation & Content Rewrite SaaS Platform

Promptive AI is a full-stack SaaS application that enables users to generate AI-powered images, rewrite content using multiple tones, and manage their creative workflow through a secure, modern dashboard.

The application follows real-world SaaS architecture patterns, including authentication, protected routes, dashboard layouts, history tracking, and responsive UI/UX.

---

## 🌐 Features Overview

### 🔐 Authentication

- JWT-based authentication
- Public and protected routes
- Persistent login using token storage
- Automatic logout on unauthorized access
- Secure API access with Axios interceptors

---

### 🧠 AI Capabilities

#### 🎨 Image Generation

- Prompt-based AI image generation
- AI providers via Google GenAI and Hugging Face
- Preview generated images
- Download generated images
- Cloud-based image storage (Cloudinary)

#### ✍️ Content Rewrite

- Rewrite text while preserving original meaning
- Multiple tones:
  - Professional
  - Formal
  - Casual
  - Creative
- Copy rewritten content
- Regenerate content on demand

---

### 📊 Dashboard

- Professional SaaS-style dashboard layout
- Sidebar and topbar navigation
- Quick actions for image generation and rewriting
- Responsive design (desktop & mobile)
- Smooth UI animations using Framer Motion

---

### 🕓 History Management

- Image generation history
- Content rewrite history
- Grouped by date:
  - Today
  - Yesterday
  - Earlier
- Modal-based content preview
- Copy rewritten text
- Download generated images
- Delete individual history items

---

## 🛠 Tech Stack

### Frontend

- React 19 (Vite)
- React Router DOM v7
- React Hook Form
- Zod (schema validation)
- Axios
- Framer Motion
- Lucide React Icons
- Custom SaaS-grade CSS
- ESLint for code quality

---

### Backend

- Node.js
- Express.js (v5)
- MongoDB with Mongoose
- JWT Authentication
- Google Generative AI
- Hugging Face Inference API
- Cloudinary (image storage)
- Multer (file handling)
- Bcrypt (password hashing)
- CORS & Dotenv
- Nodemon (development)

---

## 📂 Repository Structure

promptive-ai/
├── frontend/ # React (Vite) Application
│ ├── src/
│ │ ├── api/ # Axios instances & API calls
│ │ ├── components/ # Reusable UI components
│ │ ├── dashboard/ # Dashboard-specific views
│ │ ├── routes/ # Auth guards & Route config
│ │ └── styles/ # Global & Modular CSS
├── backend/ # Node/Express API
│ ├── controllers/ # Business logic
│ ├── models/ # MongoDB Schemas
│ ├── routes/ # API Endpoints
│ ├── middleware/ # Auth & File upload logic
│ └── index.js # Entry point

---

## 🎨 Frontend Setup

### Environment Variables

Create a `.env` file inside the `frontend` directory:

VITE_API_BASE_URL=http://localhost:5000/api

### Install & Run Frontend

cd frontend
npm install
npm run dev

Frontend will run at:

http://localhost:5173

---

## ⚙️ Backend Setup

### Environment Variables

Create a `.env` file inside the `backend` directory:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
GOOGLE_API_KEY=your_google_genai_key
HUGGINGFACE_API_KEY=your_huggingface_key

### Install & Run Backend

cd backend
npm install
npm run dev

Backend will run at:

http://localhost:5000

---

## 🔐 Route Access Control

| Route                | Access        |
| -------------------- | ------------- |
| `/`                  | Public        |
| `/login`             | Public        |
| `/signup`            | Public        |
| `/dashboard`         | Authenticated |
| `/dashboard/image`   | Authenticated |
| `/dashboard/rewrite` | Authenticated |
| `/dashboard/history` | Authenticated |

---

## 📡 API Endpoints

### Authentication

- `POST /api/signup`
- `POST /api/login`

### AI Services

- `POST /api/images/generate-image`
- `POST /api/content/rewrite`

### History

- `GET /api/history`
- `DELETE /api/history/:type/:id`

---

## 🧪 Authentication Flow

1. User signs up or logs in
2. Backend returns a JWT token
3. Token is stored on the client
4. Axios interceptor attaches token to requests
5. Backend validates token for protected routes
6. Unauthorized users are redirected to login

---

## 📈 Future Enhancements

- Subscription & billing (Stripe)
- Usage limits per plan
- Team collaboration
- Role-based access control (RBAC)
- Admin dashboard
- Export history (ZIP / PDF)
- Public API access for developers

---

## 🤝 Contributing

1. Fork the repository
2. Create a new feature branch
3. Commit your changes
4. Open a pull request

---

## 📄 License

MIT License

---

## 👨‍💻 Author

**Faiz VK**  
Building production-grade SaaS applications with React, Node.js, and AI.
