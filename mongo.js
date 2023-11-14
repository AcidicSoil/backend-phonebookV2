const mongoose = require("mongoose");

// Check if the correct number of arguments is given
if (process.argv.length < 3) {
  console.log("Please provide the password as an argument");
  process.exit(1);
}

const password = process.argv[2];
const dbname = "phonebookApp"; // Replace with your database name

// Construct the MongoDB connection URL
const url = `mongodb+srv://FEphonebookAdmin:${password}@cluster0.zm1apny.mongodb.net/${dbname}`;

mongoose.connect(url);

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Contact = mongoose.model("Contact", phonebookSchema);

// Function to add a new contact
const addContact = (name, number) => {
  const contact = new Contact({
    name,
    number,
  });

  contact.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
};

// Function to display all contacts
const displayContacts = () => {
  Contact.find({}).then((result) => {
    console.log("Phonebook:");
    result.forEach((contact) => {
      console.log(`${contact.name} ${contact.number}`);
    });
    mongoose.connection.close();
  });
};

// Decide whether to add a new contact or display all contacts
if (process.argv.length === 5) {
  const name = process.argv[3];
  const number = process.argv[4];
  addContact(name, number);
} else {
  displayContacts();
}

/*
// Example of creating a new phonebook entry
const contact = new Contact({
  name: "John Doe",
  number: "123-456-7890",
});

// Uncomment this block to save the new contact
contact.save().then((result) => {
  console.log("Contact saved!");
  mongoose.connection.close();
});

// Retrieve and display all phonebook entries
Contact.find({}).then((result) => {
  result.forEach((contact) => {
    console.log(contact);
  });
  mongoose.connection.close();
});
*/
