//Without using Lodash's `memoize` function

/*
const express = require("express");
const _ = require("lodash");
const axios = require('axios');

// Create an Express app
const app = express();

// Define the route for blog statistics
app.get("/api/blog-stats", async (req, res) => {
  try {
    // Make the HTTP request to fetch the blog data
    const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', {
      headers: {
        'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'
      }
    });

    // Get the blogs from the response data
    const blogs = response.data;

    // Perform the data analysis using Lodash
    // Calculate the total number of blogs fetched
    const totalBlogs = blogs.length;

    // Find the blog with the longest title
    const longestBlog = _.maxBy(blogs, (blog) => blog.title ? blog.title.length : 0);

    // Determine the number of blogs with titles containing the word "privacy"
    const privacyBlogs = _.filter(blogs, (blog) =>
      blog.title && blog.title.toLowerCase().includes("privacy")
    ).length;

    // Create an array of unique blog titles (no duplicates)
    const uniqueTitles = _.uniqBy(blogs, "title").map((blog) => blog.title);

    // Respond to the client with a JSON object containing the statistics
    res.json({
      totalBlogs,
      longestBlogTitle: longestBlog ? longestBlog.title : '',
      privacyBlogs,
      uniqueTitles,
    });
  } catch (error) {
    // Handle any errors that may occur during the data retrieval or analysis process
    res.status(500).send(error.message);
  }
});

// Define the route for blog search
app.get("/api/blog-search", async (req, res) => {
  try {
    // Get the query parameter from the request
    const query = req.query.query;

    // Make the HTTP request to fetch the blog data
    const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', {
      headers: {
        'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'
      }
    });

    // Get the blogs from the response data
    const blogs = response.data;

    // Implement a search functionality that filters the blogs based on the query string (case-insensitive)
    const searchResults = _.filter(blogs, (blog) =>
    blog.title && query && blog.title.toLowerCase().includes(query.toLowerCase())
  );
  

    // Respond to the client with a JSON array containing the search results
    res.json(searchResults);
  } catch (error) {
    // Handle any errors that may occur during the data retrieval or search process
    res.status(500).send(error.message);
  }
});

// Start the app on port 3000
app.listen(3000, () => {
  console.log("App is running on port 3000");
});
*/





//**Bonus Challenge**: Implement a caching mechanism using Lodash's `memoize` function

const express = require("express");
const _ = require("lodash");
const axios = require('axios');
const memoize = require('lodash.memoize');


const app = express();

// Define a function to fetch and process blog data
const getBlogStats = async () => {
  // Make the HTTP request to fetch the blog data
  const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', {
    headers: {
      'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'
    }
  });

 
  const blogs = response.data;

  // Perform the data analysis using Lodash
 
  const totalBlogs = blogs.length;

  // Find the blog with the longest title
  const longestBlog = _.maxBy(blogs, (blog) => blog.title ? blog.title.length : 0);

  // Determine the number of blogs with titles containing the word "privacy"
  const privacyBlogs = _.filter(blogs, (blog) =>
    blog.title && blog.title.toLowerCase().includes("privacy")
  ).length;

  // Create an array of unique blog titles (no duplicates)
  const uniqueTitles = _.uniqBy(blogs, "title").map((blog) => blog.title);

  return {
    totalBlogs,
    longestBlogTitle: longestBlog ? longestBlog.title : '',
    privacyBlogs,
    uniqueTitles,
  };
};

// Create a memoized version of getBlogStats
const memoizedGetBlogStats = memoize(getBlogStats);

// Define the route for blog statistics
app.get("/api/blog-stats", async (req, res) => {
  try {
    // Use the memoized function to get the blog stats
    const stats = await memoizedGetBlogStats();

   
    res.json(stats);
  } catch (error) {
    
    res.status(500).send(error.message);
  }
});

// Define a function to fetch and process blog data
const getBlogSearchResults = async (query) => {
    
    const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', {
      headers: {
        'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'
      }
    });
  
  
    const blogs = response.data;
  
    // Implement a search functionality that filters the blogs based on the query string (case-insensitive)
    const searchResults = _.filter(blogs, (blog) =>
      blog.title && query && blog.title.toLowerCase().includes(query.toLowerCase())
    );
  
    return searchResults;
  };
  
  // Create a memoized version of getBlogSearchResults
  // The resolver function generates a unique cache key for each query
  const memoizedGetBlogSearchResults = memoize(getBlogSearchResults, (query) => query);
  
  
  app.get("/api/blog-search", async (req, res) => {
    try {
      // Get the query parameter from the request
      const query = req.query.query;
  
      // Use the memoized function to get the search results
      const results = await memoizedGetBlogSearchResults(query);
  
    
      res.json(results);
    } catch (error) {

      res.status(500).send(error.message);
    }
  });
  


app.listen(3000, () => {
  console.log("App is running on port 3000");
});
