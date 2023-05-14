const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

regd_users.post("/login", (req, res) => {
  const username = req.query.username;
  const password = req.query.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "fingerprint_customer",
      { expiresIn: "2 days" }
    );
    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const review = req.query.review;
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  let keys = Object.keys(books);

  for (let i = 0; i < keys.length; i++) {
    const element = books[keys[i]];
    if (element.isbn == isbn) {
      const index = element.reviews.findIndex((x) => x.username == username);
      if (index == -1) {
        element.reviews.push({
          review,
          username,
        });
        return res.status(200).json({ message: "Success, Review Added" });
      } else {
        element.reviews[index].review = review;
        return res.status(200).json({ message: "Success, Review Updated" });
      }
    } else {
      return res.status(404).json({ message: "Book Does Not Exist" });
    }
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  let keys = Object.keys(books);

  for (let i = 0; i < keys.length; i++) {
    const element = books[keys[i]];
    if (element.isbn == isbn) {
      const index = element.reviews.findIndex((x) => x.username == username);
      if (index == -1) {
        return res.status(200).json({ message: "Review Doesn't Exist" });
      } else {
        element.reviews.splice(index, 1);
        return res.status(200).json({ message: "Success, Review Deleted" });
      }
    } else {
      return res.status(404).json({ message: "Book Does Not Exist" });
    }
  }
})
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
