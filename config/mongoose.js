const env = require("./environment")

// mongodb configuration
const mongoose = require("mongoose");
mongoose.connect(`${env.db}`);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error conecting to MongoDB"));
db.once("open", () => {
    console.log("Connected to database :: MongoDB");
})
module.exports = db;