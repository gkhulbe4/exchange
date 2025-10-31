# ZenithX - Trading Platform 📈

A real-time, high-performance trading platform built with a modular architecture, designed for instant order placement, matching, and tracking. Scalable, fast, and reliable.

---

## 🌟 Features

### Real-time Order Matching
- Engine module handles all buy/sell order matching and trading logic.

### Modular Architecture
Clear separation of responsibilities across modules:
- `api` – Handles client API requests  
- `engine` – Executes matching logic and trading rules  
- `db` – Database interactions using TimescaleDB  
- `mm` – Market-making and pricing logic  
- `ws` – WebSocket server for real-time updates  
- `web` – Frontend user interface  

### Scalable Communication
- Modules communicate using **Redis Pub/Sub**, queues, and workers, ensuring high throughput and reliability.

### Time-Series Data Handling
- Stores historical trades, price changes, and order book snapshots efficiently in **TimescaleDB**.

### Real-time Notifications
- Users receive instant updates for orders, trades, and market data.

---

## Demo Video

https://www.linkedin.com/posts/garvit-khulbe-60b671245_webdevelopment-fullstack-realtimetrading-activity-7377290754148196353-z-UM?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAADzJ2SsBEAPCw6krgQ3VzdT0AeD-T8fDCVE

---

## 🏗 Architecture

![ZenithX Architecture](https://github.com/user-attachments/assets/20610098-2573-44eb-bc90-b7eab488dc12)

- **Redis Pub/Sub:** Event-driven messaging between modules  
- **Workers & Queues:** Background task processing  
- **Engine Module:** Central matching logic interacting with DB & market-making  
- **WebSocket (`ws`) Module:** Pushes real-time data to frontend  
- **TimescaleDB:** Optimized for time-series trade and market data  

---

## 💻 Tech Stack

- **Frontend:** React, TypeScript  
- **Backend:** Node.js, TypeScript  
- **Database:** TimescaleDB (PostgreSQL)  
- **Messaging & Queue:** Redis Pub/Sub  
- **Real-time Communication:** WebSocket  
- **Background Processing:** Redis workers  

---
