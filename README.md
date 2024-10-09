# Dentist Appointment System
## Overview
The Dentist Appointment System is a web-based application designed to help dental clinics manage appointments

## Features
- **Appointment Scheduling**

## Packages
### Server-side:
- **Express.js**
- **jsonwebtoken (JWT)**
- **MongoDB**
- **Mongoose**

### Client-side:
- **Vite**
- **Redux**
- **React**
- **Shadcn**
- **TailwindCSS**

## Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/kgcusi/dentist-appointment.git
    ```
2. Navigate to the project directory:
    ```bash
    cd dentist-appointment
    ```
3. Install dependencies:
    ```bash
    npm install
    ```

## ENV Values
### Server
- `MONGO_ATLAS_URI`
- `PORT`
- `JWT_SECRET`

### Client
- `VITE_REACT_APP_API_URL`

## Usage
1. Seed the dentists
    ```bash
    node server/seeders/dentistSeeder.js
    ```
2. Start the development server:
    ```bash
    npm start
    ```
3. Open your browser and navigate to `http://localhost:3000`.
