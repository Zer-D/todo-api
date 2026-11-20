const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todo.controller");
const { protect } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const {
    createTodoRules,
    updateTodoRules,
    getTodoByIdRules,
    getAllTodosRules,
} = require("../validators/todo.validator");

router.use(protect);

/**
 * @swagger
 * /api/todos:
 *   post:
 *     summary: Create a new todo (requires login)
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *                 example: Learn Swagger
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 example: Write API documentation for todo endpoints
 *               category:
 *                 type: string
 *                 description: Category ID (optional, MongoDB ObjectId format)
 *                 example: 665f1b2c8b1e2a1a2c3d2222
 *     responses:
 *       201:
 *         description: Todo created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Todo created successfully }
 *                 data:
 *                   $ref: '#/components/schemas/Todo'
 *       400:
 *         description: Validation failed (e.g., title empty or outside 3-100 chars, or invalid category ID format)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Not logged in / invalid token
 */
router.post("/", createTodoRules, validate, todoController.createTodo);

/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Get todo list (regular users see their own, admin sees all users' todos) with pagination & search
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search keyword based on title
 *       - in: query
 *         name: completed
 *         schema:
 *           type: boolean
 *         description: Filter by completion status
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, title, completed]
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort direction
 *     responses:
 *       200:
 *         description: Todo list retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Todos retrieved successfully }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Todo'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage: { type: integer, example: 1 }
 *                     totalPages: { type: integer, example: 3 }
 *                     totalItems: { type: integer, example: 25 }
 *                     itemsPerPage: { type: integer, example: 10 }
 *       401:
 *         description: Not logged in / invalid token
 */
router.get("/", getAllTodosRules, validate, todoController.getAllTodos);

/**
 * @swagger
 * /api/todos/{id}:
 *   get:
 *     summary: Get a single todo by ID
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Todo ID (MongoDB ObjectId format)
 *     responses:
 *       200:
 *         description: Todo found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Todo retrieved successfully }
 *                 data:
 *                   $ref: '#/components/schemas/Todo'
 *       400:
 *         description: Invalid ID format
 *       401:
 *         description: Not logged in / invalid token
 *       403:
 *         description: This todo does not belong to the logged-in user (admin excluded)
 *       404:
 *         description: Todo not found
 */
router.get("/:id", getTodoByIdRules, validate, todoController.getTodoById);

/**
 * @swagger
 * /api/todos/{id}:
 *   put:
 *     summary: Update a todo by ID
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Todo ID (MongoDB ObjectId format)
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *                 example: Learn Swagger (revised)
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 example: Adding response schema examples
 *               completed:
 *                 type: boolean
 *                 example: true
 *               category:
 *                 type: string
 *                 example: 665f1b2c8b1e2a1a2c3d2222
 *               archived:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Todo updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Todo updated successfully }
 *                 data:
 *                   $ref: '#/components/schemas/Todo'
 *       400:
 *         description: Validation failed or invalid ID format
 *       401:
 *         description: Not logged in / invalid token
 *       403:
 *         description: This todo does not belong to the logged-in user (admin excluded)
 *       404:
 *         description: Todo not found
 */
router.put("/:id", updateTodoRules, validate, todoController.updateTodo);

/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     summary: Delete a todo by ID
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Todo ID (MongoDB ObjectId format)
 *     responses:
 *       200:
 *         description: Todo deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Todo deleted successfully }
 *                 data:
 *                   $ref: '#/components/schemas/Todo'
 *       400:
 *         description: Invalid ID format
 *       401:
 *         description: Not logged in / invalid token
 *       403:
 *         description: This todo does not belong to the logged-in user (admin excluded)
 *       404:
 *         description: Todo not found
 */
router.delete("/:id", getTodoByIdRules, validate, todoController.deleteTodo);

module.exports = router;
