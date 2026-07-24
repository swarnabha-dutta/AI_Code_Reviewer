
<h2 align="center">🚀 AI Code Reviewer</h2>


**Production-ready, AI-powered code review system with performance-optimized frontend, scalable backend, and intelligent caching.**

An end-to-end full-stack application that analyzes source code using **Large Language Models (LLMs)** to identify **bugs, anti-patterns, performance bottlenecks, and best-practice violations** — built with a strong emphasis on **real-world performance, scalability, and clean architecture**.

> ⚡ Achieved **~98 Lighthouse Performance score** on production
> ⚡ Reduced backend response latency by **~93% using Redis caching**

---

---

## 🔗 Live Demo

👉 [https://ai-code-reviewer-frontend-feb.onrender.com](https://ai-code-reviewer-frontend-feb.onrender.com))

## 📂 Repository

👉 [https://github.com/swarnabha-dutta/AI_Code_Reviewer](https://github.com/swarnabha-dutta/AI_Code_Reviewer)

---

## 🔥 Key Highlights 

* **LLM-powered automated code review** using Google Gemini
* Identifies **syntax errors, anti-patterns, performance issues, and optimizations**
* **Redis-backed intelligent caching** → ~93% faster repeated API responses
* Secure REST APIs with **authentication & per-user rate limiting**
* **Performance-optimized React frontend** with near-zero blocking time
* Fully deployed with **CI/CD-driven production workflow**

---

## 🧠 System Architecture (High-Level)

* **Frontend (React + Tailwind)**
  Optimized rendering, asset loading, and Lighthouse performance

* **Backend (Node.js + Express)**
  Validated APIs, centralized error handling, authentication & rate limiting

* **Caching Layer (Redis)**
  Prevents redundant LLM calls and drastically reduces response time

* **AI Layer (Google Gemini API)**
  Handles contextual code analysis and structured review output

* **Deployment & CI/CD (Vercel + Render)**
  Automated builds, previews, and zero-downtime production deployments


-----
## 🛠 Tech Stack

### Frontend

* React.js
* Tailwind CSS

### Backend

* Node.js
* Express.js
* REST APIs
* Redis (Caching)

### AI

* Google Gemini API

### Deployment

* Frontend: Render
* Backend: Render

---

## 🔄 Database Schema 

The diagram below represents the **internal working flow** of the AI Code Reviewer — from user request to AI-powered analysis and optimized response delivery.

<img 
  src="./diagrams/diagram-export-26-5-2026-11_48_43-am.png" 
  alt="AI Code Reviewer Internal Schema Design"
  width="900"
/>
---
## ⚡ Frontend Performance Metrics

<table>
<tr>
<th>Initial (Baseline)</th>
<th>After Optimization</th>
</tr>

<tr>
<td align="center">
<img src="./diagrams/Initial_File_SS.png" alt="Initial Lighthouse Report" width="420">
</td>

<td align="center">
<img src="https://github.com/user-attachments/assets/82a12aea-cb45-48bc-877d-6d78698ada1f" alt="Optimized Lighthouse Report" width="420">
</td>
</tr>

<tr>
<td>

**Score:** 82

**FCP:** ~1.5s

**LCP:** ~2.0s

**TBT:** ~0ms

**Speed Index:** ~2.1s

</td>

<td>

**Score:** ~98

**FCP:** ~0.6s

**LCP:** ~1.0s

**TBT:** 0ms

**Speed Index:** ~0.9s

</td>
</tr>
</table>                                     

### Key Improvements

* Major reduction in **FCP** and **LCP**
* **Total Blocking Time reduced to 0 ms**
* Faster Speed Index via optimized rendering & asset loading
* No UX regressions during optimization

---

## ⚡ Backend Performance Optimization

* ~93% reduction in API response time using Redis caching (9.01s → 493ms)
* Initial uncached latency: 9.01s
* Cached response latency: 493ms
* **82.4% reduction in redundant Gemini API calls** via Redis cache hit detection
* **82.4% reduction in MongoDB queries** for repeated code submissions
* Verified across **14 live requests** — 14 cache hits, 3 misses (**82.4% cache hit rate**)

### 📊 Cache Performance Stats (Live Verification)

| Metric | Value |
|---|---|
| Total Requests | 17 |
| Cache Hits | 14 |
| Cache Misses | 3 |
| Cache Hit Rate | 82.4% |
| Gemini API Call Reduction | 82.4% |
| MongoDB Query Reduction | 82.4% |

### 📊 Cost Optimistaion and Database Loading Reduction Calculation Stats
<img width="1642" height="1017" alt="image" src="https://github.com/user-attachments/assets/c2633860-10b5-480c-8cc9-f5db65e242f2" />


### API Response — Without Cache

<img width="1712" height="1207" alt="image" src="https://github.com/user-attachments/assets/11211399-77c1-42d1-a966-c71c2ca5da35" />


### API Response — With Redis Cache

<img width="1718" height="1128" alt="image" src="https://github.com/user-attachments/assets/9ba844e9-9d79-49c6-aeed-9311837a6d7b" />

---

## 📊 Frontend Performance Benchmarks (Averaged)

Measured using **Chrome Lighthouse** with simulated throttling.

* Tested across **5 independent runs**
* **Average Performance Score:** ~89
* **Avg FCP:** ~1.1s
* **Avg LCP:** ~1.6s
* **TBT:** 0 ms
* **CLS:** 0

> Metrics may vary slightly due to Lighthouse simulation.
> Remaining accessibility and bundle-size suggestions are tracked improvements.

---
----
# 🧪 Testing Progress

Built with **Vitest**, **React Testing Library**, and **MSW**.

# 🧪 Testing

## 📊 Test Status

```text
Test Files : 17 passed (17)
Tests      : 137 passed (137)
```

## 📈 Test Coverage

| Metric | Coverage |
|---------|---------:|
| Statements | **81.10%** |
| Branches | **81.63%** |
| Functions | **73.91%** |
| Lines | **84.54%** |

---

## ✅ Test Suites

- App
- CodeEditor
- FileUpload
- NavBar
- ReviewPanel
- ReviewFetcher
- ReviewContainer (Integration)
- SignedInView
- SignedOutView
- SignedInView Integration
- useReview (Unit)
- useReview (Integration + MSW)
- reviewApi Service
- useTheme Hook

---

## ✅ Testing Highlights

- Component Testing
- Integration Testing
- React Hook Testing
- API Service Testing
- MSW (Mock Service Worker)
- Accessibility Testing (jest-axe)
- Advanced Async Testing
- Advanced Mocking (Vitest)
- Authentication Mocking (Clerk)
- HTTP Response Testing (200, 201, 400, 401, 403, 404, 429)
- Request Header & FormData Assertions
- Network Error & Delayed Response Testing
- Loading, Retry & Error Recovery Testing

---

## 🛠 Tech Stack

- Vitest
- React Testing Library
- user-event
- jest-dom
- MSW
- jest-axe
- axe-core

---

## ▶️ Run Tests

```bash
npm test
```

### Watch Mode

```bash
npm run test:watch
```
### Coverage

```bash
npm run test:coverage
```

---

# 📈 Current Progress

- ✅ **130 Automated Tests**
- ✅ **17 Test Files**
- ✅ Component Testing
- ✅ Accessibility Testing
- ✅ Unit Testing
- ✅ Hook Testing
- ✅ Integration Testing
- ✅ API Testing
- ✅ MSW Testing
- ✅ Advanced Request Assertions
- ✅ HTTP Response Testing
- ✅ Advanced Mocking
- ✅ Production Edge Case Testing
- ✅ Custom Hook Testing
- ✅ WCAG Accessibility Validation
- ✅ Automated Accessibility Audits

---
# 📸 Test Results

Screenshots

- Test Suite (119 Passing Tests)
- Coverage Report
<br/>
<img width="1361" height="1132" alt="image" src="https://github.com/user-attachments/assets/c2d60004-7aba-4981-bf24-76c337bf1e50" />

----
## 🔁 CI/CD Pipeline (Render)
<img width="1055" height="853" alt="image" src="https://github.com/user-attachments/assets/95237460-9123-41be-9ed5-20e185a1326d" />

---


### ⚙️ Deployment Workflow

1. Developer pushes code to GitHub
2. Render automatically detects the latest commit
3. Dependencies are installed in an isolated build environment
4. Production build is generated
5. Environment variables are securely injected
6. Health checks are performed
7. The latest version is deployed automatically with zero manual intervention

---

### ✅ Deployment Features

- 🚀 Automatic deployment from GitHub
- 🔄 Consistent cloud build environment
- 🔐 Secure environment variable management
- ⚡ Production-ready hosting on Render
- 📦 Isolated build and deployment pipeline
- 🌍 Live application available after successful deployment

---

### 🏗 Deployment Stack

| Service | Platform |
|---------|----------|
| Frontend | Render |
| Backend | Render |
| Source Control | GitHub |
| Build System | Render Build Pipeline |
| Environment Variables | Render Secrets |
| Continuous Deployment | Automatic GitHub Deploy Hooks |

---

### 📌 Deployment Flow

```text
Developer
    │
    ▼
GitHub Repository
    │
    ▼
Render Auto Deploy
    │
    ▼
Install Dependencies
    │
    ▼
Production Build
    │
    ▼
Health Checks
    │
    ▼
Live Production Application
```

---

### ✅ Benefits

* 🚀 Zero-downtime deployments
* 🔄 Automatic deploy on every push
* 🧪 Isolated & consistent build environment
* 🔐 Secure environment variable management
* 🛠️ No manual CI/CD configuration needed

---

## ▶️ Run Locally

### Prerequisites

* Node.js (v18+)
* Redis (local or cloud)
* Google Gemini API key

### Clone

```bash
git clone https://github.com/swarnabha-dutta/AI_Code_Reviewer.git
cd AI_Code_Reviewer
```

### Backend

```bash
cd backend
npm install
npm run dev
```

`.env`

```env
PORT=5000
REDIS_URL=your_redis_url
GEMINI_API_KEY=your_api_key
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```
----

## 🧠 Key Learnings

* Prompt engineering for LLMs
* Redis-based backend caching
* Designing scalable AI-driven APIs
* Frontend performance optimization
* CI/CD-driven production deployment

---

## 👤 Author

**Swarnabha Dutta**
Full-Stack Developer | MERN | AI Systems







