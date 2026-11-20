const express = require("express");
const router = express.Router();
const logController = require("../controllers/log.controller");
const { protect } = require("../middlewares/auth.middleware");

router.use(protect);

/**
 * @swagger
 * /api/logs:
 *   get:
 *     summary: Get activity logs list (Admin sees all, User sees own logs)
 *     tags: [Logs]
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
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort field (e.g., createdAt)
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort direction
 *     responses:
 *       200:
 *         description: Activity logs retrieved successfully
 *       401:
 *         description: Unauthorized (Invalid or missing token)
 */
router.get("/", logController.getAllLogs);

module.exports = router;
