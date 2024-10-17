# Northcoders News API
It is deployed online at https://be-nc-news-yg12.onrender.com/

This is a RESTful API that provides endpoints for managing articles, comments, topics, and users. It's designed to showcase CRUD operations and database interactions with PostgreSQL.

# To run this locally:

1. git clone https://github.com/CallumBlejean/be-nc-news

2. cd into the repo

3. Install the required dependencies.
 - npm i

4. Seed the local database
 - npm run setup-dbs
 - npm run seed

5. In the root of the project, create two .env files: .env.test and .env.development.
- Add the following to each file:

   - **.env.test**:
     ```
     PGDATABASE=<your_test_database_name>
     ```

   - **.env.development**:
     ```
     PGDATABASE=<your_development_database_name>
     ```
6. To run the tests use
 - npm test

7. The mimimum versions required are
 - Node.js: 14.x or higher
 - PostgreSQL: 10.x or higher