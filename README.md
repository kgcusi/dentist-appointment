# Dentist Appointment System
## Overview
The Dentist Appointment System is a web-based application designed to help dental clinics manage appointments, patient records, and treatment plans efficiently.

## Features
- **Appointment Scheduling**: Easy scheduling and rescheduling of appointments.

## Packages
### Server-side:
- **Express.js**: Web framework for Node.js.
- **jsonwebtoken (JWT)**: For authentication and authorization.
- **MongoDB**: NoSQL database used for storing patient and appointment data.
- **Mongoose**: MongoDB object modeling for Node.js.

### Client-side:
- **Vite**: A fast development environment for modern web projects.
- **React**: A JavaScript library for building user interfaces.
- **Shadcn**: For building modern, reusable components with Tailwind CSS.
- **TailwindCSS**: A utility-first CSS framework for rapidly building custom user interfaces.

## Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/dentist-appointment.git
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
