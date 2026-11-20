const swaggerJSDoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Todo List Management API",
            version: "1.0.0",
            description: "API documentation for Todo List Management — built with Node.js, Express, and MongoDB",
        },
        servers: [
            {
                url: '/',
                description: 'Current Server (Auto Detect / Vercel Production)',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
                apiKeyAuth: {
                    type: "apiKey",
                    in: "header",
                    name: "x-api-key",
                },
            },
            schemas: {
                User: {
                    type: "object",
                    properties: {
                        _id: { type: "string", example: "665f1a2b8b1e2a1a2c3d1111" },
                        name: { type: "string", example: "Ahmad Dzikri" },
                        email: { type: "string", example: "dzikri@email.com" },
                        role: { type: "string", enum: ["user", "admin"], example: "user" },
                    },
                },
                Category: {
                    type: "object",
                    properties: {
                        _id: { type: "string", example: "665f1b2c8b1e2a1a2c3d2222" },
                        name: { type: "string", example: "Work" },
                        description: { type: "string", example: "Daily tasks related to office work" },
                        created_by: { type: "string", example: "665f1a2b8b1e2a1a2c3d1111" },
                        updated_by: { type: "string", example: "665f1a2b8b1e2a1a2c3d1111" },
                        archived: { type: "boolean", example: false },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                Todo: {
                    type: "object",
                    properties: {
                        _id: { type: "string", example: "665f1c2e8b1e2a1a2c3d4e5f" },
                        title: { type: "string", example: "Learn Swagger" },
                        description: { type: "string", example: "Write API documentation for todo endpoints" },
                        completed: { type: "boolean", example: false },
                        category: { type: "string", example: "665f1b2c8b1e2a1a2c3d2222" },
                        owner: { type: "string", example: "665f1a2b8b1e2a1a2c3d1111" },
                        created_by: { type: "string", example: "665f1a2b8b1e2a1a2c3d1111" },
                        updated_by: { type: "string", example: "665f1a2b8b1e2a1a2c3d1111" },
                        archived: { type: "boolean", example: false },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                ActivityLog: {
                    type: "object",
                    properties: {
                        _id: { type: "string", example: "665f1d2e8b1e2a1a2c3d6789" },
                        user: { type: "string", example: "665f1a2b8b1e2a1a2c3d1111" },
                        action: { type: "string", example: "CREATE_TODO" },
                        description: { type: "string", example: "User created a new todo: 'Learn Swagger'" },
                        createdAt: { type: "string", format: "date-time" },
                    },
                },
                ErrorResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: false },
                        message: { type: "string", example: "Invalid input data or resource not found" },
                    },
                },
            },
        },
    },
    apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
