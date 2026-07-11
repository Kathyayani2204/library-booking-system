# Library Booking System – REST API

A backend service that lets users search, view, and reserve books from a library, and lets admins manage book inventory and reservations — built with Spring Boot and secured with JWT authentication.

## Features

- User registration and login (JWT-based authentication)
- Role-based access control (USER / ADMIN)
- Browse and search books
- Book reservation system with availability checks (no double-booking)
- Admin book management (add, update, delete)
- View reservation history (per user and admin-wide)
- Clean, consistent error responses (no raw stack traces exposed to clients)

## Tech Stack

- **Backend:** Spring Boot
- **Database:** MySQL
- **Authentication:** JWT (JSON Web Token)
- **Build Tool:** Maven
- **Testing:** Postman

## Actors

**User**
- Registers and logs in
- Searches for books
- Makes reservations

**Admin**
- Manages books (CRUD)
- Views and manages all reservations

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive a JWT token |

### Books
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/books` | Get all books | USER / ADMIN |
| GET | `/api/books/{id}` | Get a specific book by ID | USER / ADMIN |
| POST | `/api/books` | Add a new book | ADMIN only |
| PUT | `/api/books/{id}` | Update a book | ADMIN only |
| DELETE | `/api/books/{id}` | Delete a book | ADMIN only |

### Reservations
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/reservations` | Reserve a book | USER / ADMIN |
| GET | `/api/users/{id}/reservations` | Get a user's reservation history | USER / ADMIN |
| GET | `/api/admin/reservations` | Get all reservations | ADMIN only |

## Database Schema

**User**
`id, name, email, password, role (USER / ADMIN)`

**Book**
`id, title, author, isbn, available (true/false)`

**Reservation**
`id, user_id, book_id, issue_date, return_date, status (ACTIVE / RETURNED)`

## Security

- JWT-based authentication protects all endpoints.
- Role-based authorization restricts admin-only actions (adding/updating/deleting books, viewing all reservations) to users with the `ADMIN` role — verified to return `403 Forbidden` for regular users.
- Business-rule errors (duplicate email, unavailable book, book with active reservations, etc.) return clean `400 Bad Request` responses with a readable `{"error": "..."}` message instead of raw server errors.

## Running Locally

### Prerequisites
- Java 17+
- Maven
- MySQL Server running locally

### Setup

1. Clone the repository:
```bash
   git clone https://github.com/Kathyayani2204/library-booking-system.git
   cd library-booking-system
```

2. Create the database in MySQL:
```sql
   CREATE DATABASE library_db;
```

3. Update `src/main/resources/application.properties` with your MySQL username/password:
```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/library_db
   spring.datasource.username=your_mysql_username
   spring.datasource.password=your_mysql_password
```

4. Run the application:
```bash
   mvn spring-boot:run
```

5. The API will be available at `http://localhost:8080`.

## Testing with Postman

A ready-to-import Postman collection is included in the [`Postman/`](./Postman) folder, covering all endpoints above with example request bodies for both USER and ADMIN roles.

To use it:
1. Open Postman → **Import** → select `Postman/Library Booking System.postman_collection.json`.
2. Set the `baseUrl` collection variable (defaults to `http://localhost:8080`).
3. Register/login to get a JWT, then save it into the `token` (regular user) or `adminToken` (admin) collection variables.

## Future Scope

- Frontend integration (React/Angular)
- Book return and fine management
- Reminder emails for return deadlines
- QR code scanning for physical books
