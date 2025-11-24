const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/index");

describe("Transactions API Tests", () => {
  let authToken;
  let userId;

  beforeAll(async () => {
    // Register a user and get token
    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Transaction Test User",
        email: "transaction@example.com",
        password: "password123",
      });

    authToken = registerResponse.body.token;
    userId = registerResponse.body.user.id;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("POST /api/transactions", () => {
    it("should create a new income transaction", async () => {
      const transactionData = {
        type: "income",
        amount: 1000,
        category: "Salary",
        note: "Monthly salary",
      };

      const response = await request(app)
        .post("/api/transactions")
        .set("Authorization", `Bearer ${authToken}`)
        .send(transactionData)
        .expect(201);

      expect(response.body).toHaveProperty("_id");
      expect(response.body.type).toBe("income");
      expect(response.body.amount).toBe(1000);
      expect(response.body.category).toBe("Salary");
      expect(response.body.note).toBe("Monthly salary");
      expect(response.body.userId).toBe(userId);
    });

    it("should create a new expense transaction", async () => {
      const transactionData = {
        type: "expense",
        amount: 50,
        category: "Food",
        note: "Lunch",
      };

      const response = await request(app)
        .post("/api/transactions")
        .set("Authorization", `Bearer ${authToken}`)
        .send(transactionData)
        .expect(201);

      expect(response.body.type).toBe("expense");
      expect(response.body.amount).toBe(50);
      expect(response.body.category).toBe("Food");
    });

    it("should not create transaction without authentication", async () => {
      const transactionData = {
        type: "income",
        amount: 100,
        category: "Test",
      };

      const response = await request(app)
        .post("/api/transactions")
        .send(transactionData)
        .expect(401);

      expect(response.body).toHaveProperty(
        "message",
        "No token, authorization denied"
      );
    });

    it("should validate transaction required fields", async () => {
      const response = await request(app)
        .post("/api/transactions")
        .set("Authorization", `Bearer ${authToken}`)
        .send({})
        .expect(500);

      expect(response.body).toHaveProperty("message", "Server error");
    });
  });

  describe("GET /api/transactions", () => {
    beforeEach(async () => {
      // Create some test transactions
      await request(app)
        .post("/api/transactions")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          type: "income",
          amount: 500,
          category: "Freelance",
        });

      await request(app)
        .post("/api/transactions")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          type: "expense",
          amount: 30,
          category: "Transport",
        });
    });

    it("should get all transactions for authenticated user", async () => {
      const response = await request(app)
        .get("/api/transactions")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // Check if transactions belong to the user
      response.body.forEach((transaction) => {
        expect(transaction.userId).toBe(userId);
      });
    });

    it("should not get transactions without authentication", async () => {
      const response = await request(app).get("/api/transactions").expect(401);

      expect(response.body).toHaveProperty(
        "message",
        "No token, authorization denied"
      );
    });
  });

  describe("PUT /api/transactions/:id", () => {
    let transactionId;

    beforeEach(async () => {
      // Create a transaction to update
      const response = await request(app)
        .post("/api/transactions")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          type: "expense",
          amount: 25,
          category: "Entertainment",
          note: "Movie",
        });

      transactionId = response.body._id;
    });

    it("should update an existing transaction", async () => {
      const updateData = {
        amount: 30,
        note: "Movie and snacks",
      };

      const response = await request(app)
        .put(`/api/transactions/${transactionId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.amount).toBe(30);
      expect(response.body.note).toBe("Movie and snacks");
      expect(response.body._id).toBe(transactionId);
    });

    it("should not update non-existent transaction", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .put(`/api/transactions/${fakeId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ amount: 100 })
        .expect(404);

      expect(response.body).toHaveProperty("message", "Transaction not found");
    });
  });

  describe("DELETE /api/transactions/:id", () => {
    let transactionId;

    beforeEach(async () => {
      // Create a transaction to delete
      const response = await request(app)
        .post("/api/transactions")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          type: "income",
          amount: 100,
          category: "Bonus",
        });

      transactionId = response.body._id;
    });

    it("should delete an existing transaction", async () => {
      const response = await request(app)
        .delete(`/api/transactions/${transactionId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("message", "Transaction deleted");

      // Verify it's actually deleted
      const getResponse = await request(app)
        .get("/api/transactions")
        .set("Authorization", `Bearer ${authToken}`);

      const deletedTransaction = getResponse.body.find(
        (t) => t._id === transactionId
      );
      expect(deletedTransaction).toBeUndefined();
    });

    it("should not delete non-existent transaction", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .delete(`/api/transactions/${fakeId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty("message", "Transaction not found");
    });
  });
});
