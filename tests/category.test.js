const request = require("supertest");
const app = require("../src/app");
const Category = require("../src/models/category.model");
const Log = require("../src/models/log.model");

const FAKE_ID = "665f1c2e8b1e2a1a2c3d9999";

async function registerAndLogin(email = "budi@example.com") {
    await request(app).post("/api/auth/register").send({
        name: "Budi",
        email,
        password: "rahasia123",
    });

    const loginRes = await request(app).post("/api/auth/login").send({
        email,
        password: "rahasia123",
    });

    return loginRes.body.data.token;
}

function createCategory(token, payload = { name: "Teknologi" }) {
    return request(app)
    .post("/api/categories")
    .set("Authorization", `Bearer ${token}`)
    .send(payload);
}

describe("Category Endpoints", () => {
    let token;

    beforeAll(async () => {
        // Pastikan unique index pada field `name` sudah terbentuk sebelum test duplikat
        await Category.init();
    });

    beforeEach(async () => {
        token = await registerAndLogin();
    });

    describe("POST /api/categories", () => {
        it("should create a new category when authenticated", async () => {
            const res = await createCategory(token, {
                name: "Teknologi",
                description: "Kategori seputar teknologi",
            });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Category created successfully");
            expect(res.body.data.name).toBe("Teknologi");
            expect(res.body.data.description).toBe("Kategori seputar teknologi");
            expect(res.body.data.archived).toBe(false);
            expect(res.body.data.created_by).toBeDefined();
        });

        it("should default description to an empty string", async () => {
            const res = await createCategory(token, { name: "Tanpa Deskripsi" });

            expect(res.statusCode).toBe(201);
            expect(res.body.data.description).toBe("");
        });

        it("should trim whitespace around the name", async () => {
            const res = await createCategory(token, { name: "  Pendidikan  " });

            expect(res.statusCode).toBe(201);
            expect(res.body.data.name).toBe("Pendidikan");
        });

        it("should reject creating category without authentication", async () => {
            const res = await request(app)
            .post("/api/categories")
            .send({ name: "Tanpa token" });

            expect(res.statusCode).toBe(401);
        });

        it("should reject when name is missing", async () => {
            const res = await createCategory(token, { description: "Tanpa nama" });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toMatch(/required/i);
        });

        it("should reject duplicate category name", async () => {
            await createCategory(token, { name: "Teknologi" });
            const res = await createCategory(token, { name: "Teknologi" });

            expect(res.statusCode).toBe(409);
        });

        it("should record a CREATE_CATEGORY activity log", async () => {
            await createCategory(token, { name: "Teknologi" });

            const log = await Log.findOne({ action: "CREATE_CATEGORY" });

            expect(log).not.toBeNull();
            expect(log.description).toContain("Teknologi");
        });
    });

    describe("GET /api/categories", () => {
        it("should reject without authentication", async () => {
            const res = await request(app).get("/api/categories");

            expect(res.statusCode).toBe(401);
        });

        it("should return paginated categories", async () => {
            for (let i = 1; i <= 3; i++) {
                await createCategory(token, { name: `Kategori ${i}` });
            }

            const res = await request(app)
            .get("/api/categories?page=1&limit=2")
            .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Categories retrieved successfully");
            expect(res.body.data.length).toBe(2);
            expect(res.body.pagination.totalDocs).toBe(3);
            expect(res.body.pagination.totalPages).toBe(2);
            expect(res.body.pagination.currentPage).toBe(1);
            expect(res.body.pagination.limit).toBe(2);
        });

        it("should filter categories by search keyword", async () => {
            await createCategory(token, { name: "Teknologi" });
            await createCategory(token, { name: "Pendidikan" });

            const res = await request(app)
            .get("/api/categories?search=Tekno")
            .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.data.length).toBe(1);
            expect(res.body.data[0].name).toBe("Teknologi");
        });

        it("should sort categories by name", async () => {
            await createCategory(token, { name: "Charlie" });
            await createCategory(token, { name: "Alpha" });
            await createCategory(token, { name: "Bravo" });

            const res = await request(app)
            .get("/api/categories?sortBy=name&order=asc")
            .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.data.map((c) => c.name)).toEqual(["Alpha", "Bravo", "Charlie"]);
        });
    });

    describe("GET /api/categories/:id", () => {
        it("should return a category by id", async () => {
            const createRes = await createCategory(token, { name: "Teknologi" });
            const id = createRes.body.data._id;

            const res = await request(app)
            .get(`/api/categories/${id}`)
            .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Category retrieved successfully");
            expect(res.body.data._id).toBe(id);
            expect(res.body.data.name).toBe("Teknologi");
        });

        it("should return 404 for a non-existent category", async () => {
            const res = await request(app)
            .get(`/api/categories/${FAKE_ID}`)
            .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toMatch(/not found/i);
        });

        it("should return 400 for an invalid id format", async () => {
            const res = await request(app)
            .get("/api/categories/abc")
            .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toMatch(/invalid category id/i);
        });

        it("should reject without authentication", async () => {
            const res = await request(app).get(`/api/categories/${FAKE_ID}`);

            expect(res.statusCode).toBe(401);
        });
    });

    describe("PUT /api/categories/:id", () => {
        it("should update a category", async () => {
            const createRes = await createCategory(token, { name: "Teknologi" });
            const id = createRes.body.data._id;

            const res = await request(app)
            .put(`/api/categories/${id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Pendidikan",
                description: "Materi pembelajaran",
                archived: true,
            });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Category updated successfully");
            expect(res.body.data.name).toBe("Pendidikan");
            expect(res.body.data.description).toBe("Materi pembelajaran");
            expect(res.body.data.archived).toBe(true);
        });

        it("should keep existing fields when only some are provided", async () => {
            const createRes = await createCategory(token, {
                name: "Teknologi",
                description: "Deskripsi awal",
            });
            const id = createRes.body.data._id;

            const res = await request(app)
            .put(`/api/categories/${id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ archived: true });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.name).toBe("Teknologi");
            expect(res.body.data.description).toBe("Deskripsi awal");
            expect(res.body.data.archived).toBe(true);
        });

        it("should record an UPDATE_CATEGORY activity log", async () => {
            const createRes = await createCategory(token, { name: "Teknologi" });
            const id = createRes.body.data._id;

            await request(app)
            .put(`/api/categories/${id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Pendidikan" });

            const log = await Log.findOne({ action: "UPDATE_CATEGORY" });

            expect(log).not.toBeNull();
            expect(log.description).toContain("Pendidikan");
        });

        it("should reject an empty name", async () => {
            const createRes = await createCategory(token, { name: "Teknologi" });
            const id = createRes.body.data._id;

            const res = await request(app)
            .put(`/api/categories/${id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "" });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toMatch(/cannot be empty/i);
        });

        it("should reject renaming to a name used by another category", async () => {
            await createCategory(token, { name: "Teknologi" });
            const createRes = await createCategory(token, { name: "Pendidikan" });
            const id = createRes.body.data._id;

            const res = await request(app)
            .put(`/api/categories/${id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Teknologi" });

            expect(res.statusCode).toBe(409);
        });

        it("should return 404 when updating a non-existent category", async () => {
            const res = await request(app)
            .put(`/api/categories/${FAKE_ID}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Tidak ada" });

            expect(res.statusCode).toBe(404);
        });

        it("should return 400 for an invalid id format", async () => {
            const res = await request(app)
            .put("/api/categories/abc")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Pendidikan" });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toMatch(/invalid category id/i);
        });

        it("should reject without authentication", async () => {
            const res = await request(app)
            .put(`/api/categories/${FAKE_ID}`)
            .send({ name: "Tanpa token" });

            expect(res.statusCode).toBe(401);
        });
    });

    describe("DELETE /api/categories/:id", () => {
        it("should delete a category", async () => {
            const createRes = await createCategory(token, { name: "Teknologi" });
            const id = createRes.body.data._id;

            const res = await request(app)
            .delete(`/api/categories/${id}`)
            .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Category deleted successfully");
            expect(res.body.data).toBeNull();

            const getRes = await request(app)
            .get(`/api/categories/${id}`)
            .set("Authorization", `Bearer ${token}`);

            expect(getRes.statusCode).toBe(404);
        });

        it("should record a DELETE_CATEGORY activity log", async () => {
            const createRes = await createCategory(token, { name: "Teknologi" });
            const id = createRes.body.data._id;

            await request(app)
            .delete(`/api/categories/${id}`)
            .set("Authorization", `Bearer ${token}`);

            const log = await Log.findOne({ action: "DELETE_CATEGORY" });

            expect(log).not.toBeNull();
            expect(log.description).toContain("Teknologi");
        });

        it("should return 404 when deleting a non-existent category", async () => {
            const res = await request(app)
            .delete(`/api/categories/${FAKE_ID}`)
            .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(404);
        });

        it("should return 400 for an invalid id format", async () => {
            const res = await request(app)
            .delete("/api/categories/abc")
            .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(400);
        });

        it("should reject without authentication", async () => {
            const res = await request(app).delete(`/api/categories/${FAKE_ID}`);

            expect(res.statusCode).toBe(401);
        });
    });
});
