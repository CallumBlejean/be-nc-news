const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");



beforeEach(() => seed(data));
afterAll(() => db.end());

describe("GET /api/articles/:article_id", () => {
  it("will return 200 if it is a valid id", () => {
    return request(app).get("/api/articles/1").expect(200);
  });
  it("will return with an article object with the correct properties.", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toBeInstanceOf(Object);
        expect(article).toHaveProperty("title");
        expect(article).toHaveProperty("topic");
        expect(article).toHaveProperty("author");
        expect(article).toHaveProperty("body");
        expect(article).toHaveProperty("created_at");
        expect(article).toHaveProperty("votes");
        expect(article).toHaveProperty("article_img_url");
      });
  });
  it("will return 404 if the article doesnt exist", () => {
    return request(app)
    .get("/api/articles/99999")
    .expect(404)
    .then(({body}) => {
        expect(body.msg).toBe("404: Article Not Found")
    })
  })
  it("will return 400 if the ID is not a number", () => {
    return request(app)
    .get("/api/articles/not-a-number")
    .expect(400)
    .then(({body}) => {
        expect(body.msg).toBe("400: Bad Request")
    })
  })
});
