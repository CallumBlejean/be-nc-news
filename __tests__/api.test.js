const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const endpoints = require("../endpoints.json");

beforeEach(() => seed(data));
afterAll(() => db.end());

//sql injection test
describe("SQL Injection Test", () => {
  it("returns 400 and will prevent SQL injection through sort_by parameter", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at; DROP TABLE articles;")
      .expect(400) 
      .then(({body}) => {
        expect(body.msg).toBe("400: Invalid sort_by Query");
      });
  });

  it("returns 400 and will prevent SQL injection through order parameter", () => {
    return request(app)
      .get("/api/articles?order=asc; DROP TABLE articles;")
      .expect(400) 
      .then(({body}) => {
        expect(body.msg).toBe("400: Invalid order Query");
      });
  });
});
//sql injection test


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
  test("returns 200 and an array of topic objects, each with 'slug' and 'description' properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toBeInstanceOf(Array);
        body.topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
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
  describe("ADDITIONAL TESTS - GET /api/articles(sorting queries)", () => {
    it("returns 200 and sorts articles by votes in ascending order", () => {
      return request(app)
        .get("/api/articles?sort_by=votes&order=asc")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          const sortedArticles = [...articles].sort((a, b) => a.votes - b.votes);
          expect(articles).toEqual(sortedArticles)
        });
    });
  
    it("returns 400 for an invalid sort_by value", () => {
      return request(app)
        .get("/api/articles?sort_by=invalidColumn")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("400: Invalid sort_by Query");
        });
    });
  
    it("returns 400 for an invalid order value", () => {
      return request(app)
        .get("/api/articles?order=invalidOrder")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("400: Invalid order Query");
        });
    });
    it("returns 200 and sorts articles by votes in ascending order with a valid topic", () => {
      return request(app)
      .get("/api/articles?sort_by=votes&order=asc&topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        articles.forEach((article) => {
          expect(article.topic).toBe("mitch")
        })
          const sortedArticles = [...articles].sort((a, b) => a.votes - b.votes);
          expect(articles).toEqual(sortedArticles)
          
      })
    })
    it("returns 404 for an return of 0 results for that topic", () => {
      return request(app)
      .get("/api/articles?sort_by=votes&order=asc&topic=callum")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: No Articles Found for Specified Topic")
      })
    })
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
        expect(body.msg).toBe("400: Bad Request");
      });
  });
  it("returns 400 when article_id is not a number", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is a test comment.",
    };
    return request(app)
      .post("/api/articles/not-a-number/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: Bad Request");
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
        expect(body.msg).toBe("404: Article or User Not Found");
      });
  });
  it("returns 404 when the username does not exist", () => {
    const newComment = {
      username: "nonexistent_user",
      body: "This is a test comment.",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: Article or User Not Found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  it("returns 200 and updates the article's votes, incrementing by the provided value", () => {
    const updateVotes = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/1")
      .send(updateVotes)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            article_id: 1,
            votes: expect.any(Number),
          })
        );
        expect(body.article.votes).toBe(110);
      });
  });
  it("returns 200 and updates the article's votes, decrementing by the provided value", () => {
    const updateVotes = { inc_votes: -20 };
    return request(app)
      .patch("/api/articles/1")
      .send(updateVotes)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            article_id: 1,
            votes: expect.any(Number),
          })
        );
        expect(body.article.votes).toBe(80);
      });
  });
  it("returns 400 when inc_votes is not a number", () => {
    const updateVotes = { inc_votes: "not-a-number" };
    return request(app)
      .patch("/api/articles/1")
      .send(updateVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: Bad Request");
      });
  });
  it("returns 400 when article_id is not a valid number", () => {
    const updateVotes = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/not-a-number")
      .send(updateVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: Bad Request");
      });
  });
  it("returns 400 when the request body is empty", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: Bad Request");
      });
  });
  it("returns 404 when the article does not exist", () => {
    const updateVotes = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/99999")
      .send(updateVotes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: Article Not Found");
      });
  });
});
describe("DELETE /api/comments/:comment_id", () => {
  it("removes a comment by comment id", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(() => {
        return db.query(`
        SELECT * FROM comments
        WHERE comment_id = 1
        `);
      })
      .then((result) => {
        expect(result.rows.length).toBe(0);
      });
  });
  it("returns 404 when the comment_id does not exist", () => {
    return request(app)
      .delete("/api/comment/99999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: Not Found");
      });
  });
  it("returns 400 when the comment_id is not a number", () => {
    return request(app)
      .delete("/api/comments/not-a-number")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: Bad Request");
      });
  });
});
describe("GET /api/users", () => {
  it("returns 200 and an array of objects with username, name and avatar_url properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Array);
        body.forEach((user) => {
          expect(user).toHaveProperty("username", expect.any(String));
          expect(user).toHaveProperty("name", expect.any(String));
          expect(user).toHaveProperty("avatar_url", expect.any(String));
        });
      });
  });
  
});
