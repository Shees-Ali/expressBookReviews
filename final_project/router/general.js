const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const getAllBooks = Promise((resolve) => {
  resolve(books);
});

const getBooksByISBN = Promise((resolve) => {
  let keys = Object.keys(books);
  let isbn = req.params.isbn;
  let item = [];
  for (let i = 0; i < keys.length; i++) {
    const element = books[keys[i]];
    if (element.isbn == isbn) {
      item.push(element);
    }
  }
  resolve(item);
});

const getBooksByAuthor = Promise((resolve) => {
  let keys = Object.keys(books);
  let author = req.params.author;
  let items = [];
  for (let i = 0; i < keys.length; i++) {
    const element = books[keys[i]];
    if (element.author == author) {
      items.push(element);
    }
  }
  resolve(items);
});

const getBooksByTitle = Promise((resolve) => {
  let keys = Object.keys(books);
  let title = req.params.title;
  let items = [];
  for (let i = 0; i < keys.length; i++) {
    const element = books[keys[i]];
    if (element.title == title) {
      items.push(element);
    }
  }
  resolve(items);
});

public_users.post("/register", (req, res) => {
  const username = req.query.username;
  const password = req.query.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  let _books = await getAllBooks();
  return res.status(200).json({ books: _books });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  const item = await getBooksByISBN();
  if (item.length > 0) {
    return res.status(200).json({ message: "Success", book: item[0] });
  } else {
    return res.status(200).json({ message: "Not Found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  const items = await getBooksByAuthor();
  if (items.length > 0) {
    return res.status(200).json({ message: "Success", books: items });
  } else {
    return res.status(200).json({ message: "Not Found" });
  }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  const items = await getBooksByTitle();
  if (items.length > 0) {
    return res.status(200).json({ message: "Success", books: items });
  } else {
    return res.status(200).json({ message: "Not Found" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  let isbn = req.params.isbn;
  let keys = Object.keys(books);
  let items = [];
  for (let i = 0; i < keys.length; i++) {
    const element = books[keys[i]];
    if (element.isbn == isbn) {
      items.push(element);
    }
  }
  if (items.length > 0) {
    return res
      .status(200)
      .json({ message: "Success", reviews: items[0].reviews });
  } else {
    return res.status(200).json({ message: "Not Found" });
  }
});

module.exports.general = public_users;
