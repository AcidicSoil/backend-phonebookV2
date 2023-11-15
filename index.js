require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");

const PhonebookEntry = require("./models/PhonebookEntry"); // Adjust the path as needed

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(express.static("dist"));

// Route to retrieve all phonebook entries
app.get("/api/persons", (request, response) => {
  PhonebookEntry.find({}).then((entries) => {
    response.json(entries);
  });
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({ error: "name or number is missing" });
  }

  PhonebookEntry.findOne({ name: body.name })
    .then((existingEntry) => {
      if (existingEntry) {
        // Redirect to the PUT handler
        request.params.id = existingEntry._id;
        app._router.handle(request, response, next);
      } else {
        const entry = new PhonebookEntry({
          name: body.name,
          number: body.number,
        });

        entry
          .save()
          .then((savedEntry) => response.json(savedEntry))
          .catch((error) => next(error));
      }
    })
    .catch((error) => next(error));
});

// Route to retrieve a single phonebook entry by ID
app.get("/api/persons/:id", (request, response, next) => {
  PhonebookEntry.findById(request.params.id)
    .then((entry) => {
      if (entry) {
        response.json(entry);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

// Route to delete a phonebook entry
app.delete("/api/persons/:id", (request, response, next) => {
  PhonebookEntry.findByIdAndDelete(request.params.id)
    .then((result) => {
      if (result) {
        response.status(204).end();
      } else {
        response.status(404).send({ error: "Entry not found" });
      }
    })
    .catch((error) => next(error));
});

// Route to update a phonebook entry
app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body;

  PhonebookEntry.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedEntry) => {
      if (updatedEntry) {
        response.json(updatedEntry);
      } else {
        response.status(404).send({ error: "Entry not found" });
      }
    })
    .catch((error) => next(error));
});

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
