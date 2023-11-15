const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("connecting to", url);

mongoose
  .connect(url)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const phonebookEntrySchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 2,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validate: {
      validator: function (v) {
        const parts = v.split("-");
        return (
          parts.length === 2 &&
          (parts[0].length === 2 || parts[0].length === 3) &&
          !isNaN(parts[0]) &&
          !isNaN(parts[1])
        );
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
});

phonebookEntrySchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("PhonebookEntry", phonebookEntrySchema);
