const mongoose = require("mongoose");

if (process.argv.length !== 3 && process.argv.length !== 5) {
  console.log(
    "Usage:\n" +
      "To list all entries: node mongo.js <password>\n" +
      "To add an entry: node mongo.js <password> <name> <number>"
  );
  process.exit(1);
}

const password = process.argv[2];
const dbname = "phonebookApp"; // Replace with your database name

const url = `mongodb+srv://FEphonebookAdmin:${password}@cluster0.zm1apny.mongodb.net/${dbname}`;

mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

const entrySchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Entry = mongoose.model("Entry", entrySchema);

if (process.argv.length === 3) {
  // List all entries
  Entry.find({})
    .then((result) => {
      console.log("Phonebook:");
      result.forEach((entry) => {
        console.log(entry.name, entry.number);
      });
      mongoose.connection.close();
    })
    .catch((error) => {
      console.error("Error fetching entries:", error);
      mongoose.connection.close();
    });
} else {
  // Add new entry
  const name = process.argv[3];
  const number = process.argv[4];

  const entry = new Entry({
    name: name,
    number: number,
  });

  entry
    .save()
    .then(() => {
      console.log(`Added ${name} number ${number} to the phonebook`);
      mongoose.connection.close();
    })
    .catch((error) => {
      console.error("Error saving entry:", error);
      mongoose.connection.close();
    });
}
