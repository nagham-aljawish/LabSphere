# LabSphere

LabSphere is a comprehensive Medical Laboratory Management System developed as a graduation project. It is designed to manage laboratory workflows and connect patients, receptionists, laboratory technicians, doctors, and administrators through a centralized platform.

## Key Features

- Role-based system for Patients, Receptionists, Technicians, Doctors, and Administrators
- Patient registration and laboratory order management
- QR-based sample and tube tracking
- Laboratory result entry and review workflow
- Doctor approval of laboratory results
- Patient result viewing and downloading
- Payment and wallet management
- Financial aid and donation support
- Notifications and sample status tracking
- Clinical Decision Support System (CDSS)
- Delta Check for comparing current and previous laboratory results

## Tech Stack

**Frontend**
- React.js
- TypeScript
- Tailwind CSS
- Vite

**Backend**
- Laravel
- PHP
- MySQL
- Laravel Sanctum
- REST APIs

**AI / Clinical Decision Support**
- Python
- Clinical Decision Support System (CDSS)

## System Roles

- **Patient** – Access laboratory results, track samples, payments, and notifications.
- **Receptionist** – Manage patients, create laboratory orders, and handle payments.
- **Laboratory Technician** – Receive and track samples, enter test results, and submit them for review.
- **Doctor** – Review, approve or reject laboratory results and add medical notes.
- **Administrator** – Manage users, tests, orders, results, and system operations.

## Project Structure

```text
LabSphere/
├── frontend/    # React + TypeScript frontend
├── backend/     # Laravel backend and REST API
└── ai/          # Clinical Decision Support System
