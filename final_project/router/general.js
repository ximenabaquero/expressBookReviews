const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user doesn't already exist
    if (!isValid(username)) {
      // Add the new user to the users array
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Send JSON response with formatted books data
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let filtered_books = {};
  
  // Filter books by author
  for (let key in books) {
    if (books[key].author === author) {
      filtered_books[key] = books[key];
    }
  }
  
  res.send(filtered_books);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let filtered_books = {};
  
  // Filter books by title
  for (let key in books) {
    if (books[key].title === title) {
      filtered_books[key] = books[key];
    }
  }
  
  res.send(filtered_books);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

// Task 10: Get all books using async/await with Promise
public_users.get('/async', async function (req, res) {
  try {
    // Simulate async operation using Promise
    const getAllBooks = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(books);
      }, 1000); // Simulate delay
    });
    
    const allBooks = await getAllBooks;
    res.status(200).json(allBooks);
  } catch (error) {
    res.status(500).json({message: "Error fetching books"});
  }
});

// Task 11: Get book details based on ISBN using async/await with Promise
public_users.get('/async/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    
    // Simulate async operation using Promise
    const getBookByISBN = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (books[isbn]) {
          resolve(books[isbn]);
        } else {
          reject(new Error("Book not found"));
        }
      }, 1000); // Simulate delay
    });
    
    const book = await getBookByISBN;
    res.status(200).json(book);
  } catch (error) {
    res.status(404).json({message: error.message});
  }
});

// Task 12: Get book details based on Author using async/await with Promise
public_users.get('/async/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    
    // Simulate async operation using Promise
    const getBooksByAuthor = new Promise((resolve, reject) => {
      setTimeout(() => {
        let filtered_books = {};
        
        // Filter books by author
        for (let key in books) {
          if (books[key].author === author) {
            filtered_books[key] = books[key];
          }
        }
        
        if (Object.keys(filtered_books).length > 0) {
          resolve(filtered_books);
        } else {
          reject(new Error("No books found for this author"));
        }
      }, 1000); // Simulate delay
    });
    
    const filteredBooks = await getBooksByAuthor;
    res.status(200).json(filteredBooks);
  } catch (error) {
    res.status(404).json({message: error.message});
  }
});

// Task 13: Get book details based on Title using async/await with Promise
public_users.get('/async/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    
    // Simulate async operation using Promise
    const getBooksByTitle = new Promise((resolve, reject) => {
      setTimeout(() => {
        let filtered_books = {};
        
        // Filter books by title
        for (let key in books) {
          if (books[key].title === title) {
            filtered_books[key] = books[key];
          }
        }
        
        if (Object.keys(filtered_books).length > 0) {
          resolve(filtered_books);
        } else {
          reject(new Error("No books found with this title"));
        }
      }, 1000); // Simulate delay
    });
    
    const filteredBooks = await getBooksByTitle;
    res.status(200).json(filteredBooks);
  } catch (error) {
    res.status(404).json({message: error.message});
  }
});

module.exports.general = public_users;
