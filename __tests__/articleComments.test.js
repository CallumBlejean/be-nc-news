const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("GET /api/articles/:article_id/comments",() => {
    it("returns a successfull test", () => {
        const key = 1
        expect(key).toBe(1)
    })
})
