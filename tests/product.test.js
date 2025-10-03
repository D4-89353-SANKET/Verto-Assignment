import request from "supertest";
import app from "../index.js";
import db from "../db.js";

// Reset DB before each test
beforeEach(async () => {
    await db.query("DELETE FROM products");
    await db.query("ALTER TABLE products AUTO_INCREMENT = 1");
});

// Close DB after tests
afterAll(async () => {
    await db.end();
});

describe("Inventory API - Stock Operations", () => {
    let productId;

    beforeEach(async () => {
        // Insert one product with stock = 10
        const [result] = await db.query(
            "INSERT INTO products (name, description, stock_quantity, low_stock_threshold) VALUES (?, ?, ?, ?)",
            ["Test Product", "For testing", 10, 5]
        );
        productId = result.insertId;
    });

    test("Increase stock", async () => {
        const res = await request(app)
            .post(`/products/${productId}/increase`)
            .send({ quantity: 5 });

        expect(res.status).toBe(200);
        expect(res.body.stock_quantity).toBe(15);
    });

    test("Decrease stock within available quantity", async () => {
        const res = await request(app)
            .post(`/products/${productId}/decrease`)
            .send({ quantity: 3 });

        expect(res.status).toBe(200);
        expect(res.body.stock_quantity).toBe(7);
    });

    test("Decrease stock with insufficient quantity", async () => {
        const res = await request(app)
            .post(`/products/${productId}/decrease`)
            .send({ quantity: 20 });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe("Insufficient stock");
    });

    test("List low stock products", async () => {
        // Drop stock to 2
        await request(app).post(`/products/${productId}/decrease`).send({ quantity: 8 });

        const res = await request(app).get("/products/low-stock");

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].stock_quantity).toBeLessThan(res.body[0].low_stock_threshold);
    });
});
