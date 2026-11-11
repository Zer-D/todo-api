const express = require("express");
const router = express.Router();
const logController = require("../controllers/log.controller");
const { protect } = require("../middlewares/auth.middleware");

router.use(protect);

/**
 * @swagger
 * /api/logs:
 *   get:
 *     summary: Mengambil daftar seluruh activity logs (Khusus Admin)
 *     tags: [Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Nomor halaman
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Jumlah data per halaman
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Kolom acuan sorting (misal createdAt)
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Urutan sorting
 *     responses:
 *       200:
 *         description: Daftar activity logs berhasil diambil
 *       401:
 *         description: Unauthorized (Token tidak valid/tidak ada)
 *       403:
 *         description: Forbidden (Hanya admin yang diizinkan)
 */
router.get("/", logController.getAllLogs);

module.exports = router;
