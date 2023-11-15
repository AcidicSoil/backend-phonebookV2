const mongoose = require("mongoose");

// Check if at least the password is provided
if (process.argv.length < 3) {
  console.log("Please provide the password as an argument");
  process.exit(1);
}

const password = process.argv[2];
const dbname = "phonebookApp"; // Replace with your actual database name

// MongoDB connection URL
const url = `mongodb+srv://FEphonebookAdmin:${password}@cluster0.zm1apny.mongodb.net/${dbname}`;

mongoose.connect(url);

const phonebookEntrySchema = new mongoose.Schema({
  name: String,
  number: String,
});

const PhonebookEntry = mongoose.model("PhonebookEntry", phonebookEntrySchema);

// Function to add a new contact
const addContact = (name, number) => {
  const entry = new PhonebookEntry({
    name,
    number,
  });

  entry.save().then(() => {
    console.log(`Added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
};

// Function to display all contacts
const displayContacts = () => {
  PhonebookEntry.find({}).then((result) => {
    console.log("Phonebook:");
    result.forEach((entry) => {
      console.log(`${entry.name} ${entry.number}`);
    });
    mongoose.connection.close();
  });
};

// Determine the action based on the number of arguments provided
if (process.argv.length === 5) {
  // If name and number are provided, add a new contact
  const name = process.argv[3];
  const number = process.argv[4];
  addContact(name, number);
} else if (process.argv.length === 3) {
  // If only the password is provided, display all contacts
  displayContacts();
} else {
  console.log(
    "Invalid arguments. To add a contact, provide name and number. To display all contacts, provide only the password."
  );
}
