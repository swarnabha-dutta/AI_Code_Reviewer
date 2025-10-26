<h1 align="center">🤖 AI Code Reviewer</h1>

<p align="center">
  <i>Enterprise-grade AI code review system powered by Google Gemini</i>
</p>

<p align="center">
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/Frontend-React-61DAFB?logo=react" alt="React"/></a>
  <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Bundler-Vite-646CFF?logo=vite" alt="Vite"/></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js" alt="Node.js"/></a>
  <a href="https://expressjs.com/"><img src="https://img.shields.io/badge/API-Express-000000?logo=express" alt="Express"/></a>
  <a href="https://www.mongodb.com/"><img src="https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb" alt="MongoDB"/></a>
  <a href="https://ai.google.dev/"><img src="https://img.shields.io/badge/AI-Google%20Gemini-4285F4?logo=google" alt="Gemini"/></a>
  <a href="https://render.com/"><img src="https://img.shields.io/badge/Hosting-Render-46E3B7?logo=render" alt="Render"/></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-ISC-blue" alt="License"/></a>
</p>

---

## 📸 Screenshots

<p align="center"><i>Visual proof of real functionality — authentic and production-ready</i></p>

### 🎨 Application Interface

<div align="center">
  <table>
    <tr>
      <td width="50%"><img src="https://github.com/user-attachments/assets/307ab62a-3278-409b-a577-876290f677fd" width="100%" alt="Code Input Interface"/></td>
      <td width="50%"><img src="https://github.com/user-attachments/assets/0aabc83b-ff30-49af-a0a1-5c9b60b3ee68" width="100%" alt="AI Review Output"/></td>
    </tr>
    <tr>
      <td align="center"><b>Code Input Interface</b><br/>Clean, intuitive code editor with file upload support</td>
      <td align="center"><b>AI-Generated Review</b><br/>Comprehensive feedback with categorized insights</td>
    </tr>
  </table>
</div>

---

### 🧠 Performance Monitoring Journey

<p align="center"><i>Baseline vs After Feature Integration — Real metrics from Chrome DevTools & Lighthouse</i></p>

<div align="center">
  <table>
    <tr>
      <th colspan="2">Baseline Metrics</th>
      <th colspan="2">Metrics After MongoDB + File Upload</th>
    </tr>
    <tr>
      <td><img src="https://github.com/user-attachments/assets/be419f8d-8896-4831-9733-00b1f416dd13" width="100%" alt="Before SS1"/></td>
      <td><img src="https://github.com/user-attachments/assets/cb345538-3fb2-478e-9869-b7a643d194c7" width="100%" alt="Before SS2"/></td>
      <td><img src="https://github.com/user-attachments/assets/cf954ef2-bbec-4250-8601-09027ddd2b3d" width="100%" alt="After SS1"/></td>
      <td><img src="https://github.com/user-attachments/assets/31f72ad8-99b8-44ef-a301-08c8850ded0d" width="100%" alt="After SS2"/></td>
    </tr>
    <tr>
      <td colspan="2">
        <b>Initial Scores:</b><br/>
        • Lighthouse: 92-95/100<br/>
        • FCP: 0.4-0.9s<br/>
        • LCP: 0.4-0.9s<br/>
        • Speed Index: 2.2-2.7s
      </td>
      <td colspan="2">
        <b>After Feature Integration:</b><br/>
        • Lighthouse: 88-100/100 ⚡<br/>
        • FCP: 0.6-0.9s<br/>
        • LCP: 0.7-0.9s<br/>
        • Speed Index: 0.6-10.6s
      </td>
    </tr>
  </table>
</div>

<p align="center"><i>✅ Metrics verified across multiple Chrome DevTools audits for consistency</i></p>

---

## 🖼️ Project Overview

**AI Code Reviewer** is a full-stack web application that leverages **Google Gemini AI** to provide enterprise-grade automated code reviews.  
It features a **modern React frontend (Vite)**, a **robust Node.js/Express backend** with **MongoDB** for persistent storage, and **multi-file upload** capabilities for batch code analysis.

