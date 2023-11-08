require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

const mongoose = require("mongoose");

const Entry = require("./models/entry");

// Enable CORS for all routes
app.use(cors());

// Serve static files from the "public" directory
app.use(express.static("dist"));

// Use JSON parser middleware
app.use(express.json());

// Morgan Middleware for logging
morgan.token("post-data", function (req) {
  return req.method === "POST" ? JSON.stringify(req.body) : "";
});
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :post-data"
  )
);

// Sample phonebook entries
let entries = [];

// Route to retrieve all phonebook entries
app.get("/api/entries", (req, res) => {
  Entry.find({}).then((entries) => {
    res.json(entries);
  });
});

// Route to retrieve a single phonebook entry by ID
app.get("/api/entries/:id", (req, res) => {
  const id = Number(req.params.id);
  const entry = entries.find((entry) => entry.id === id);

  if (entry) {
    res.json(entry);
  } else {
    res.status(404).end();
  }
});

// Route to add a new phonebook entry
app.post("/api/entries", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: "name or number is missing" });
  }

  const existingEntry = entries.find((entry) => entry.name === body.name);
  if (existingEntry) {
    return res.status(400).json({ error: "name must be unique" });
  }

  const newEntry = {
    id: Math.floor(Math.random() * 1000000000),
    name: body.name,
    number: body.number,
  };

  entries.push(newEntry);
  res.json(newEntry);
});

// Route to delete a phonebook entry
app.delete("/api/entries/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = phonebookEntries.findIndex((entry) => entry.id === id);

  if (index !== -1) {
    entries.splice(index, 1);
    res.status(204).end();
  } else {
    res.status(404).end();
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
