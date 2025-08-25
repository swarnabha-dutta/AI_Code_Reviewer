# AI Code Reviewer

[![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react)](https://react.dev/) 
[![Vite](https://img.shields.io/badge/Bundler-Vite-646CFF?logo=vite)](https://vitejs.dev/) 
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js)](https://nodejs.org/) 
[![Express](https://img.shields.io/badge/API-Express-000000?logo=express)](https://expressjs.com/) 
[![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini-4285F4?logo=google)](https://ai.google.dev/) 
[![Render](https://img.shields.io/badge/Hosting-Render-46E3B7?logo=render)](https://render.com/) 
[![Open Source](https://img.shields.io/badge/License-ISC-blue)](LICENSE)

---

## 🖼️ Project Overview

**AI Code Reviewer** is a full-stack web application that leverages Google Gemini AI to provide enterprise-grade, automated code reviews. It features a modern React frontend (built with Vite) and a robust Node.js/Express backend, seamlessly integrated and deployable on Render.

- **Live Frontend:** [ai-code-reviewer-frontend-tlzs.onrender.com]()
- **GitHub Repo:** [swarnabha-dutta/AI_Code_Reviewer](https://github.com/swarnabha-dutta/AI_Code_Reviewer)

---

## 🚀 **Tech Stack**

| Layer      | Technology         | Description                                      |
|------------|--------------------|--------------------------------------------------|
| Frontend   | ![React](https://img.shields.io/badge/-React-61DAFB?logo=react) <br> ![Vite](https://img.shields.io/badge/-Vite-646CFF?logo=vite) | Modern UI, fast dev/build, SPA experience        |
| Backend    | ![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js) <br> ![Express](https://img.shields.io/badge/-Express-000000?logo=express) | REST API, business logic, CORS, routing          |
| AI Service | ![Google Gemini](https://img.shields.io/badge/-Google%20Gemini-4285F4?logo=google) | Advanced code review using generative AI         |
| Hosting    | ![Render](https://img.shields.io/badge/-Render-46E3B7?logo=render) | Cloud deployment for both frontend and backend   |

---

## 🏗️ Architecture & Flow

| Part         | Location         | Key Files / Folders                | Description                                                                                 |
|--------------|------------------|------------------------------------|---------------------------------------------------------------------------------------------|
| Frontend     | `/frontend`      | `src/App.jsx`, `main.jsx`          | React SPA for user interaction, code input, and displaying AI reviews                       |
| Backend      | `/backend`       | `server.js`, `src/app.js`          | Express server, API routing, CORS, JSON parsing                                             |
| API Routing  | `/backend/src/routes/ai.routes.js` |                            | Defines `/ai/get-review` POST endpoint for code review requests                             |
| Controller   | `/backend/src/controllers/ai.controller.js` |                | Handles API logic, input validation, error handling                                         |
| AI Service   | `/backend/src/services/ai.service.js` |                        | Integrates with Google Gemini API, applies enterprise-grade review instructions             |
| Config       | `/backend/.env`, `/frontend/.env`   |                        | Environment variables for API keys, backend URL, etc.                                       |

---

## 🔄 How Each Part Works

| Layer      | Flow Description                                                                                  |
|------------|--------------------------------------------------------------------------------------------------|
| **Frontend** | 1. User pastes code and submits for review.<br>2. Sends POST request to backend `/ai/get-review`.<br>3. Displays AI-generated review in UI. |
| **Backend**  | 1. Receives code via `/ai/get-review`.<br>2. Validates input.<br>3. Calls AI service.<br>4. Returns review result as JSON. |
| **AI Service** | 1. Uses Google Gemini API.<br>2. Sends code and detailed review instructions.<br>3. Receives and returns structured review. |
| **Deployment** | 1. Both frontend (static) and backend (Node) are deployed on Render.<br>2. Environment variables are managed via Render dashboard. |

---

## 🧩 Features

- **Enterprise-Grade Code Review:**  Uses Google Gemini with advanced, customizable review instructions.
- **Modern UI:**  Fast, responsive, and user-friendly React interface.
- **RESTful API:**  Clean, secure, and scalable Express backend.
- **Easy Deployment:**  One-click deploy on Render for both frontend and backend.
- **Configurable:**  Environment variables for API keys and endpoints.

---

## 📦 Installation & Local Development

### 1. **Clone the Repository**
```bash
git clone https://github.com/swarnabha-dutta/ai-code-reviewer.git
cd ai-code-reviewer
```

### 2. **Backend Setup**
```bash
cd backend
npm install
# Create a .env file with:
# PORT=4000
# GOOGLE_GEMINI_API=your_google_gemini_api_key
npm start
```

### 3. **Frontend Setup**
```bash
cd ../frontend
npm install
# Create a .env file with:
# VITE_BACKEND_URL=http://localhost:4000
npm run dev
```

---

## 🌐 Deployment (Render)

- **Backend:** Deploy as a Node Web Service, set root to `backend`, and add env vars.
- **Frontend:** Deploy as a Static Site, set root to `frontend`, build command `npm install && npm run build`, publish directory `dist`, and set `VITE_BACKEND_URL` to your backend Render URL.

---

## 📚 Example API Usage

**POST** `/ai/get-review`
```json
{
  "code": "function hello() { console.log('Hello, world!'); }"
}
```
**Response:**
```json
{
  "review": "🔴 Critical: ... 🟡 Major: ... 🟢 Minor: ... 💡 Enhancement: ..."
}
```

---

## 🛡️ Security & Best Practices

- All secrets are managed via environment variables.
- CORS is enabled for frontend-backend communication.
- Input validation and error handling are enforced.

---

## 🖼️ Project Structure

```
ai-code-reviewer/
  backend/
    server.js
    package.json
    .env.example
    src/
      app.js
      controllers/
      routes/
      services/
  frontend/
    src/
    public/
    .env.example
    package.json
    vite.config.js
```

---



---

## 📸 Screenshots

> _Add screenshots of your UI here for more engagement!_

---

## 🏷️ License

This project is licensed under the ISC License.


---
