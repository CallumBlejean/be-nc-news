const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const endpoints = require("../endpoints.json");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("GET /api", () => {
  it("returns 200 and the JSON of all available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(endpoints);
      });
  });
});

describe("GET /api/topics", () => {
  describe("GET /api/topics", () => {
    test("returns 200 and an array of topic objects, each with 'slug' and 'description' properties", () => {
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
   it("returns a 404 when given an incorrect path", () => {
        return request(app)
          .get("/api/not-a-topic")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("404: Not Found");
          });
      });
});
})


describe("GET /api/articles", () => {
  it("returns 200 and an array of articles with correct properties and to ensure it excludes the body property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles.length).toBe(13);
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
          expect(article).not.toEqual("body");
        });
      });
  });
  it("returns 200 and the array is in descending order of date created", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        const dateSortedArticles = [...articles].sort(
          (a, b) => b.created_at - a.created_at
        );
        expect(articles).toEqual(dateSortedArticles);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  it("returns 200 and with an article object with the correct properties.", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toBeInstanceOf(Object);
        expect(article).toHaveProperty("article_id");
        expect(article).toHaveProperty("title");
        expect(article).toHaveProperty("topic");
        expect(article).toHaveProperty("author");
        expect(article).toHaveProperty("body");
        expect(article).toHaveProperty("created_at");
        expect(article).toHaveProperty("votes");
        expect(article).toHaveProperty("article_img_url");
        expect(article.article_id).toEqual(1);
      });
  });
  it("returns and object where the values are the correct data type", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            article_id: expect.any(Number),
            title: expect.any(String),
            body: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          })
        );
      });
  });
  it("returns 404 if the article doesnt exist", () => {
    return request(app)
      .get("/api/articles/99999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: Article Not Found");
      });
  });
  it("returns 400 if the ID is not a number", () => {
    return request(app)
      .get("/api/articles/not-a-number")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: Bad Request");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  it("returns 200 and an array of objects with the correct properties", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Array);
        expect(comments.length).toBe(11);
        comments.forEach((comment) => {
          expect(comment).toBeInstanceOf(Object);
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("article_id");
        });
      });
  });
  it("returns the comment in descing order (most recent first)", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        const dateSortedComments = [...comments].sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );
        expect(comments).toEqual(dateSortedComments);
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  it("returns 201 and the posted comment", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is a test comment.",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            article_id: 1,
            body: "This is a test comment.",
            author: "butter_bridge",
            created_at: expect.any(String),
            votes: 0,
          })
        );
      });
  });
  it("returns 400 when missing required fields", () => {
    const newComment = { body: "This is a test comment." };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: Bad Request - Missing required fields");
      });
  });
  it("returns 404 when the article does not exist", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is a test comment.",
    };
    return request(app)
      .post("/api/articles/99999/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: Article Not Found");
      });
  });
  it("returns 400 when article_id is not a number", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is a test comment."
    };
    return request(app)
      .post("/api/articles/not-a-number/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: Bad Request");
      });
  });
  it("returns 404 when the username does not exist", () => {
    const newComment = {
      username: "nonexistent_user",
      body: "This is a test comment."
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: User Not Found");
      });
  });
});