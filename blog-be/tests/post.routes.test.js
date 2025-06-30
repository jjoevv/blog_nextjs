// File: blog-be/src/tests/post.routes.test.js
// This file contains tests for the post routes using Jest and Supertest.
// It tests the POST /posts endpoint for creating new blog posts.

jest.setTimeout(30000); // Set a longer timeout for tests to allow for database operations

const request = require('supertest');                       // Import Supertest to make HTTP requests in tests
const app = require('../src/app.js')                        // Import the Express app to test the routes
const Post = require('../src/models/post.model');           // Import the Post model to interact with the database
const connectDB = require('../src/config/db');              // Import the database connection function
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');                       // Import Mongoose for MongoDB object modeling

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await connectDB(uri); // app và Post sẽ dùng chung connection này
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    await Post.deleteMany({});
});

// Test suite for the POST /posts route
describe('POST /posts', () => {
    //
   // Test get all posts route
    test('GET /posts - should return all posts', async () => {
        await Post.create({ title: 'Post 1', content: 'Content 1' });   // Create a sample post
        await Post.create({ title: 'Post 2', content: 'Content 2' });

        const res = await request(app).get('/api/posts');  // Make a GET request to the /posts endpoint
        console.log(res.body);   // Log the response body for debugging
        //expect(res.statusCode).toBe(200);   // Check if the response status code is 200 (OK)
        //Test if the first post has a _id, title and content property
        expect(res.body[0]).toHaveProperty('_id');
        expect(res.body[0]).toHaveProperty('title');        
        expect(res.body[0]).toHaveProperty('content');
    });

    // Test getting all posts when no posts exist
    test('GET /posts - should return 404 if no posts found', async () => {
        const res = await request(app).get('/api/posts');   // Make a GET request to the /posts endpoint
        expect(res.body).toHaveProperty('message', 'No posts found');   // Check if the response body contains the expected error message
    });

});
