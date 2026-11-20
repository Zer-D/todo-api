const express = require("express");
const router = express.Router();
const statsController = require("../controllers/stats.controller");
const checkApiKey = require("../middlewares/apiKey.middleware");

/**
 * @swagger
 * /api/stats/summary:
 *   get:
 *     summary: Get todo statistics summary (total, completed, pending)
 *     description: >
 *       This endpoint is designed for machine-to-machine integration (e.g., external
 *       dashboards), so it does not use JWT login like /api/todos endpoints,
 *       but instead uses API Key protection via the x-api-key header.
 *     tags: [Stats]
 *     security:
 *       - apiKeyAuth: []
 *     responses:
 *       200:
 *         description: Statistics summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Summary retrieved successfully }
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalTodos: { type: integer, example: 25 }
 *                     completedTodos: { type: integer, example: 10 }
 *                     pendingTodos: { type: integer, example: 15 }
 *       401:
 *         description: API key missing or invalid
 */
router.get("/summary", checkApiKey, statsController.getSummary);

module.exports = router;
