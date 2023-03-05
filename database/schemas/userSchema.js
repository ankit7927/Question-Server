const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        requred: true
    },
    email: {
        type: String,
        requred: true,
        unique: true,
    },
    password: {
        type: String,
        requred: true
    },
    question: {
        asked: [{
            questionTitle: String,
            quesID: String,
            createdAt: {
                type: Date,
                default: new Date()
            },
        }],
        answerd: [{
            questionTitle: String,
            quesID: String,
            createdAt: {
                type: Date,
                default: new Date()
            },
        }],
        saved: [{
            questionTitle: String,
            quesID: String,
            createdAt: {
                type: Date,
                default: new Date()
            },
        }],
        stared: [{
            questionTitle: String,
            quesID: String,
            createdAt: {
                type: Date,
                default: new Date()
            },
        }],
        liked: [{
            questionTitle: String,
            quesID: String,
            createdAt: {
                type: Date,
                default: new Date()
            },
        }],
    }
})

module.exports = mongoose.model("User", userSchema);