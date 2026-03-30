# 🌱 Eco Spark Hub - Backend API

A full-featured backend API for an idea-sharing platform where users can submit eco-friendly ideas, vote, comment, and access premium content.

---

## 🚀 Live Features

* 🔐 Authentication & Authorization (JWT + Role based)
* 💡 Idea Management (CRUD + Status workflow)
* 🛡️ Admin Moderation (Approve / Reject ideas)
* 📂 Category Management
* 👍 Voting System (Upvote / Downvote)
* 💰 Paid Idea Access System
* 💬 Comment System (Nested replies)
* 🔍 Search & Filter + Pagination
* ⚠️ Global Error Handling

---

## 🛠️ Tech Stack

* Node.js
* Express.js
* TypeScript
* PostgreSQL
* Prisma ORM
* JWT (Authentication)
* Zod (Validation)

---

## 📁 Project Structure

```
src/
 ┣ modules/
 ┃ ┣ auth/
 ┃ ┣ user/
 ┃ ┣ idea/
 ┃ ┣ category/
 ┃ ┣ vote/
 ┃ ┣ payment/
 ┃ ┗ comment/
 ┣ middlewares/
 ┣ utils/
 ┣ helpers/
 ┣ errors/
 ┗ routes/
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository

```
git clone https://github.com/your-username/eco-spark-hub.git
cd eco-spark-hub
```

### 2️⃣ Install dependencies

```
npm install
```

### 3️⃣ Setup environment variables

Create a `.env` file:

```
PORT=5000
DATABASE_URL=your_postgresql_url
JWT_SECRET=your_secret_key
```

### 4️⃣ Run Prisma

```
npx prisma migrate dev
npx prisma generate
```

### 5️⃣ Run server

```
npm run dev
```

---

## 🔐 Authentication

### Register

```
POST /api/auth/register
```

### Login

```
POST /api/auth/login
```

---

## 💡 Idea API

* `POST /api/ideas` → Create idea
* `GET /api/ideas` → Get all ideas (search, filter, pagination)
* `GET /api/ideas/:id` → Get single idea
* `PUT /api/ideas/:id` → Update idea
* `DELETE /api/ideas/:id` → Delete idea

---

## 🛡️ Admin Moderation

* `PATCH /api/ideas/approve/:id`
* `PATCH /api/ideas/reject/:id`

---

## 📂 Category API

* `POST /api/categories` (Admin)
* `GET /api/categories`

---

## 👍 Voting API

* `POST /api/votes/:ideaId` → Vote
* `GET /api/votes/:ideaId` → Vote count

---

## 💰 Payment API

* `POST /api/payments/purchase`
* `GET /api/payments/access/:ideaId`

---

## 💬 Comment API

* `POST /api/comments`
* `GET /api/comments/:ideaId`
* `DELETE /api/comments/:id`

---

## 🔍 Search & Filter

```
GET /api/ideas?search=eco
GET /api/ideas?categoryId=xxx
GET /api/ideas?status=APPROVED
GET /api/ideas?page=1&limit=10
```

---

## 🔐 Authorization

Protected routes require:

```
Authorization: Bearer TOKEN
```

---

## 🧠 Idea Status Flow

```
DRAFT → UNDER_REVIEW → APPROVED → REJECTED
```

---

## 💡 Paid Idea Logic

* Free ideas → Accessible to all users
* Paid ideas → Require purchase
* Access controlled via Payment system

---

## 📌 Future Improvements

* Real payment gateway integration
* Email notifications
* Bookmark/favorite ideas
* Advanced analytics dashboard

---

## 👨‍💻 Author

**Md Kamruzzaman**

---

## 📄 License

This project is for educational purposes.
