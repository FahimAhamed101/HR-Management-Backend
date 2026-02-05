# Attendance Backend (Node.js + TypeScript)

Backend service for HR user authentication, employee management, and attendance tracking.

## Tech Stack
- Node.js + TypeScript
- Express
- Knex
- PostgreSQL (preferred) or MySQL
- Joi validation
- JWT auth
- Multer for local file uploads
- ESLint + Prettier

## Project Structure
```
src/
  app.ts
  server.ts
  config/
  controllers/
  db/
  middleware/
  routes/
  services/
  validators/
migrations/
uploads/
```

## Setup
1. Install dependencies:
```
npm install
```

2. Create `.env` from `.env.example` and update values.

3. Run migrations:
```
npm run knex:migrate
```

4. Start server:
```
npm run dev
```

## Environment Variables
See `.env.example`. Key settings:
- `DB_CLIENT`: `pg` or `mysql2`
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `DB_POOL_MIN`, `DB_POOL_MAX`, `DB_POOL_IDLE_MS`, `DB_POOL_ACQUIRE_MS`
- `JWT_SECRET`, `JWT_EXPIRES_IN`
- `UPLOAD_DIR`
- `PORT`
Optional seed settings:
- `SEED_HR_EMAIL`, `SEED_HR_PASSWORD`, `SEED_HR_NAME`

## Database Schema
Tables created via migration:
- `hr_users`
- `employees`
- `attendance` (unique by `employee_id` + `date`, FK to `employees`)

## Authentication
`POST /auth/login` with:
```json
{
  "email": "hr@example.com",
  "password": "your_password"
}
```

Response includes a JWT:
```json
{
  "token": "BearerToken",
  "user": {
    "id": 1,
    "email": "hr@example.com",
    "name": "HR Admin"
  }
}
```

### Create HR User (example SQL)
```sql
INSERT INTO hr_users (email, password_hash, name)
VALUES ('hr@example.com', '$2a$10$replace_with_bcrypt_hash', 'HR Admin');
```

Generate bcrypt hash:
```ts
import bcrypt from 'bcryptjs';
const hash = await bcrypt.hash('your_password', 10);
```

## API Endpoints

### Auth
- `POST /auth/register`
- `POST /auth/login`

### Employees (protected)
- `GET /employees` (supports `page`, `limit`, `search`)
- `GET /employees/:id`
- `POST /employees` (multipart/form-data, optional `photo`)
- `PUT /employees/:id` (multipart/form-data, optional `photo`)
- `DELETE /employees/:id` (soft delete)

### Attendance (protected)
- `GET /attendance` (supports `employee_id`, `date`, `from`, `to`, `page`, `limit`)
- `POST /attendance` (upsert by `employee_id` + `date`)
- `PUT /attendance/:id`
- `DELETE /attendance/:id`

### Reports (protected)
- `GET /reports/attendance?month=YYYY-MM&employee_id=ID`

## Query Examples
- `GET /employees?search=rahim`
- `GET /attendance?employee_id=12&from=2025-08-01&to=2025-08-31`
- `GET /reports/attendance?month=2025-08`

## API Docs (Swagger)
Open `http://localhost:PORT/docs` after starting the server.

## File Uploads
Use `photo` field with `multipart/form-data`. Files are stored in `uploads/`.

## Scripts
- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run format`
- `npm run knex:migrate` (run latest migrations)
- `npm run knex:rollback` (rollback last batch)
- `npm run knex:make -- <name>` (create new migration)
- `npm run knex:seed` (run seeds)
- `npm run knex:seed:make -- <name>` (create new seed)

## Notes
- All `/employees` and `/attendance` routes require `Authorization: Bearer <token>`.
- PostgreSQL is recommended, MySQL is supported with `DB_CLIENT=mysql2`.
