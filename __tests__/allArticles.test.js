const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("GET /api/articles", () => {
  it("returns 200 and an array of articles with correct properties and to ensure it excludes the body property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles.length).toBe(13)
        articles.forEach((article) => {
          expect(article).toEqual({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
          expect(article).not.toEqual("body")
        });
      });
  });
  it("returns 200 and the array is in descending order of date created", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({ body }) => {
        const { articles } = body
        const dateSortedArticles = [...articles].sort((a,b) => b.created_at - a.created_at)
        expect(articles).toEqual(dateSortedArticles)
    })
  })
});
