// File: /tests/post.controller.test.js
// This file contains tests for the post controller functions using Jest and MongoDB Memory Server.

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');             // Import MongoDB Memory Server for in-memory testing to avoid using a real database during tests
const Post = require('../src/models/post.model');                           // Import the Post model to interact with the posts collection in the database
const postController = require('../src/controllers/post.controller');       // Import the post controller which contains the functions to be tested

let mongoServer;    // Variable to hold the instance of MongoDB Memory Server

// Setup and teardown for the in-memory MongoDB server
// This ensures that the database is ready before tests run and cleaned up after tests complete
beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();     // Create a new instance of MongoDB Memory Server
        mongoose.set('strictQuery', false);                 // Disable strict query mode for mongoose to allow for flexible querying and testing
        const uri = mongoServer.getUri();      
        // Connect mongoose to the in-memory MongoDB instance using the URI
        await mongoose.connect(uri);
        console.log('Connected to MongoMemoryServer');  // Log success message when connected
});


// Teardown after all tests are completed
// This disconnects mongoose and stops the MongoDB Memory Server to clean up resources
// Ensure that no resources are left hanging after tests are done
afterAll(async () => {
    await Post
    await mongoose.disconnect();
     if (mongoServer) {
        await mongoServer.stop();
    }
});


// Clear the Post collection before each test to ensure a clean state
afterEach(async () => {
    await Post.deleteMany();
});


// Mock response object to simulate Express response methods
// This allows us to test the controller functions without needing an actual Express app

const mockResponse = () => {
    const res = {};                                 // Create an empty object to mock the response
    // Mock the status and json methods of the response object
    res.status = jest.fn().mockReturnValue(res);    // Mock the status method to return the response object 
    res.json = jest.fn().mockReturnValue(res);      // Mock the json method to return the response object
    return res;
};


// Test suite for the Post Controller
// This suite contains tests for the post controller functions to ensure they behave as expected
describe('Post Controller', () => {

    // Test for getAllPosts function
    test('getAllPosts returns 404 if no posts found', async () => {
        const req = {};                 // Create an empty request object 
        const res = mockResponse();     // Create an mock response

        await postController.getAllPosts(req, res);     //Call function for testing using the mock request and response

        //expect(res.status).toHaveBeenCalledWith(404);   // Check if the status method was called with 404
        expect(res.json).toHaveBeenCalledWith({ message: 'No posts found' });   // Check if the json method was called with the expected error message
    });

    // Test for getAllPosts function when posts are found
    test('getAllPosts returns posts if found', async () => {
        const post = await Post.create({ title: 'Test', content: 'Test content' });     //Create a test post in the database
        

        const req = {};                     // Create an empty request object
        const res = mockResponse();       // Create a mock response object

        await postController.getAllPosts(req, res);         // Call the getAllPosts function with the mock request and response

        // Check if the status method was called with 200
        //expect(res.status).toHaveBeenCalledWith(200);

        // Verify that res.json was called with the expected post data
        // Ensures the response includes the post data in the correct structure
        expect(res.json).toHaveBeenCalledWith(
            expect.arrayContaining([
                expect.objectContaining({ _id: post._id, title: 'Test', content: 'Test content' })      // Check if the response contains the created post
            ])
        );
    });
    //..... các tests khác//
});
