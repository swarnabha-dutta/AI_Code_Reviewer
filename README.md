


<h1 align="center">🤖 AI Code Reviewer</h1>

<p align="center">
  <i>Enterprise-grade AI code review system powered by Google Gemini</i>
</p>

<p align="center">
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/Frontend-React-61DAFB?logo=react" alt="React"/></a>
  <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Bundler-Vite-646CFF?logo=vite" alt="Vite"/></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js" alt="Node.js"/></a>
  <a href="https://expressjs.com/"><img src="https://img.shields.io/badge/API-Express-000000?logo=express" alt="Express"/></a>
  <a href="https://ai.google.dev/"><img src="https://img.shields.io/badge/AI-Google%20Gemini-4285F4?logo=google" alt="Gemini"/></a>
  <a href="https://render.com/"><img src="https://img.shields.io/badge/Hosting-Render-46E3B7?logo=render" alt="Render"/></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-ISC-blue" alt="License"/></a>
</p>

---

## 📸 Screenshots

<p align="center"><i>Visual proof of real functionality — authentic and production-ready</i></p>

### 🧠 Performance Monitoring

<p align="center">
  <img src="https://github.com/user-attachments/assets/e06ad03b-d9ba-4295-a6cd-4b2011a91511" width="80%" alt="Performance Monitoring Screenshot 1"/>
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/5907f2c8-c3d6-4620-a83b-40d8c3d4da8f" width="80%" alt="Performance Monitoring Screenshot 2"/>
</p>

---

## 🖼️ Project Overview

**AI Code Reviewer** is a full-stack web application that leverages **Google Gemini AI** to provide enterprise-grade automated code reviews.  
It features a **modern React frontend (Vite)** and a **robust Node.js/Express backend**, fully integrated and deployable on **Render**.

- 🌐 **Live Frontend:** [ai-code-reviewer-frontend-tlzs.onrender.com](#)
- 💻 **GitHub Repo:** [swarnabha-dutta/AI_Code_Reviewer](https://github.com/swarnabha-dutta/AI_Code_Reviewer)

---

## 🚀 Tech Stack

| Layer | Technology | Description |
|:--|:--|:--|
| **Frontend** | ![React](https://img.shields.io/badge/-React-61DAFB?logo=react) <br> ![Vite](https://img.shields.io/badge/-Vite-646CFF?logo=vite) | Modern UI, blazing-fast dev/build, SPA experience |
| **Backend** | ![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js) <br> ![Express](https://img.shields.io/badge/-Express-000000?logo=express) | REST API, business logic, CORS, routing |
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
| **AI Service** | `/backend/src/services/ai.service.js` | — | Integrates Google Gemini API for analysis |
| **Configs** | `/backend/.env`, `/frontend/.env` | — | Environment variables (API keys, URLs, ports) |

---

## 🔄 Workflow

| Layer | Flow |
|:--|:--|
| **Frontend** | ① User pastes code → ② Sends POST to `/ai/get-review` → ③ Displays AI feedback |
| **Backend** | ① Receives request → ② Validates input → ③ Calls AI Service → ④ Returns JSON |
| **AI Service** | ① Sends prompt to Gemini → ② Gets structured review → ③ Returns response |
| **Deployment** | ① Frontend & Backend hosted on Render → ② Env vars managed securely |

---

## 🧩 Features

- 💡 **AI-Powered Code Review** via Google Gemini API  
- ⚡ **Fast Modern UI** using React + Vite  
- 🔐 **Secure RESTful API** with CORS and validation  
- ☁️ **Deployable on Render** in one click  
- 🧠 **Smart feedback** on performance, security, and readability

---

## ⚙️ Installation & Local Setup

### 1️⃣ Clone Repository
```bash
git clone https://github.com/swarnabha-dutta/ai-code-reviewer.git
cd ai-code-reviewer
````

### 2️⃣ Backend Setup

```bash
cd backend
npm install
# Create a .env file
# PORT=4000
# GOOGLE_GEMINI_API_KEY=your_api_key_here
npm start
```

### 3️⃣ Frontend Setup

```bash
cd ../frontend
npm install
# Create a .env file
# VITE_BACKEND_URL=http://localhost:4000
npm run dev
```

---

## 🌐 Deployment on Render

* **Backend:**

  * Type: Web Service
  * Root Directory: `backend`
  * Start Command: `npm start`
  * Env Vars: `PORT`, `GOOGLE_GEMINI_API_KEY`

* **Frontend:**

  * Type: Static Site
  * Root Directory: `frontend`
  * Build Command: `npm install && npm run build`
  * Publish Directory: `dist`
  * Env Var: `VITE_BACKEND_URL=<your backend render URL>`

---

## 📚 Example API Usage

**POST** `/ai/get-review`

**Request:**

```json
{
  "code": "function hello() { console.log('Hello, world!'); }"
}
```

**Response:**

```json
{
  "review": "🔴 Critical: Avoid global functions... 🟡 Major: Use const instead of var... 🟢 Minor: Add function JSDoc... 💡 Enhancement: Consider modularization."
}
```

---

## 🛡️ Security & Best Practices

* Secrets handled via `.env` only
* CORS enabled for frontend-backend communication
* Input validation and error handling in controller layer

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
│   │   ├── index.css
│   │   └── main.jsx
│   ├── public/
│   ├── vite.config.js
│   └── .env.example
│
├── README.md
└── .gitignore
```

---

## 🏷️ License

This project is licensed under the **ISC License**.

---

<p align="center">
  💙 Built by <a href="https://github.com/swarnabha-dutta">Swarnabha Dutta</a> — with Google Gemini & React
</p>
```

