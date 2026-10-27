 # 🛒 ShopSphere                      
                                  
<p align="center">
  <img src="https://img.shields.io/badge/MERN-Stack-blue.svg" alt="MERN Stack">
  <img src="https://img.shields.io/badge/React-18-cyan.svg" alt="React">
  <img src="https://img.shields.io/badge/Tailwind-CSS-38bdf8.svg" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/AI-Stylist-purple.svg" alt="AI Stylist">
  <img src="https://img.shields.io/badge/Status-Completed-success.svg" alt="Status">             
</p>
   
<p align="center">
  <h3>A Premium, Full-Featured MERN Stack E-Commerce & AI Fashion Wardrobe Platform</h3>
  Modern • Secure • Scalable • Responsive • AI-Enabled
</p>

---
        
## 📌 About          

**ShopSphere** is a state-of-the-art MERN Stack E-Commerce Platform developed as a Major Project. It merges traditional retail with modern AI-driven fashion styling tools.

The project delivers a complete dapper online shopping experience. It includes secure JWT-based multi-role authentication, product catalog filters, shopping carts, wishlists, expected delivery estimators, return/exchange management, invoices, and a Recharts-powered admin dashboard.

---

# ✨ Core Features

### 👗 AI Outfit Stylist (Fashion)
*   **Custom Shirt Configurator**: Select presets (Linen, Oxford, Denim) or upload your own shirts.
*   **Gemini AI Recommendations**: Dynamically recommends color-matched jeans, shoes, watches, and sunglasses combos.
*   **Local Styling Fallbacks**: Integrated local expert stylist matching index for instant offline recommendations.
*   **Single-Click Cart Adds**: Add recommended accessory items directly to the shopping cart.

### 👤 User Module
*   **Role Management Dashboard**: Toggle accounts between `User`, `Seller`, `Manager`, `Admin`, and `Delivery Partner`.
*   **Animated Visual Interfaces**: Keyframe-controlled floating blobs background overlays, text gradients, and interactive glassmorphic cards.
*   **Profile & Address Book**: Detailed settings page with editable billing details.

### 🛍 Product Module
*   **Database Product Images**: Real brand-appropriate high-resolution Unsplash product visual mappings for 500 catalog items (laptops, phones, clothing, accessories).
*   **Filters & Search**: Fast multi-faceted filters, category queries, price caps, and sorting options.
*   **🎙️ Voice Search Integration**: HTML Speech Recognition microphone input inside the header search bar.

### 🏷 Advanced Coupon Engine
*   **Percentage & Flat Discounts**: Dynamic value deductions on order totals.
*   **Buy One Get One (BOGO)**: Auto-calculates a free unit of the highest eligible item for qualifying cart sets.
*   **Admin Management Grid**: Panel to review active promo codes, set minimum purchase caps, and create new campaigns.

### 💳 Shopping & Checkout
*   **Frosted Glassmorphic Header**: Interactive header cover with auto-changing retail backgrounds on refresh.
*   **Left Sidebar Drawer**: Hamburger-toggled navigation slider for Home, Products, Modes, Cart, and My Orders.
*   **Order Delivery Estimator**: Deterministic unique expected delivery times calculated within a 5-day window.

### 📦 Orders & Returns System
*   **Return, Exchange, & Cancellation**: Post-delivery options including custom reasons and mock product photo upload verification.
*   **GST Invoice generation**: Client-side PDF tax invoice generation and download utilizing jsPDF.
*   **Visual Track Panel**: Real-time checkpoints progress tracker based on order shipping state.

### 👨‍💼 Admin & Seller Dashboards
*   **Recharts Analytics**: 6 distinct charts (Area, Bar, Line, Pie) detailing total sales, product categories, and monthly order counts.
*   **Multi-Vendor Marketplace**: Dedicated dashboards for Sellers to manage product catalogs and track store statistics.

---

# 🛠 Tech Stack

### Frontend
*   **React** (v18)
*   **Redux Toolkit** (State Management)
*   **Tailwind CSS** & **Vanilla CSS**
*   **jsPDF** (Invoice Generation)
*   **Recharts** (Interactive Analytics)
*   **Axios** (Request Interceptors for Auth Headers)

### Backend & Database
*   **Node.js** & **Express.js** (Server Logic)
*   **MongoDB Atlas** (Database)
*   **Mongoose** (Schema Modeling)
*   **Gemini 1.5 Flash API** (AI Styling Content Generation)

---

# 📂 Project Structure

```
shopsphere-ecommerce/
├── client/          # Frontend React Application
│   ├── public/      # Static Assets & Images
│   └── src/         # Source code (Pages, Components, Redux)
├── server/          # Backend Express Server
│   ├── config/      # DB Connections
│   ├── controllers/ # Business Logic & AI Engines
│   ├── data/        # Seed datasets
│   ├── models/      # Mongoose Schemas (User, Product, Order, Coupon)
│   ├── routes/      # REST API Endpoints
│   └── scripts/     # Database Migration & Testing tools
```

---

# 🚀 Quick Installation

### 1. Clone & Env Setup
```bash
git clone https://github.com/piyushdubey26/shopsphere-ecommerce.git
cd shopsphere-ecommerce
```
Create a `.env` in `server/`:
```env
PORT=5001
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

### 2. Run Database Seeding & Migration
```bash
cd server
npm install
node seeder.js
node scripts/updateProductImages.js
```

### 3. Launch Development Servers
*   **Backend Server**:
    ```bash
    cd server
    npm run dev
    ```
*   **Frontend Client**:
    ```bash
    cd client
    npm install
    npm run dev
    ```

---

# 📅 Project Status

**✅ Completed / Active Release**

---

# 👨‍💻 Team

| Name | Role |
|------|------|
| **Piyush Dubey** | Team Leader / Full Stack Developer |
| **Sakshi Kumari** | Backend Developer |
| **Jaya Maurya** | Frontend Developer |
| **Shubham Singh** | Database & API Developer |
| **Priya Goswami** | Testing & Documentation |

---

## ⭐ Star the repository if you love this project!
