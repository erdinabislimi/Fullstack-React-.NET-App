# 📚 E-Library Management & Event System

A modern fullstack web application for managing a **digital library and community events**, built with **React (TypeScript)** and **ASP.NET Core (.NET 7)**.  
The platform allows users to borrow books, register for library events, and make secure online payments through **Stripe** integration.

---

## 🚀 Features

### 👤 User Features
- 🔍 **Search and browse** books by title, author, or category  
- 📖 **Borrow and return** books online  
- 🗓️ **View and register** for upcoming library events  
- 💳 **Pay securely** for event tickets using **Stripe Checkout**  
- 📝 **Add reviews** and manage borrowing history  

### 🛠️ Admin Features
- 📚 Manage books, categories, and authors  
- 👥 Manage users and their borrowing activity  
- 🗓️ Create, edit, and manage library events  
- 💰 Track Stripe payments and transaction logs  
- 📊 Dashboard for analytics and reports  

---

## 🧩 Architecture Overview

The system follows a **3-tier layered architecture**:

1. **Frontend (Presentation Layer)** – React + TypeScript + Material-UI  
2. **Backend (Business Logic Layer)** – ASP.NET Core Web API (C#, EF Core)  
3. **Database (Data Layer)** – SQL Server  

All interactions between frontend and backend are done via **RESTful APIs**.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React, TypeScript, Material UI, Axios |
| **Backend** | ASP.NET Core (.NET 7), C#, Entity Framework |
| **Database** | SQL Server |
| **Payments** | Stripe API (Checkout + Webhooks) |
| **Tools** | Visual Studio, VS Code, Git, Postman |

---

## 💳 Stripe Integration

Stripe is used for secure event ticket payments:
- Users can pay directly from the event page.
- Payment success/failure is handled via Stripe webhooks.
- Admins can track transactions in the dashboard.

---

## 👩‍💻 Authors
**Erdinë Bislimi**  
**Delfina Plakolli**
Software Engineer | React & .NET Developer  
🌍 (https://github.com/erdinabislimi)  
🌍 (https://github.com/delfinaplakolli)  


---

## 📄 License
This project is for educational and demonstration purposes only.
