const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const { protect } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const {
    createCategoryRules,
    updateCategoryRules,
    getCategoryByIdRules,
    getAllCategoriesRules,
} = require("../validators/category.validator");

router.use(protect);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category (requires login)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Technology"
 *               description:
 *                 type: string
 *                 example: "Category for technology and programming topics"
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Category created successfully }
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       400:
 *         description: Validation failed (e.g., name empty)
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Category name already exists
 *   get:
 *     summary: Get category list (with pagination & search)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search keyword based on category name
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, name]
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort direction
 *     responses:
 *       200:
 *         description: Category list retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Categories retrieved successfully }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *                 pagination:
 *                   type: object
 *       401:
 *         description: Unauthorized
 */
router.post("/", createCategoryRules, validate, categoryController.createCategory);
router.get("/", getAllCategoriesRules, validate, categoryController.getAllCategories);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get a single category by ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Category retrieved successfully }
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 *   put:
 *     summary: Update a category by ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Education"
 *               description:
 *                 type: string
 *                 example: "Category for learning materials"
 *               archived:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Category updated successfully }
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       400:
 *         description: Validation failed (empty name or invalid ID format)
 *       404:
 *         description: Category not found
 *       409:
 *         description: Category name already used by another category
 *   delete:
 *     summary: Delete a category by ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 */
router.get("/:id", getCategoryByIdRules, validate, categoryController.getCategory);
router.put("/:id", updateCategoryRules, validate, categoryController.updateCategory);
router.delete("/:id", getCategoryByIdRules, validate, categoryController.deleteCategory);

module.exports = router;
