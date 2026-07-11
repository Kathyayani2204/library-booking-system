# Library Booking System

A full-stack web application for managing library books and reservations.

The system allows users to register, log in, browse books, search for books, reserve available books, view their reservations, and return books. Administrators can manage books and view all reservations.

---

## Features

### User Features

- User registration
- User login
- JWT-based authentication
- Browse all books
- Search books by title or author
- View book availability
- Reserve available books
- View personal reservations
- Return reserved books
- Logout

### Admin Features

- Admin login
- Role-based authorization
- Admin dashboard
- Add new books
- Update existing books
- Delete books
- View all books
- View all reservations

---

## Technologies Used

### Backend

- Java
- Spring Boot
- Spring Security
- JWT Authentication
- Spring Data JPA
- Hibernate
- MySQL
- Maven

### Frontend

- Angular
- TypeScript
- HTML
- CSS

### Tools

- Visual Studio Code
- MySQL Workbench
- Postman
- Git
- GitHub

---

## Project Structure

```text
library-booking-system/
│
├── backend/                 # Spring Boot backend
│   ├── .mvn/
│   ├── src/
│   ├── pom.xml
│   ├── mvnw
│   └── mvnw.cmd
│
├── frontend/                # Angular frontend
│   ├── src/
│   ├── package.json
│   └── angular.json
│
├── Postman/                 # Postman API collection
├── .gitattributes
├── .gitignore
└── README.md
```

---

## Prerequisites

Before running the project, install:

- Java
- Maven or use the included Maven Wrapper
- Node.js and npm
- Angular CLI
- MySQL

---

## Database Setup

The application uses MySQL.

The default database name is:

```text
library_db
```

The database can be created automatically when the backend starts.

The backend configuration uses environment variables for sensitive values such as the MySQL password and JWT secret.

---

## Backend Configuration

Navigate to the backend directory:

```bash
cd backend
```

The application requires the following environment variables:

- `DB_PASSWORD` — MySQL password
- `JWT_SECRET` — secure secret used for JWT signing

### Windows PowerShell

Set your MySQL password:

```powershell
$env:DB_PASSWORD="YOUR_MYSQL_PASSWORD"
```

Generate and set a secure random JWT secret:

```powershell
$bytes = New-Object byte[] 64
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($bytes)
$env:JWT_SECRET = [Convert]::ToBase64String($bytes)
$rng.Dispose()
```

> Do not commit real passwords or JWT secrets to GitHub.

---

## Run the Backend

From the `backend` directory:

```powershell
.\mvnw.cmd spring-boot:run
```

The backend runs on:

```text
http://localhost:8080
```

The backend provides REST API endpoints under:

```text
http://localhost:8080/api
```

---

## Run the Frontend

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the Angular development server:

```bash
ng serve
```

Open the application in a browser at:

```text
http://localhost:4200
```

---

## Authentication and Authorization

The application uses JWT-based authentication.

Two roles are supported:

- `USER`
- `ADMIN`

### USER

A user can:

- Browse books
- Search books
- Reserve available books
- View personal reservations
- Return books

### ADMIN

An administrator can:

- Access the Admin Dashboard
- Add books
- Edit books
- Delete books
- View all reservations

---

## Security

Sensitive configuration values are not stored directly in the source code.

The backend uses environment variables:

```text
DB_PASSWORD
JWT_SECRET
```

The `application.properties` file references these environment variables instead of containing real credentials.

---

## API Testing

Postman can be used to test the backend REST APIs.

Postman-related files are stored in:

```text
Postman/
```

---

## Running the Complete Application

### Terminal 1 — Backend

```powershell
cd backend

$env:DB_PASSWORD="YOUR_MYSQL_PASSWORD"

$bytes = New-Object byte[] 64
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($bytes)
$env:JWT_SECRET = [Convert]::ToBase64String($bytes)
$rng.Dispose()

.\mvnw.cmd spring-boot:run
```

### Terminal 2 — Frontend

```powershell
cd frontend
ng serve
```

Then open:

```text
http://localhost:4200
```

---


