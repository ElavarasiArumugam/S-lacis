````markdown
# 🐄 S-LACIS – Smart Livestock & Animal Care Intelligence System
![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi)
![Next.js](https://img.shields.io/badge/Next.js-Frontend-black?logo=next.js)
![React](https://img.shields.io/badge/React-TypeScript-61DAFB?logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?logo=postgresql)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Styling-38BDF8?logo=tailwind-css)


---

# 📖 Overview

**S-LACIS (Smart Livestock & Animal Care Intelligence System)** is an AI-powered livestock management platform developed to help farmers digitally manage their farms through a single intelligent dashboard.

The system allows farmers to

- Register livestock
- Monitor health records
- Manage vaccinations
- Track breeding & pregnancy
- Detect disease risks
- Monitor production
- View farm analytics
- Interact with an AI livestock assistant

The project aims to improve livestock productivity, reduce disease outbreaks, and simplify farm management using modern web technologies.

---

# ✨ Features

## 👨‍🌾 Farmer Authentication

- Secure Farmer Registration
- Login Authentication
- JWT Authentication
- Farm-based access control

---

## 🐄 Animal Registry

- Register livestock
- View all animals
- Animal Profile
- Breed Information
- Weight
- Age
- Gender
- Pregnancy Status
- Vaccination Status
- Risk Level

---

## 💉 Vaccination Management

- Schedule Vaccinations
- Update Vaccination Records
- Store Vaccine Name
- Last Vaccination Date
- Next Vaccination Date

Automatically updates

- Animal vaccination history
- Future vaccination schedule

---

## 🩺 Health Records

Store

- Disease
- Symptoms
- Treatment
- Recovery Status

Automatically updates

- Animal Status
- Risk Level

---

## 🚨 Disease Alerts

Automatically detects

- Sick Animals
- High Risk Animals

Displays

- Disease
- Symptoms
- Treatment
- Animal Status
- Risk Level

---

## 🍼 Breeding & Pregnancy

Manage

- Breeding Date
- Pregnancy Status
- Expected Delivery Date

---

## 🥛 Production Monitoring

Automatically estimates production based on animal type.

Supports

- Milk
- Wool
- Eggs

Production is calculated dynamically using

- Animal Type
- Weight

Example

| Animal | Production |
|---------|------------|
| Cow | Milk |
| Goat | Milk |
| Sheep | Wool |
| Poultry | Eggs |

---

## 📊 Farm Analytics

Dashboard displaying

- Total Animals
- Healthy Animals
- Sick Animals
- Pregnant Animals
- Vaccinated Animals
- High Risk Animals
- Production Summary

---

## 🤖 AI Chat Assistant

AI-powered livestock assistant capable of answering

- Disease queries
- Feeding suggestions
- Vaccination guidance
- Pregnancy guidance
- General livestock management questions

---

# 🏗 System Architecture

```
                Farmer
                   │
                   ▼
        Next.js + React Frontend
                   │
          REST API (FastAPI)
                   │
        -------------------------
        |         |             |
     Animals   Health     Vaccination
        |         |             |
        -------------------------
                   │
             Disease Alerts
                   │
         Production Analytics
                   │
            PostgreSQL Database
```

---

# 🛠 Tech Stack

## Frontend

- Next.js
- React.js
- TypeScript
- Tailwind CSS

---

## Backend

- FastAPI
- Python
- SQLAlchemy
- Pydantic

---

## Database

- PostgreSQL
- Neon Database

---

## Deployment

Frontend

- Vercel

Backend

- Render

Database

- Neon PostgreSQL

---

# 📂 Project Structure

```
S-LACIS
│
├── backend
│   ├── app
│   │
│   ├── routers
│   │     ├── auth.py
│   │     ├── animals.py
│   │     ├── vaccination.py
│   │     ├── health.py
│   │     ├── alerts.py
│   │     ├── breeding.py
│   │     ├── production.py
│   │     ├── analytics.py
│   │     └── chatbot.py
│   │
│   ├── models.py
│   ├── database.py
│   └── main.py
│
├── frontend
│   ├── app
│   ├── components
│   ├── public
│   └── styles
│
└── README.md
```

---

# 🗄 Database Tables

### farmers

Stores

- Farmer Details
- Login Credentials
- Livestock Counts

---

### animals

Stores

- Animal ID
- Breed
- Type
- Weight
- Age
- Vaccination
- Pregnancy
- Risk Level
- Status

---

### health_records

Stores

- Disease
- Symptoms
- Treatment
- Status

---

### production_records

Stores

- Production
- Quantity
- Record Date

---

# 🔄 Module Workflow

```
Animal Registration
        │
        ▼
Vaccination
        │
        ▼
Health Records
        │
        ▼
Disease Alerts
        │
        ▼
Farm Analytics
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/S-LACIS.git
```

---

## Backend

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# 🌐 API Endpoints

## Authentication

```
POST /api/v1/auth/register

POST /api/v1/auth/login
```

---

## Animals

```
GET /api/v1/animals

POST /api/v1/animals/add

GET /api/v1/animals/{id}

POST /api/v1/animals/vaccinate
```

---

## Health

```
POST /api/v1/health/add

GET /api/v1/health/{animal_id}
```

---

## Disease Alerts

```
GET /api/v1/alerts/{farm_id}
```

---

## Breeding

```
POST /api/v1/breeding/update

GET /api/v1/breeding/{animal_id}
```

---

## Production

```
GET /api/v1/production
```

---

## Analytics

```
GET /api/v1/analytics/{farm_id}
```

---

## Chatbot

```
POST /api/v1/chat/message
```

---

# 📸 Screenshots

Add screenshots here

```
Dashboard

Animal Registry

Vaccination

Health Records

Disease Alerts

Breeding

Production

Farm Analytics

AI Chat Assistant
```

---

# 🔮 Future Enhancements

- IoT Sensor Integration
- RFID Animal Tracking
- Mobile Application
- AI Disease Prediction
- SMS Notifications
- Email Alerts
- Offline Mode
- Multi-language Support
- Veterinary Appointment Booking
- Image-based Disease Detection
- QR Code Animal Identification

---

# 👩‍💻 Developed By

**Elavarasi Arumugam**

B.Tech Information Technology

College of Engineering, Guindy (Anna University)

GitHub:
https://github.com/ElavarasiArumugam

LinkedIn:
https://www.linkedin.com/in/elavarasi-arumugam-9b5900329/

---

# 📜 License

This project is developed for educational and academic purposes.

---

## ⭐ If you found this project useful, consider giving it a Star!
````