- 🌐 **Live Frontend:** [ai-code-reviewer-frontend-273n.onrender.com](https://ai-code-reviewer-frontend-273n.onrender.com/)
- 💻 **GitHub Repo:** [swarnabha-dutta/AI_Code_Reviewer](https://github.com/swarnabha-dutta/AI_Code_Reviewer)

---

## 🚀 Tech Stack

| Layer | Technology | Description |
|:--|:--|:--|
| **Frontend** | ![React](https://img.shields.io/badge/-React-61DAFB?logo=react) <br> ![Vite](https://img.shields.io/badge/-Vite-646CFF?logo=vite) | Modern UI, blazing-fast dev/build, SPA experience |
| **Backend** | ![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js) <br> ![Express](https://img.shields.io/badge/-Express-000000?logo=express) | REST API, business logic, CORS, routing, file handling |
| **Database** | ![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?logo=mongodb) | NoSQL database for storing review history |
| **AI Service** | ![Gemini](https://img.shields.io/badge/-Google%20Gemini-4285F4?logo=google) | Advanced code review via generative AI |
| **Hosting** | ![Render](https://img.shields.io/badge/-Render-46E3B7?logo=render) | Cloud deployment for both frontend and backend |

---

## 🏗️ Architecture & Flow

| Part | Location | Key Files / Folders | Description |
|:--|:--|:--|:--|
| **Frontend** | `/frontend` | `src/App.jsx`, `src/main.jsx` | React SPA for code input and displaying AI feedback |
| **Backend** | `/backend` | `server.js`, `src/app.js` | Express server, routing, middleware setup |
| **Routes** | `/backend/src/routes/ai.route.js` | — | Defines `/ai/get-review` POST endpoint |
| **Controller** | `/backend/src/controllers/ai.controller.js` | — | API logic, validation, and error handling |
| **Middleware** | `/backend/src/middlewares/upload.middleware.js` | — | Handles multi-file uploads with Multer |
| **Models** | `/backend/src/models/review.model.js` | — | MongoDB schema for review storage |
| **AI Service** | `/backend/src/services/ai.service.js` | — | Integrates Google Gemini API for analysis |
| **Configs** | `/backend/.env`, `/frontend/.env` | — | Environment variables (API keys, URLs, ports) |

---

## 🔄 Workflow

| Layer | Flow |
|:--|:--|
| **Frontend** | ① User uploads file(s) or pastes code → ② Sends POST to `/ai/get-review` → ③ Displays AI feedback |
| **Backend** | ① Receives request → ② Validates input → ③ Calls AI Service → ④ Stores in MongoDB → ⑤ Returns JSON |
| **AI Service** | ① Sends prompt to Gemini → ② Gets structured review → ③ Returns response |
| **Database** | ① Stores review history → ② Enables retrieval of past reviews |
| **Deployment** | ① Frontend & Backend hosted on Render → ② Env vars managed securely |

---

## 🧩 Features

- 💡 **AI-Powered Code Review** via Google Gemini API  
- 📁 **Multiple File Upload Support** for batch code analysis
- 🗄️ **MongoDB Integration** for persistent review history storage
- ⚡ **Fast Modern UI** using React + Vite  
- 🔐 **Secure RESTful API** with CORS, validation & file handling middleware  
- ☁️ **Deployable on Render** in one click  
- 🧠 **Smart feedback** on performance, security, and readability
- 📊 **Performance Optimized** - Lighthouse scores 88-100/100 with sub-second metrics

---

## ⚙️ Installation & Local Setup

### 1️⃣ Clone Repository
```bash
git clone https://github.com/swarnabha-dutta/ai-code-reviewer.git
cd ai-code-reviewer
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
# Create a .env file with:
# PORT=4000
# GOOGLE_GEMINI_API_KEY=your_api_key_here
# MONGODB_URI=your_mongodb_connection_string
npm start
```

### 3️⃣ Frontend Setup

```bash
cd ../frontend
npm install
# Create a .env file with:
# VITE_BACKEND_URL=http://localhost:4000
npm run dev
```

---

## 🌐 Deployment on Render

### Backend:
- **Type:** Web Service
- **Root Directory:** `backend`
- **Start Command:** `npm start`
- **Environment Variables:**
  - `PORT`
  - `GOOGLE_GEMINI_API_KEY`
  - `MONGODB_URI`

### Frontend:
- **Type:** Static Site
- **Root Directory:** `frontend`
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`
- **Environment Variables:**
  - `VITE_BACKEND_URL=<your backend render URL>`

---

## 📚 Example API Usage

**POST** `/ai/get-review`

**Request (JSON):**
```json
{
  "code": "function hello() { console.log('Hello, world!'); }"
}
```

**Request (File Upload):**
```bash
curl -X POST http://localhost:4000/ai/get-review \
  -F "files=@code.js" \
  -F "files=@utils.js"
```

**Response:**
```json
{
  "success": true,
  "review": "🔴 Critical: Avoid global functions...\n🟡 Major: Use const instead of var...\n🟢 Minor: Add function JSDoc...\n💡 Enhancement: Consider modularization.",
  "timestamp": "2025-10-18T10:30:00.000Z"
}
```

---

## 🛡️ Security & Best Practices

- Secrets handled via `.env` only
- CORS enabled for frontend-backend communication
- Input validation and error handling in controller layer
- File size limits enforced by Multer middleware
- MongoDB connection secured with authentication

---

## 🖼️ Folder Structure

```
ai-code-reviewer/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── src/
│   │   ├── app.js
│   │   ├── controllers/
│   │   │   └── ai.controller.js
│   │   ├── middlewares/
│   │   │   └── upload.middleware.js
│   │   ├── models/
│   │   │   └── review.model.js
│   │   ├── routes/
│   │   │   └── ai.route.js
│   │   └── services/
│   │       └── ai.service.js
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── public/
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── index.html
│   └── .env.example
│
├── README.md
├── .gitignore
└── LICENSE
```

---

## 🎯 Key Technical Highlights

| Feature | Implementation | Impact |
|:--|:--|:--|
| **Performance** | Lighthouse 88-100/100, LCP 0.6-0.9s | Fast, responsive user experience |
| **Scalability** | MongoDB + Express REST API | Handles multiple concurrent reviews |
| **AI Integration** | Google gemini-2.5-flash | Advanced code analysis capabilities |
| **File Handling** | Multer middleware with validation | Supports batch file uploads |
| **Error Handling** | Comprehensive try-catch blocks | Robust API with clear error messages |

---

## 🏷️ License

This project is licensed under the **ISC License**.

---

<p align="center">
  💙 Built by <a href="https://github.com/swarnabha-dutta">Swarnabha Dutta</a> — with Google Gemini, React & MongoDB
</p>

<p align="center">
  <a href="https://github.com/swarnabha-dutta">GitHub</a> •
  <a href="https://www.linkedin.com/in/swarnabhadutta909">LinkedIn</a> •
  <a href="mailto:swarnabhadutta909@gmail.com">Email</a>
</p>
