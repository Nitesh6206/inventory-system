# 🏗️ Inventory Management System - Full Stack

A full-stack inventory management system for managing products, customers, and orders with real-time stock tracking and automated order processing.  
This system ensures proper stock validation, inventory control, and seamless order management.

---

# 🚀 Features Implemented

## 📦 Product Management
- Create, update, delete products
- Unique SKU-based product identification
- Real-time stock tracking
- Product search by name and SKU

## 👥 Customer Management
- Add and manage customers
- Store customer details (name, email, phone, address)
- Search customers by name or email

## 🛒 Order Management
- Create orders with multiple products
- Automatic total calculation
- Stock validation before order creation
- Stock deduction after order placement
- Order status management (pending → completed)

## 📊 Inventory Control
- Prevent ordering out-of-stock products
- Real-time stock update after orders
- Safe transaction-based order processing

## 🔍 Search & Filter
- Product search by name and SKU
- Customer search by name and email
- Instant filtering in UI

## ⚡ API Integration
- React Query for server state management
- Axios-based API layer
- Optimized frontend-backend communication

---

# 🛠️ Tech Stack

## Frontend
- React (Vite)
- TailwindCSS

## Backend
- FastAPI
- SQLAlchemy (Async ORM)

## Database
- PostgreSQL

## Tools
- React Query
- Axios
- Docker
- Netlify (Frontend)
- Render (Backend)

---

# 📂 Project Architecture

## Flow
- React Frontend
- Axios API Layer
- FastAPI Backend
- SQLAlchemy ORM
- PostgreSQL Database

---

# ⚙️ Setup Guide

# 📌 Step 1: Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/inventory-system.git
cd inventory-system
```

---

# 📌 Step 2: Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate
venv\Scripts\activate
pip install -r requirements.txt
```

## Run Backend
```bash
uvicorn app.main:app --reload
```

Backend runs at:
```
http://localhost:8000
```

---

# 📌 Step 3: Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:
```
http://localhost:5173
```

---

# 📌 Step 4: Environment Variables

## Backend (.env)
```
DATABASE_URL=postgresql+asyncpg://username:password@host:5432/dbname
```

## Frontend (.env)
```
VITE_API_URL=http://localhost:8000/api/v1
```

---

# 🐳 Docker Setup

## Build Images
```bash
docker-compose build
```

## Run Containers
```bash
docker-compose up
```

---

# 📡 API Endpoints

## Products
```
GET    /api/v1/products
POST   /api/v1/products
PUT    /api/v1/products/{id}
DELETE /api/v1/products/{id}
```

## Customers
```
GET    /api/v1/customers
POST   /api/v1/customers
```

## Orders
```
GET    /api/v1/orders
POST   /api/v1/orders
DELETE /api/v1/orders/{id}
```

---

# 🧠 Business Logic

## Stock Management Flow
- Validate stock before order creation
- Deduct stock after order placement
- Prevent negative inventory

## Order Flow
- Create order
- Validate stock
- Add order items
- Calculate total
- Update order status

---

# 🚀 Deployment

## Frontend (Netlify)
- Build command: npm run build
- Publish directory: dist
- Set VITE_API_URL to backend URL

## Backend (Render)
- Docker-based deployment
- Port: 8000
- PostgreSQL connected via Render/Supabase

---

# ❗ Important Notes

## Frontend Issue (Blank Page)
- Check VITE_API_URL
- Ensure backend is deployed

## CORS Issue
- Enable origins in FastAPI

## Database Issue
```python
Base.metadata.create_all(bind=engine)
```

---

# 👨‍💻 Author

## Nitesh Kumar
Full Stack Developer (React + FastAPI + PostgreSQL)