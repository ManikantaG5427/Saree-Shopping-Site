# Sri Lakshmi Saree House (SLSH) - Full-Stack MERN E-Commerce Platform

A royal Indian heritage saree boutique and e-commerce web platform built on the canonical **MERN** stack (**M**ongoDB, **E**xpress, **R**eact, **N**ode.js) in pure modern JavaScript.

---

## Architecture & Codebase Structure

```
Saree_Web/
├── src/                        # React 19 Frontend (Vite + Vanilla/Tailwind CSS)
│   ├── api/                    # MERN API Service Layer (client.js, productService.js, authService.js, etc.)
│   ├── components/             # Reusable UI & luxury boutique layout components
│   │   ├── layout/             # Header (luxury boutique navbar, mega menu), Footer
│   │   ├── product/            # ProductCard, filters
│   │   └── ui/                 # Modals, buttons, inputs, cards, badges
│   ├── contexts/               # AuthContext, ProductContext, CartContext, LocationContext, WishlistContext, OrderContext
│   ├── data/                   # mockData.js (catalog data & offline fallback)
│   ├── pages/                  # Home, Products, ProductDetail, Cart, Checkout, Auth, Profile, Orders, Wishlist, Admin
│   ├── index.css               # Global typography (Cormorant Garamond, Plus Jakarta Sans) & tokens
│   ├── App.jsx                 # Client router & application shell
│   └── main.jsx                # React 18+ application entry point
├── server/                     # Node.js + Express + MongoDB (Mongoose) Backend API
│   ├── src/
│   │   ├── config/             # Database connection, Cloudinary, Razorpay settings
│   │   ├── controllers/        # Product, Auth, Order, Category, Cart, Review, Banner, Coupon, Setting controllers
│   │   ├── middleware/         # Auth verification, rate limiting, error handling, upload
│   │   ├── models/             # Mongoose Schemas (Product, User, Order, Category, Subcategory, etc.)
│   │   ├── routes/             # Express API routes (/api/products, /api/auth, /api/orders, /api/cart, etc.)
│   │   ├── services/           # Razorpay, Nodemailer email, Cloudinary media
│   │   ├── utils/              # AsyncHandler, AppError, JWT, Response helpers
│   │   └── index.js            # Server entry point
│   ├── package.json            # Node.js ES Modules configuration
│   └── .env                    # MongoDB URI, JWT secrets, Razorpay credentials
├── Dockerfile                  # Production Nginx frontend container
├── docker-compose.yml          # Full-stack deployment with MongoDB 7.0, Express Server, and Nginx Client
├── nginx.conf                  # Nginx production configuration with SPA routing and API proxy
├── package.json                # Root package configuration
└── README.md
```

---

## Development & Local Execution

### 1. Run the Frontend (Client)
```bash
npm run dev
```
The React frontend starts on **http://localhost:5173/**.

### 2. Run the Backend API (Server)
```bash
npm run server
# Or
npm run dev:server
```
The Express server starts on **http://localhost:5000/** with health check at `http://localhost:5000/health`.

### 3. Run Both Concurrently
```bash
npm run dev:client   # Terminal 1
npm run dev:server   # Terminal 2
```

---

## Production Deployment

### Option A: Docker Compose (Full Stack with MongoDB)
The project includes a production-ready `docker-compose.yml` that orchestrates MongoDB, the Express backend, and the Nginx-served React frontend:

```bash
docker compose up -d --build
```
- Frontend: Accessible on port `80` (or mapped port `5173`)
- Backend: Accessible on port `5000`
- MongoDB: Persistent volume on `mongodb_data`

### Option B: Cloud Hosting (Vercel / Netlify / Render / Railway)
- **Frontend**: Deploy `src/` via Vite build (`npm run build`). Output directory: `dist/`.
- **Backend**: Deploy `server/` on Node.js runtime (`npm start`). Set environment variables matching `server/.env.example`.

---

## Verified Industry Benchmarks & Features

1. **Silk Mark Organisation of India (SMOI) Guarantee**:
   Authentic Silk Mark tags, pure silk certification, and tamper-proof verification on every pure silk weave (inspired by Nalli & Tilfi).

2. **1-on-1 WhatsApp Video Drape Inspection**:
   Direct showroom drape inspection modal to verify pleats, pallu, and natural daylight zari luster before ordering (inspired by Kankatala & Saree.com).

3. **Atelier Customization & Blouse Tailoring**:
   Complimentary Fall & Pico with knotted tassels, custom Maggam/Aari embroidery blouse stitching, and royal wedding keepsake box packaging.

4. **Live Indian Pincode Delivery Estimator**:
   Real-time Indian postal code delivery calculation, Cash-on-Delivery verification, and express shipping indicator.

5. **7-Day Transparent Buyer Inspection Assurance**:
   Zero ambiguous return clauses; doorstep reverse pickup and quality exchange guarantee.