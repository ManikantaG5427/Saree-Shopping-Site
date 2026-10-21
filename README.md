# Sri Lakshmi Saree House (SLSH) - Full-Stack MERN E-Commerce Platform

A royal Indian heritage saree boutique and e-commerce web platform built on the canonical **MERN** stack (**M**ongoDB, **E**xpress, **R**eact, **N**ode.js) in pure modern JavaScript.

---

## Architecture & Codebase Structure

The project is cleanly separated into two primary folder modules: `client/` (React frontend) and `server/` (Express + MongoDB backend):

```
Saree_Web/
├── client/                     # Frontend Application Module (React 19 + Vite)
│   ├── public/                 # Static assets & 20 high-res curated saree images
│   ├── src/
│   │   ├── api/                # API client & services (products, auth, cart, orders)
│   │   ├── components/         # Reusable UI & layout (Header, Footer, Modals)
│   │   ├── contexts/           # State contexts (Cart, Auth, Location, Wishlist, Order)
│   │   ├── data/               # mockData.js catalog data with 20 luxury sarees
│   │   ├── pages/              # Home, Products, ProductDetail, Cart, Checkout, etc.
│   │   ├── styles/             # tokens.css design system
│   │   ├── App.jsx & main.jsx
│   │   └── index.css
│   ├── Dockerfile              # Multi-stage production Nginx container
│   ├── nginx.conf              # Production Nginx SPA routing & caching
│   ├── package.json            # Frontend Vite dependencies
│   ├── tailwind.config.js      # Responsive Tailwind configuration
│   └── vite.config.js          # Vite configuration
│
├── server/                     # Backend Application Module (Node.js + Express + MongoDB)
│   ├── src/
│   │   ├── config/             # Database connection, Cloudinary, Razorpay settings
│   │   ├── controllers/        # Product, Auth, Order, Category, Cart, Review controllers
│   │   ├── middleware/         # Auth verification, rate limiting, error handling, upload
│   │   ├── models/             # Mongoose Schemas (Product, User, Order, Category, etc.)
│   │   ├── routes/             # Express API routes (/api/products, /api/auth, etc.)
│   │   ├── services/           # Razorpay, Nodemailer email, Cloudinary media
│   │   ├── utils/              # AsyncHandler, AppError, JWT, Response helpers
│   │   └── index.js            # Express application entry point
│   ├── Dockerfile              # Node.js 20 production container
│   ├── package.json            # Node.js ES Modules configuration
│   └── .env.example            # Backend environment variables
│
├── docker-compose.yml          # Full-stack orchestration (MongoDB 7.0 + Server + Client)
├── vercel.json                 # Vercel deployment & SPA routing configuration
├── package.json                # Root workspace orchestrator
└── README.md
```

---

## Development & Local Execution

### 1. Run the Frontend (Client)
From the root directory:
```bash
npm run dev
# Or
npm run dev:client
```
The React frontend starts on **http://localhost:5173/**.

### 2. Run the Backend API (Server)
From the root directory:
```bash
npm run dev:server
```
The Express server starts on **http://localhost:5000/** with health check at `http://localhost:5000/health`.

### 3. Build for Production
```bash
npm run build
```
Compiles the production React bundle into `client/dist/` in under 1 second.

---

## Deployment Guides

### Option A: Vercel (Recommended for Frontend)
1. Import **`ManikantaG5427/Saree-Shopping-Site`** in your Vercel Dashboard.
2. In project settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (or `client`)
   - **Build Command**: `npm run build`
   - **Output Directory**: `client/dist` (or `dist` if Root Directory is set to `client`)
3. The included `vercel.json` automatically configures SPA rewrites for `/products`, `/cart`, etc.

### Option B: Docker Compose (Full Stack with MongoDB)
```bash
docker compose up -d --build
```
- Frontend: Accessible on port `5173` (mapped to Nginx port 80)
- Backend: Accessible on port `5000`
- MongoDB: Persistent volume on `mongodb_data`

---

## Key Features & Benchmark Integrations

1. **Zero Horizontal Overflow**: Guaranteed fluid alignment on all devices from 320px mobile screens to 4K displays.
2. **Responsive Mobile Navbar**: Prominent Sign In button, interactive search drawer, real-time pincode estimator, and full-screen mobile slide drawer.
3. **Smooth Transitions**: Refined boutique animations with subtle elevation lift and micro-zoom effects.
4. **Silk Mark India Guarantee**: Tamper-proof verification seals on pure handloom weaves.
5. **1-on-1 Video Drape**: Direct WhatsApp video consultation booking for inspecting weaves under natural daylight.