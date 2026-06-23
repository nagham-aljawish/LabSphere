# LabSphere API

Backend REST API for the LabSphere medical laboratory platform. Built with Laravel 11, MySQL, and Laravel Sanctum.

Compatible with the LabSphere React/Vite frontend at `http://localhost:5173`.

## Requirements

- PHP 8.2+
- Composer
- MySQL 8.0+
- PHP extensions: BCMath, Ctype, Fileinfo, JSON, Mbstring, OpenSSL, PDO, Tokenizer, XML

## Installation

```bash
composer install
cp .env.example .env
php artisan key:generate
```

Configure your database in `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=labsphere
DB_USERNAME=root
DB_PASSWORD=your_password
```

Create the MySQL database:

```sql
CREATE DATABASE labsphere CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Run migrations and seed demo data:

```bash
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

## API Base URL

```
http://localhost:8000/api
```

## Authentication

This API uses Laravel Sanctum token authentication. Include the token in requests:

```
Authorization: Bearer {your_token}
```

### Auth Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register as patient |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout (authenticated) |
| GET | `/api/auth/me` | Current user (authenticated) |

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@labsphere.test | password |
| Doctor | doctor@labsphere.test | password |
| Technician | technician@labsphere.test | password |
| Reception | reception@labsphere.test | password |
| Patient | patient@labsphere.test | password |

Demo patient code: `PAT-32045`  
Demo order: `ORD-10453`  
Demo approved result: Blood Test Report

## Roles

| Role | Permissions |
|------|-------------|
| **patient** | Register, login, view own approved results, payments, financial aid |
| **admin** | Full access to all resources |
| **reception** | Create and view orders, search patients |
| **technician** | View orders, enter/edit draft results, submit for review |
| **doctor** | Review and approve/reject pending results |

## CORS

Configured for:
- `http://localhost:5173`
- `http://127.0.0.1:5173`

## File Uploads

Financial aid documents are stored in `storage/app/public/financial-aid`.

Allowed types: PDF, JPG, JPEG, PNG (max 5MB).

Run `php artisan storage:link` to create the public symlink.

## Response Format

**Success:**
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": {}
}
```

## API Documentation

Full endpoint reference with JSON examples: [docs/api.md](docs/api.md)

## License

MIT
