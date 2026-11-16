const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user.model");
const Log = require("../src/models/log.model");

/**
 */
async function registerAndLogin(email, role = "user") {
    await request(app).post("/api/auth/register").send({
        name: role === "admin" ? "Admin" : "User",
        email,
        password: "rahasia123",
    });

    if (role !== "user") {
        await User.updateOne({ email }, { role });
    }

    const loginRes = await request(app).post("/api/auth/login").send({
        email,
        password: "rahasia123",
    });

    const user = await User.findOne({ email });

    return { token: loginRes.body.data.token, userId: user._id.toString() };
}

/**
 */
async function seedLogs(userId, label, count) {
    for (let i = 1; i <= count; i++) {
        await Log.create({
            user: userId,
            action: `SEED_${label}_${i}`,
            description: `Log seed ${label} ke-${i}`,
            createdAt: new Date(Date.UTC(2026, 0, 1, 0, 0, i)),
        });
    }
}

const seedOnly = (logs, label) =>
    logs.filter((log) => log.action.startsWith(`SEED_${label}_`));

describe("Log Endpoints", () => {
    let userA;
    let userB;
    let admin;

    beforeEach(async () => {
        userA = await registerAndLogin("budi@example.com");
        userB = await registerAndLogin("siti@example.com");
        admin = await registerAndLogin("admin@example.com", "admin");
    });

    describe("GET /api/logs", () => {
        it("should reject without authentication", async () => {
            const res = await request(app).get("/api/logs");

            expect(res.statusCode).toBe(401);
        });

        it("should return only the logged-in user's own logs for a regular user", async () => {
            await seedLogs(userA.userId, "A", 2);
            await seedLogs(userB.userId, "B", 2);

            const res = await request(app)
            .get("/api/logs?limit=100")
            .set("Authorization", `Bearer ${userA.token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Activity logs retrieved successfully");
            expect(res.body.data.length).toBeGreaterThanOrEqual(2);

            res.body.data.forEach((log) => {
                expect(log.user._id).toBe(userA.userId);
            });

            expect(seedOnly(res.body.data, "A").length).toBe(2);
            expect(seedOnly(res.body.data, "B").length).toBe(0);
        });

        it("should return logs from all users for an admin", async () => {
            await seedLogs(userA.userId, "A", 2);
            await seedLogs(userB.userId, "B", 2);

            const res = await request(app)
            .get("/api/logs?limit=100")
            .set("Authorization", `Bearer ${admin.token}`);

            expect(res.statusCode).toBe(200);
            expect(seedOnly(res.body.data, "A").length).toBe(2);
            expect(seedOnly(res.body.data, "B").length).toBe(2);
        });

        it("should populate the user's name, email and role", async () => {
            await seedLogs(userA.userId, "A", 1);

            const res = await request(app)
            .get("/api/logs?limit=100")
            .set("Authorization", `Bearer ${userA.token}`);

            const [log] = seedOnly(res.body.data, "A");

            expect(log.user.email).toBe("budi@example.com");
            expect(log.user.role).toBe("user");
            expect(log.user.name).toBeDefined();
            expect(log.user.password).toBeUndefined();
        });

        it("should paginate results", async () => {
            await seedLogs(userA.userId, "A", 5);
            const total = await Log.countDocuments({ user: userA.userId });

            const res = await request(app)
            .get("/api/logs?page=2&limit=2")
            .set("Authorization", `Bearer ${userA.token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.data.length).toBe(2);
            expect(res.body.pagination.totalDocs).toBe(total);
            expect(res.body.pagination.totalPages).toBe(Math.ceil(total / 2));
            expect(res.body.pagination.currentPage).toBe(2);
            expect(res.body.pagination.limit).toBe(2);
        });

        it("should use default pagination (page 1, limit 20)", async () => {
            await seedLogs(userA.userId, "A", 1);

            const res = await request(app)
            .get("/api/logs")
            .set("Authorization", `Bearer ${userA.token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.pagination.currentPage).toBe(1);
            expect(res.body.pagination.limit).toBe(20);
        });

        it("should sort by createdAt descending by default", async () => {
            await seedLogs(userA.userId, "A", 3);

            const res = await request(app)
            .get("/api/logs?limit=100")
            .set("Authorization", `Bearer ${userA.token}`);

            const actions = seedOnly(res.body.data, "A").map((log) => log.action);

            expect(actions).toEqual(["SEED_A_3", "SEED_A_2", "SEED_A_1"]);
        });

        it("should sort ascending when order=asc", async () => {
            await seedLogs(userA.userId, "A", 3);

            const res = await request(app)
            .get("/api/logs?limit=100&order=asc")
            .set("Authorization", `Bearer ${userA.token}`);

            const actions = seedOnly(res.body.data, "A").map((log) => log.action);

            expect(actions).toEqual(["SEED_A_1", "SEED_A_2", "SEED_A_3"]);
        });

        it("should include logs generated by category activity", async () => {
            await request(app)
            .post("/api/categories")
            .set("Authorization", `Bearer ${userA.token}`)
            .send({ name: "Teknologi" });

            const res = await request(app)
            .get("/api/logs?limit=100")
            .set("Authorization", `Bearer ${userA.token}`);

            const log = res.body.data.find((l) => l.action === "CREATE_CATEGORY");

            expect(log).toBeDefined();
            expect(log.description).toContain("Teknologi");
            expect(log.user.email).toBe("budi@example.com");
        });
    });
});
