# NEXORA — Modern Intelligent Shopping Platform
> **"Discover More. Shop Smarter."**

NEXORA is a production-grade full-stack e-commerce web platform engineered for futuristic consumer hardware, acoustics, biometric wearables, and autonomous robotics.

---

## ⚡ Quick Demo Credentials

For instant evaluation, you can use the **1-Click Demo Login** buttons inside the Sign In modal or manual entry:

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Demo Customer** | `alex@nexora.store` | `Customer@123` | Full customer account, orders, live tracking timeline, wishlist, points vault |
| **Demo Admin** | `admin@nexora.store` | `Admin@123` | Admin dashboard, revenue analytics, products CRUD, order lifecycle manager, inventory restock, coupon generator, support tickets |

---

## 🚀 Key Features

### 1. Brand & Design System
- Sleek dark mode / light mode toggle with local storage persistence.
- High-contrast, accessibility-focused typography (`Plus Jakarta Sans` and `Space Grotesk`).
- Strictly adheres to zero-pill metadata discipline with subtle typographic separators (`·`).
- Micro-interactions, slide-over cart drawer, and interactive toasts.

### 2. Full-Stack Architecture
- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Framer Motion, Canvas Confetti.
- **Backend**: Node.js & Express.js REST API with authentication and authorization middleware.
- **Database & Persistence**: Embedded file-backed relational data engine with JSON persistence in `data/nexora-db.json`.
- **Database Seeding**: 50+ rich realistic products across 10 categories, 10 brands, sample reviews, orders with timeline tracking, coupons, and notifications.

### 3. Intelligent Standout Capabilities
- **Smart Product Finder**: Interactive 3-step recommendation questionnaire matching category, budget, and priority attributes with computed match percentages.
- **Smart Concierge AI**: Conversational assistant powered by Gemini API (`gemini-3.8-flash`) with automatic fallback to heuristics and inline interactive product chips.
- **Deal Radar**: Real-time algorithmic pricing analysis highlighting products with the steepest discounts.
- **Daily Mystery Deal**: Gamified scratch/unlock daily deal triggering confetti bursts and generating limited-time promotional codes.
- **Shopping Streak**: Rewards returning daily users with multiplier points toward physical hardware vouchers.
- **Product Match Score**: Personalized rating alignment shown directly on product cards.
- **Live Order Tracking Timeline**: Visual 6-stage lifecycle (`Order Placed` → `Confirmed` → `Packed` → `Shipped` → `Out for Delivery` → `Delivered`) with drone flight references.

### 4. Comprehensive E-Commerce Functionality
- **Catalog**: Search by name, brand, category, tags; multi-facet filtering (category, brand, price slider, minimum rating, in-stock only, minimum discount %); dynamic sorting.
- **Product Detail**: Image gallery, variant selection, real-time stock meter, detailed specifications, eco-score badge, verified reviews with star breakdowns, and community Q&A.
- **Shopping Cart & Checkout**: Slide-over drawer with free shipping progress meter, live coupon code validation (`WELCOME10`, `NEXORA20`, `FESTIVE25`, `FIRST50`), 4-step multi-step checkout with address management, velocity courier selection, and sandbox payment.
- **Customer Support**: Interactive FAQ accordion and real-time support ticket chat threads with admin responses.
- **Admin Command Center**: Gross revenue metrics, order velocity, category sales volume charts, product CRUD, inventory restock tools, coupon creator, and support tickets manager.

---

## 🛠️ Tech Stack

- **Client**: React 19, TypeScript, Vite, Tailwind CSS v4, Canvas Confetti
- **Server**: Express.js, TypeScript (`tsx`), Node.js built-in `crypto` for SHA-256 password hashing and HMAC token generation
- **AI**: `@google/genai` TypeScript SDK (`gemini-3.8-flash`)

---

## 📁 Folder Structure

```
├── data/
│   └── nexora-db.json           # Persistent database file
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── AuthModal.tsx        # Authentication modal with 1-click demo buttons
│   │   ├── CartDrawer.tsx       # Slide-over cart with live coupon engine
│   │   ├── CompareModal.tsx     # Side-by-side product comparison table
│   │   ├── Footer.tsx           # Footer with guarantees and newsletter
│   │   ├── Navbar.tsx           # Header with smart search and department menus
│   │   ├── NotificationDrawer.tsx # Notification center
│   │   ├── ProductCard.tsx      # High-fidelity card conforming to design guidelines
│   │   ├── SmartAiAssistantModal.tsx # AI Concierge shopping advisor
│   │   ├── SmartProductFinderModal.tsx # 3-step match quiz
│   │   └── SurpriseDealModal.tsx # Gamified mystery deal with confetti
│   ├── context/                 # Application contexts (Auth, Cart, Wishlist, Compare, etc.)
│   ├── data/
│   │   └── seedData.ts          # 50 products, 10 categories, 10 brands, demo users, coupons
│   ├── pages/                   # Main views (Home, Shop, ProductDetail, Checkout, Profile, Support, Admin)
│   ├── server/
│   │   ├── db.ts                # Database engine and model operations
│   │   └── routes.ts            # Express REST API routes
│   ├── types/
│   │   └── index.ts             # TypeScript definitions
│   ├── App.tsx                  # Main router and view orchestration
│   ├── index.css                # Tailwind CSS imports and custom typography
│   └── main.tsx                 # React DOM mount point
├── server.ts                    # Express entry point with Vite middleware
├── package.json
└── tsconfig.json
```

---

## 🔌 REST API Endpoints

- `POST /api/auth/register` - Create new user account (+100 welcome points)
- `POST /api/auth/login` - Authenticate user and retrieve session token
- `GET /api/auth/me` - Retrieve authenticated user profile
- `POST /api/auth/claim-streak` - Claim daily login streak points
- `GET /api/products` - Filterable and searchable product catalog
- `GET /api/products/:id` - Product details, specifications, and related items
- `GET /api/products/:id/reviews` - Product reviews
- `POST /api/products/:id/reviews` - Submit verified product review
- `POST /api/coupons/validate` - Validate coupon code and compute discount
- `GET /api/orders` - Retrieve authenticated user's orders
- `POST /api/orders` - Place and authorize new order
- `POST /api/orders/:id/cancel` - Cancel order and process refund
- `GET /api/wishlist` - User's saved hardware
- `POST /api/wishlist/toggle` - Add or remove product from wishlist
- `POST /api/ai/finder` - Compute product matches from preference questionnaire
- `POST /api/ai/assistant` - Gemini AI concierge shopping advisor
- `GET /api/ai/surprise-deal` - Generate daily mystery discount
- `GET /api/admin/analytics` - Admin gross revenue and sales metrics
- `POST /api/admin/products` - Publish new product to catalog
- `PUT /api/admin/products/:id` - Update existing product or restock inventory
- `DELETE /api/admin/products/:id` - Remove product from catalog
- `PUT /api/admin/orders/:id/status` - Update order lifecycle status
- `POST /api/admin/coupons` - Generate new coupon voucher

---

## 💻 Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server (runs full-stack Express + Vite):
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` in your browser.
