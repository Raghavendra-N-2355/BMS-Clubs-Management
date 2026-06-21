# BMSCE Connect - College Clubs & Event Management Platform

A production-level MERN stack application designed for **B.M.S. College of Engineering (BMSCE), Bengaluru**.  
This platform centralizes management of college clubs, technical/cultural events, workshops, hackathons, registrations, and online payments.

---

## 🌐 Live Repository

🔗 [GitHub Repository](https://github.com/Raghavendra-N-2355/BMS-Clubs-Management)

---

## 🚀 Tech Stack

**Frontend**
- React.js, JavaScript, HTML, CSS
- React Router DOM
- Context API / Redux
- Axios
- Tailwind CSS

**Backend**
- Node.js, Express.js
- REST API architecture

**Database**
- MongoDB Atlas
- Mongoose ODM

**Authentication**
- JWT Authentication
- bcrypt password encryption

**Payments**
- Stripe Payment Gateway

**Deployment**
- Frontend: Vercel  
- Backend: Render  
- Database: MongoDB Atlas  

---

## 👥 User Roles

### Student
- Register/Login
- Browse departments & clubs
- Search events
- Register & pay for events
- View registered events
- Download confirmation/certificates

### Club Admin
- Manage club profile
- Create/Update/Delete events
- View participants & payments

### Super Admin
- Manage departments & clubs
- Approve events
- Manage users
- View analytics dashboard

---

## 🗄️ Database Models

- **User**: name, email, password, USN, department, semester, role, registeredEvents[]
- **Department**: departmentName, departmentCode, description, clubs[]
- **Club**: clubName, department, description, logo, coordinators, members[], events[]
- **Event**: title, description, department, club, poster, category, venue, date, time, fee, participants
- **Registration**: studentId, eventId, paymentStatus, paymentId, registrationDate, certificateStatus

---

## 🔗 REST API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Users
- `GET /api/users/profile`
- `PUT /api/users/update`

### Departments
- `POST /api/departments/create`
- `GET /api/departments`
- `GET /api/departments/:id`

### Clubs
- `POST /api/clubs/create`
- `GET /api/clubs`
- `GET /api/clubs/:id`

### Events
- `POST /api/events/create`
- `GET /api/events`
- `GET /api/events/:id`
- `PUT /api/events/:id`
- `DELETE /api/events/:id`

### Registrations
- `POST /api/register/event`
- `GET /api/register/my-events`

### Payments
- `POST /api/payment/create-checkout`
- Stripe webhook integration

---

## 🎨 Frontend Pages

- Landing Page (logo, hero, upcoming events, popular clubs, departments)
- Student Dashboard (registered events, recommendations, payments, certificates)
- Department Page (clubs, members, upcoming events)
- Club Page (info, coordinators, events)
- Event Details Page (poster, description, venue, registration/payment)
- Admin Dashboard (event management, analytics, participants, revenue)

---

## 🔒 Security Features

- JWT middleware
- Role-based routes
- Password hashing
- Input validation
- Error handling
- CORS setup
- Protected API routes

---

## ⚡ Extra Features

- Event recommendation system
- Search & filtering
- Event calendar
- Email confirmations
- QR code tickets
- Certificate generation
- Admin analytics (students, clubs, events, revenue)

---

## 📦 Project Structure

