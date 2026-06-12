# ⚡ E-Commerce Microservices

A production-ready, containerized microservices architecture demonstrating full-stack capabilities with multiple backend languages, distinct databases, and caching layers.

## 🏗️ Architecture & Tech Stack

This project consists of 4 distinct backend microservices and a React frontend, orchestrated seamlessly using Docker Compose.

| Service | Technology | Database / Cache | Port |
| :--- | :--- | :--- | :--- |
| **Frontend Dashboard** | React.js | N/A | `3000` |
| **Product Service** | Node.js (Express) | MongoDB + Valkey Cache | `3001` |
| **Order Service** | Node.js (Express) | PostgreSQL | `3002` |
| **Payment Service** | Python (Flask) | PostgreSQL | `3003` |
| **Notification Service**| Python (FastAPI) | None | `3004` |

### ✨ Key Features
* **Polyglot Backend:** Uses both Node.js and Python.
* **Database per Service:** Demonstrates microservices best practices by isolating databases (MongoDB for Inventory, PostgreSQL for Orders/Payments).
* **High-Performance Caching:** Implements **Valkey** (Redis fork) in the Product Service to drastically reduce database load.
* **Modern UI:** Glassmorphism-inspired Dashboard with real-time dynamic inventory valuation.
* **Dockerized:** Fully containerized for one-click setup.

---

## 🚀 How to Run the Application

### Prerequisites
Make sure you have [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed on your machine.

### Installation & Startup

1. Clone the repository:
   ```bash
   git clone https://github.com/Rai-190599/ecommerce-microservices.git
   cd ecommerce-microservices

```

2. Spin up the entire infrastructure using Docker Compose:

```bash
docker-compose up --build

```


*(Note: The first build might take a few minutes as it downloads the database and language images).*
3. Open your browser and navigate to the Command Center:
```text
http://localhost:3000

```



---

## 🗄️ How to Verify Database Records

You can cross-check the data inserted via the UI directly inside the Docker containers:

**1. Verify Orders in PostgreSQL:**

```bash
docker-compose exec postgresdb psql -U admin -d ecommerce -c "SELECT * FROM orders;"

```

**2. Verify Products in MongoDB:**

```bash
docker-compose exec mongodb mongosh ecommerce --eval "db.products.find().pretty()"

```
