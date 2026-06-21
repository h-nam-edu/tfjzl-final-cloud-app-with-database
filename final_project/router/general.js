const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "Customer successfully registered. Now you can login"});
    } else {
      return res.status(409).json({message: "User already exists!"});    
    }
  } 
  return res.status(400).json({message: "Unable to register user."});
});

// Get the book list available in the shop using Promises
public_users.get('/', function (req, res) {
  new Promise((resolve, reject) => {
      resolve(books);
  })
  .then((data) => res.status(200).json(data))
  .catch((err) => res.status(500).json({message: "Error fetching books"}));
});

// Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
      if (books[isbn]) {
          resolve(books[isbn]);
      } else {
          reject("Book not found");
      }
  })
  .then((data) => res.status(200).json(data))
  .catch((err) => res.status(404).json({message: err}));
});
  
// Get book details based on author using Promises
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  new Promise((resolve, reject) => {
      let output = [];
      for (var isbn in books) {
          if (books[isbn].author === author) {
              output.push({ "isbn": isbn, ...books[isbn] });
          }
      }
      if (output.length > 0) {
          resolve(output);
      } else {
          reject("Author not found");
      }
  })
  .then((data) => res.status(200).json(data))
  .catch((err) => res.status(404).json({message: err}));
});

// Get all books based on title using Promises
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  new Promise((resolve, reject) => {
      let output = [];
      for (var isbn in books) {
          if (books[isbn].title === title) {
              output.push({ "isbn": isbn, ...books[isbn] });
          }
      }
      if (output.length > 0) {
          resolve(output);
      } else {
          reject("Title not found");
      }
  })
  .then((data) => res.status(200).json(data))
  .catch((err) => res.status(404).json({message: err}));
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
      res.status(200).json({reviews: books[isbn].reviews});
  } else {
      res.status(404).json({message: "Book not found"});
  }
});

/* ==========================================================
   AXIOS IMPLEMENTATIONS FOR TASKS 10 - 13
========================================================== */

const getAllBooksAsync = async () => {
    try {
        const response = await axios.get('http://localhost:5000/');
        console.log(response.data);
    } catch (error) {
        console.error("Error fetching books:", error.message);
    }
};

const getBookByIsbnPromise = (isbn) => {
    axios.get(`http://localhost:5000/isbn/${isbn}`)
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error("Error fetching book by ISBN:", error.message);
        });
};

const getBookByAuthorAsync = async (author) => {
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        console.log(response.data);
    } catch (error) {
        console.error("Error fetching book by author:", error.message);
    }
};

const getBookByTitleAsync = async (title) => {
    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        console.log(response.data);
    } catch (error) {
        console.error("Error fetching book by title:", error.message);
    }
};

module.exports.general = public_users;