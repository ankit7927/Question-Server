const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        requred: true
    },
    email: {
        type: String,
        requred: true
    },
    username: {
        type: String,
        unique: true,
        requred: true
    },
    password: {
        type: String,
        requred: true
    },
    question: {
        asked: [{
            question: String,
            quesID: String
        }],
        answerd: [{
            question: String,
            quesID: String
        }],
        saved: [{
            question: String,
            quesID: String
        }],
        stared: [{
            question: String,
            quesID: String
        }],
        liked: [{
            question: String,
            quesID: String
        }],
    }
})

module.exports = mongoose.model("User", userSchema);