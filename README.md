# Attendance Backend

Express + TypeScript + Knex backend for HR, employees, and attendance tracking.

## Quick Start

1. Install dependencies:
   `npm install`
2. Create `.env` from `.env.example` and update values.
3. Run migrations:
   `npm run knex:migrate`
4. Start server:
   `npm run dev`

## Environment Variables

See `.env.example` for all variables. Important:
- `DB_CLIENT`: `pg` (PostgreSQL) or `mysql2`
- `JWT_SECRET`: used to sign auth tokens
- `UPLOAD_DIR`: local folder for photo uploads

## Authentication

Create an HR user manually (example SQL):
```sql
INSERT INTO hr_users (email, password_hash, name)
VALUES ('hr@example.com', '$2a$10$replace_with_bcrypt_hash', 'HR Admin');
```

You can generate a hash with Node:
```ts
import bcrypt from 'bcryptjs';
const hash = await bcrypt.hash('your_password', 10);
```

## API Endpoints

- `POST /auth/login`
- `GET /employees`
- `GET /employees/:id`
- `POST /employees` (multipart/form-data, optional `photo`)
- `PUT /employees/:id` (multipart/form-data, optional `photo`)
- `DELETE /employees/:id`
- `GET /attendance`
- `POST /attendance`
- `PUT /attendance/:id`
- `DELETE /attendance/:id`

All `/employees` and `/attendance` routes require a Bearer JWT.
