const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

// Enable CORS for all routes
app.use(cors());

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
const phonebookEntries = [
  { id: 1, name: "Arto Hellas", number: "040-123456" },
  { id: 2, name: "Ada Lovelace", number: "39-44-5323523" },
  { id: 3, name: "Dan Abramov", number: "12-43-234345" },
  { id: 4, name: "Mary Poppendieck", number: "39-23-6423122" },
];

// Route to retrieve all phonebook entries
app.get("/api/persons", (req, res) => {
  res.json(phonebookEntries);
});

// Route to retrieve a single phonebook entry by ID
app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const entry = phonebookEntries.find((person) => person.id === id);

  if (entry) {
    res.json(entry);
  } else {
    res.status(404).end();
  }
});

// Route to add a new phonebook entry
app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: "name or number is missing" });
  }

  const existingEntry = phonebookEntries.find(
    (person) => person.name === body.name
  );
  if (existingEntry) {
    return res.status(400).json({ error: "name must be unique" });
  }

  const newEntry = {
    id: Math.floor(Math.random() * 1000000000),
    name: body.name,
    number: body.number,
  };

  phonebookEntries.push(newEntry);
  res.json(newEntry);
});

// Route to delete a phonebook entry
app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = phonebookEntries.findIndex((person) => person.id === id);

  if (index !== -1) {
    phonebookEntries.splice(index, 1);
    res.status(204).end();
  } else {
    res.status(404).end();
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
