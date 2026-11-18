# CareCircle – Family Health Management Platform

A major project submitted for the award of the degree of **B. Tech. (Computer Science & Engineering)**  
**Department of Computer Engineering & Applications, GLA University, Mathura (2026-27)**

### Project Team:
- **Siddharth Singh** (Univ. Roll No. 2415001571)
- **Adarsh Singh** (Univ. Roll No. 2415000075)
- **Akarshit Kaushik** (Univ. Roll No. 2415000143)
- **Krishna Sharma** (Univ. Roll No. 2415000847)
- **Vishnu Sharma** (Univ. Roll No. 2415001801)

**Under the supervision of:**  
**Mr. Divyanshu Khandelwal**

---

## 📌 Project Overview
CareCircle is a centralized, role-based, privacy-first family health management platform. Unlike individual-oriented fitness apps or single-hospital portals, CareCircle organizes healthcare records around a unified **Family Unit**. A **Family Owner** (primary caregiver) can manage profiles for all members (children, elderly grandparents, spouses), track recurring medications with daily dosage checklists, organize prescriptions and lab reports in a secure vault, grant time-bound category-specific access to doctors, and provide instantaneous access to vital health parameters during medical emergencies.

---

## 🚀 Key Modules & Innovations

1. **Family Health Hub & Multi-Profile Management**:
   - Manage multiple members under one household account.
   - Profile badges with blood groups, dates of birth, emergency contact details, primary physicians, and health insurance policy numbers.

2. **Medication Schedule & Adherence Tracker**:
   - Daily timetable categorizing doses into Morning, Afternoon, Evening, and Night.
   - Food relations (Before meal, After meal, Empty stomach).
   - One-click dose logging ("Taken", "Missed") with automatic stock deduction and refill warnings.

3. **Medical Document Vault**:
   - Organized archive for prescriptions, diagnostic lab reports, scans, and discharge summaries.
   - Instant file preview and categorization.

4. **Category-Level Doctor Access Grants**:
   - Granular authorization: Family Owner selects which specific categories a doctor can inspect (`medications`, `allergies`, `chronic_conditions`, `vitals`, `prescriptions`, `lab_reports`).
   - Time-limited validity (24 hours, 48 hours, 7 days, etc.) and instant revocation capability.
   - Clean, dedicated Doctor Portal view.

5. **Emergency Mode (SOS & Scannable QR)**:
   - Frictionless public emergency page (`/emergency/:code`) accessible without authentication.
   - Displays life-saving information: Blood group, emergency phone call button, critical allergies, ongoing medications, and chronic conditions.
   - Generates a scannable QR code suitable for medical ID cards and lock screens.

---

## 🛠️ Technology Stack
- **Frontend**: React.js (Vite), Tailwind CSS, Lucide React, QRCode.react, React Router v6, Axios
- **Backend**: Node.js, Express.js REST API
- **Database**: MongoDB with Mongoose ODM
- **Authentication & Security**: JSON Web Tokens (JWT) + bcryptjs password hashing
- **File Uploads**: Multer local storage middleware

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18+ recommended)
- **MongoDB** (Local instance on port `27017` or MongoDB Atlas URI)

### 2. Setup Server
```bash
cd server
npm install
# Configure your .env (default: MONGODB_URI=mongodb://127.0.0.1:27017/carecircle)
npm run seed     # Populates rich demo family records
npm run dev      # Starts API server on port 5000
```

### 3. Setup Client
```bash
cd client
npm install
npm run dev      # Starts Vite development server on http://localhost:5173
```

### 4. Viva / Demo Credentials
- **Family Owner Email**: `siddharth@carecircle.com`
- **Password**: `password123`
- Click the **"Fill Viva / Demo Account"** button on the Login page for one-click access!
- **Demo Doctor Access Link**: `http://localhost:5173/doctor-access/demo-doctor-grant-ramesh`
- **Demo Emergency SOS QR Page**: `http://localhost:5173/emergency/EMG-RAMESH74`
