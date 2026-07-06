
<h2 align="center">🚀 AI Code Reviewer</h2>


**Production-ready, AI-powered code review system with performance-optimized frontend, scalable backend, and intelligent caching.**

An end-to-end full-stack application that analyzes source code using **Large Language Models (LLMs)** to identify **bugs, anti-patterns, performance bottlenecks, and best-practice violations** — built with a strong emphasis on **real-world performance, scalability, and clean architecture**.

> ⚡ Achieved **~98 Lighthouse Performance score** on production
> ⚡ Reduced backend response latency by **~93% using Redis caching**

---

---

## 🔗 Live Demo

👉 [https://ai-code-reviewer-frontend-feb.onrender.com/](https://ai-code-reviewer-frontend-feb.onrender.com/))

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

## ✅ Test Suites

- App
- CodeEditor
- FileUpload
- NavBar
- ReviewPanel
- ReviewFetcher
- ReviewContainer Integration (Real Hook + MSW)
- SignedInView
- SignedOutView
- SignedInView Integration
- useReview Unit
- useReview Integration (Advanced MSW)
- reviewApi Service
- useTheme Hook

---

# 🧪 Testing

## 📊 Test Status

```text
Test Files : 17 passed (17)
Tests      : 119 passed (119)
```

---

## 📈 Test Coverage

| Metric | Coverage |
|---------|---------:|
| Statements | **80.31%** |
| Branches | **81.63%** |
| Functions | **71.73%** |
| Lines | **83.63%** |

---

# 🧠 Testing Coverage

## ✅ Component Testing

- CodeEditor
- FileUpload
- NavBar
- ReviewPanel
- ReviewFetcher
- ReviewContainer
- SignedInView
- SignedOutView
- App

---

## ✅ React Hook Testing

- useReview (Unit)
- useReview (Real Hook + MSW)
- useTheme

---

## ✅ API & Integration Testing

- reviewApi Service
- ReviewContainer (Real Hook + MSW)
- SignedInView Integration
- Review Fetch Flow

---

## ✅ Advanced MSW Testing

- Request Header Assertions
- Authorization Header Verification
- FormData Assertions
- Multipart FormData Validation
- Request Body Verification
- Query Parameter Assertions
- Delayed Response Simulation
- Network Error Simulation
- Cached Response Testing
- Real API Integration Flow

---

## ✅ HTTP Response Testing

- 200 OK
- 201 Created
- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 429 Too Many Requests

---

## ✅ Advanced Mocking (Vitest)

- vi.spyOn()
- mockResolvedValue()
- mockResolvedValueOnce()
- mockRejectedValueOnce()
- mockImplementationOnce()
- Sequential Mock Responses
- clearAllMocks()
- resetAllMocks()
- restoreAllMocks()
- toHaveBeenNthCalledWith()
- toHaveBeenLastCalledWith()

---

## ✅ Custom Hook Testing

### useTheme

- Default Theme
- localStorage Initialization
- Theme Toggle
- Multiple Toggles
- DOM Synchronization
- localStorage Synchronization
- Persistent Theme State
- Edge Case Testing

---

## ✅ User Experience Testing

- Loading State
- Error Handling
- Cached Response
- User Interaction
- Authentication Mocking (Clerk)
- MSW Network Mocking

---

# 🛠 Testing Stack

- Vitest
- React Testing Library
- @testing-library/user-event
- @testing-library/jest-dom
- Mock Service Worker (MSW)

---

# ▶️ Run Tests

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

- ✅ **119 Automated Tests**
- ✅ **17 Test Files**
- ✅ Component Testing
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

---

# 📸 Test Results

Screenshots

- Test Suite (119 Passing Tests)
- Coverage Report
<br/>
<img width="892" height="917" alt="Screenshot 2026-07-06 190815" src="https://github.com/user-attachments/assets/63ea2299-9e6f-45dd-a7d2-ceb1b419fdc5" />

----
## 🔁 CI/CD Pipeline (Render)
<img width="1055" height="853" alt="image" src="https://github.com/user-attachments/assets/95237460-9123-41be-9ed5-20e185a1326d" />

---

### ⚙️ Automated Deployment Flow (Render)

1. Code pushed to GitHub repository
2. Render automatically detects the new commit
3. Dependencies installed in isolated build environment
4. Application build executed (`npm install`, `npm run build`, etc.)
5. Health checks performed on the new deployment
6. Traffic seamlessly switched to the new version (zero downtime)

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







