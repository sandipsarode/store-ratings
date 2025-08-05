# Store Ratings System

A Full Stack Web Application where:

* **Admin** can manage stores & users.
* **Store Owners** can view ratings for their stores.
* **Users** can rate stores, update ratings, and view other ratings.

## Tech Stack

| Frontend        | Backend              | Database   |
| --------------- | -------------------- | ---------- |
| React.js (Vite) | Node.js + Express.js | PostgreSQL |
| Tailwind CSS    | JWT Authentication   | pg Pooling |

## Features

### Authentication

* Login / Signup with Role (Admin, Store Owner, User)
* JWT-based protected routes
* Role-based dashboard redirection

### Admin Dashboard

* View Total Users, Stores, and Ratings
* Add New Users (with role assignment)
* Add New Stores & assign to Owners
* Filter User & Store Listings

### Store Owner Dashboard

* View Users who rated their store
* See Average Rating of their store
* Update Password

### User Dashboard

* View All Stores
* Submit Ratings (1 to 5 stars)
* Update Existing Ratings
* Search Stores by Name & Address
* Update Password

## Folder Structure

### Frontend

```
src/
├── assets/
├── components/
│   ├── auth/
│   │   └── LoginForm.jsx, SignupForm.jsx
│   ├── Header.jsx, Footer.jsx
├── context/
│   └── AuthContext.jsx
├── pages/
│   ├── Admin/ (Dashboard.jsx, AddUser.jsx, AddStore.jsx)
│   ├── StoreOwner/ (Dashboard.jsx, RatingsReceived.jsx)
│   ├── User/ (StoreList.jsx, UpdatePassword.jsx)
│   └── Auth/ (Login.jsx, Signup.jsx)
├── routes/ (PrivateRoute.jsx)
├── api/ (api.js)
└── App.jsx, main.jsx
```

### Backend

```
src/
├── controllers/ (auth.controller.js, admin.controller.js, ratings.controller.js)
├── db/ (db.js)
├── middlewares/ (auth.middleware.js)
├── routes/ (auth.routes.js, admin.routes.js, ratings.routes.js, user.routes.js)
└── App.js, server.js
```

## Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/yourusername/store-ratings.git
cd store-ratings
```

### 2. Setup Backend

```bash
cd backend
npm install
# Configure .env file for DB connection and JWT_SECRET
npm start
```

### 3. Setup Frontend

```bash
cd ../frontend
npm install
npm run dev
```

## Environment Variables

### Backend (.env)

```
DATABASE_URL=postgresql://user:password@localhost:5432/storeratings
JWT_SECRET=your_super_secret_key
PORT=5000
```

## API Endpoints (Core)

| Endpoint                  | Method | Role       | Description                   |
| ------------------------- | ------ | ---------- | ----------------------------- |
| /api/auth/login           | POST   | Public     | Login with email & password   |
| /api/auth/signup          | POST   | Public     | Signup as user/storeowner     |
| /api/admin/add-store      | POST   | Admin      | Add new store                 |
| /api/admin/add-user       | POST   | Admin      | Add new user                  |
| /api/user/update-password | PATCH  | User       | User Password Update          |
| /api/stores               | GET    | All Roles  | Get list of all stores        |
| /api/user/ratings         | POST   | User       | Add Rating                    |
| /api/user/ratings         | PATCH  | User       | Update Rating                 |
| /api/user/ratings/my      | GET    | User       | View My Ratings               |
| /api/ratings/\:store\_id  | GET    | Owner/User | Get Ratings of Specific Store |

## Author

**Sandip Sarode**

## Contributions

Feel free to fork, raise issues, and contribute to this project. PRs are welcome!

## License

This project is licensed under the MIT License.

## Notes

* Ensure proxy is set in frontend/package.json for API calls.
* Adjust CORS settings in backend for production.
* Replace placeholder URLs with actual deployment links.
