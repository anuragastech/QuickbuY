const mongoose = require("mongoose");
// let a = bcrypt.hash(helo,10)
// console.log(a)


const  savedSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        // default: "lkj@gmail.com",
    },
    password: {
        type: String,
        required: true,
        default: "$2a$10$cu0ZvU2r4w3W2YILc5Q6NOddIDC59boUoq7O/SZpsNP7LKnvfgE5W",
    },
    role: {
        type: String,
        required: true,
        default: "admin",
    },
});

module.exports = mongoose.model("Saved", savedSchema);
