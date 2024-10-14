const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("GET /api/topics", () => {
  it("will return StatusCode(200)", () => {
    return request(app).get("/api/topics").expect(200);
  });
  describe("GET /api/topics", () => {
    test("will return an array of topic objects, each with 'slug' and 'description' properties", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body.topics).toBeInstanceOf(Array);
          body.topics.forEach((topic) => {
            expect(topic).toHaveProperty("slug")
            expect(topic).toHaveProperty("description")
          });
        });
    });
   it("will return a 404 when given an incorrect path", () => {
        return request(app)
          .get("/api/not-a-topic")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("404: Not Found");
          });
      });
});
})

//edit for jay