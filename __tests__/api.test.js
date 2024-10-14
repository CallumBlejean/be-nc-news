const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("GET /api", () => {
    it("will return 200 status code", () => {
        return request(app)
        .get("/api")
        .expect(200);
    })
    it("will return 200 and the JSON of all available endpoints", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
            expect(body).toHaveProperty("GET /api")
            expect(body).toHaveProperty("GET /api/topics")
            expect(body).toHaveProperty("GET /api/articles")
        })
    });
  });