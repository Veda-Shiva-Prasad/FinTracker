const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/index");

describe("Auth API Tests", () => {
  let authToken;

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty("token");
      expect(response.body).toHaveProperty("user");
      expect(response.body.user).toHaveProperty("name", "Test User");
      expect(response.body.user).toHaveProperty("email", "test@example.com");
      expect(response.body.user).not.toHaveProperty("password");
    });

    it("should not register user with existing email", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      // First registration
      await request(app).post("/api/auth/register").send(userData);

      // Try same email again
      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty("message", "User already exists");
    });

    it("should validate required fields", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({})
        .expect(500);

      expect(response.body).toHaveProperty("message", "Server error");
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      // Register a user first
      await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: "login@example.com",
        password: "password123",
      });
    });

    it("should login existing user successfully", async () => {
      const credentials = {
        email: "login@example.com",
        password: "password123",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(credentials)
        .expect(200);

      expect(response.body).toHaveProperty("token");
      expect(response.body).toHaveProperty("user");
      expect(response.body.user).toHaveProperty("email", "login@example.com");

      authToken = response.body.token;
    });

    it("should not login with wrong password", async () => {
      const credentials = {
        email: "login@example.com",
        password: "wrongpassword",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(credentials)
        .expect(400);

      expect(response.body).toHaveProperty("message", "Invalid credentials");
    });

    it("should not login with non-existent email", async () => {
      const credentials = {
        email: "nonexistent@example.com",
        password: "password123",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(credentials)
        .expect(400);

      expect(response.body).toHaveProperty("message", "Invalid credentials");
    });
  });

  describe("GET /api/auth/me", () => {
    beforeEach(async () => {
      // Register and login to get token
      const registerResponse = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Me Test User",
          email: "me@example.com",
          password: "password123",
        });

      authToken = registerResponse.body.token;
    });

    it("should get current user with valid token", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("user");
      expect(response.body.user).toHaveProperty("name", "Me Test User");
      expect(response.body.user).toHaveProperty("email", "me@example.com");
    });

    it("should not get user without token", async () => {
      const response = await request(app).get("/api/auth/me").expect(401);

      expect(response.body).toHaveProperty(
        "message",
        "No token, authorization denied"
      );
    });

    it("should not get user with invalid token", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalid-token")
        .expect(401);

      expect(response.body).toHaveProperty("message", "Token is not valid");
    });
  });
});
