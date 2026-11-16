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
 *               description:
 *                 type: string
 *                 example: "Kategori seputar dunia teknologi dan programming"
 *     responses:
 *       201:
 *         description: Kategori berhasil dibuat
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
 *         description: Validasi gagal (misal nama kosong)
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Nama kategori sudah ada
 *   get:
 *     summary: Mengambil daftar kategori (dengan pagination & search)
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
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Kata kunci pencarian berdasarkan nama kategori
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, name]
 *         description: Field acuan sorting
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Urutan sorting
 *     responses:
 *       200:
 *         description: Daftar kategori berhasil diambil
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
 *               description:
 *                 type: string
 *                 example: "Kategori materi pembelajaran"
 *               archived:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Kategori berhasil diperbarui
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
 *         description: Validasi gagal (nama kosong atau format ID tidak valid)
 *       404:
 *         description: Kategori tidak ditemukan
 *       409:
 *         description: Nama kategori sudah dipakai kategori lain
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
