const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    question: {
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        }
    },
    name: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    tags: [String],
    votes: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    answers: [
        {
            answer: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: new Date()
            },
            votes: {
                type: Number,
                default: 0
            },
        }
    ]
})

module.exports = mongoose.model("Questions", questionSchema);
