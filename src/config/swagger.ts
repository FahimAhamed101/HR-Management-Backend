import swaggerJSDoc from 'swagger-jsdoc';
import { env } from './env';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Attendance Backend API',
      version: '1.0.0',
      description: 'HR authentication, employee management, and attendance tracking API.',
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: 'Local server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', example: 'HR Admin' },
            email: { type: 'string', example: 'hr@example.com' },
            password: { type: 'string', example: 'password123' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', example: 'hr@example.com' },
            password: { type: 'string', example: 'password123' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 1 },
                email: { type: 'string', example: 'hr@example.com' },
                name: { type: 'string', example: 'HR Admin' },
              },
            },
          },
        },
        Employee: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Jane Doe' },
            age: { type: 'integer', example: 28 },
            designation: { type: 'string', example: 'Engineer' },
            hiring_date: { type: 'string', format: 'date' },
            date_of_birth: { type: 'string', format: 'date' },
            salary: { type: 'number', format: 'float', example: 55000.0 },
            photo_path: { type: 'string', nullable: true },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        Attendance: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            employee_id: { type: 'integer', example: 1 },
            date: { type: 'string', format: 'date' },
            check_in_time: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  },
  apis: ['src/routes/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
