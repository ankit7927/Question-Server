const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    createdBy: {
        username: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        }
    },
    timeStamp: String,
    tags: [String],
    stars: {
        type: Number,
        default: 0
    },
    answers: [
        {
            answer: {
                type: String,
                required: true
            },
            createdBy: {
                username: {
                    type: String,
                    required: true
                },
                email: {
                    type: String,
                    required: true
                }
            },
            timeStamp: String,
            likes: {
                type: Number,
                default: 0
            },
        }
    ]
})

module.exports = mongoose.model("Questions", questionSchema);