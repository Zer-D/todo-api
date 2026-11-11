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
 *     summary: Membuat kategori baru (wajib login)
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
 *                 example: "Teknologi"
 *     responses:
 *       201:
 *         description: Kategori berhasil dibuat
 *       400:
 *         description: Validasi gagal atau nama sudah ada
 *       401:
 *         description: Unauthorized
 *   get:
 *     summary: Mengambil daftar kategori (dengan pagination)
 *     tags: [Categories]
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
 *     responses:
 *       200:
 *         description: Daftar kategori berhasil diambil
 *       401:
 *         description: Unauthorized
 */
router.post("/", createCategoryRules, validate, categoryController.createCategory);
router.get("/", getAllCategoriesRules, validate, categoryController.getAllCategories);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Mengambil satu kategori berdasarkan ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID Kategori
 *     responses:
 *       200:
 *         description: Kategori ditemukan
 *       404:
 *         description: Kategori tidak ditemukan
 *   put:
 *     summary: Mengupdate kategori berdasarkan ID
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
 *                 example: "Pendidikan"
 *     responses:
 *       200:
 *         description: Kategori berhasil diperbarui
 *       404:
 *         description: Kategori tidak ditemukan
 *   delete:
 *     summary: Menghapus kategori berdasarkan ID
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
 *         description: Kategori berhasil dihapus
 *       404:
 *         description: Kategori tidak ditemukan
 */
router.get("/:id", getCategoryByIdRules, validate, categoryController.getCategory);
router.put("/:id", updateCategoryRules, validate, categoryController.updateCategory);
router.delete("/:id", getCategoryByIdRules, validate, categoryController.deleteCategory);

module.exports = router;
