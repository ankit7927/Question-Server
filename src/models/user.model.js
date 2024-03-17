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
        asked: [mongoose.Schema.Types.ObjectId],
        answerd: [mongoose.Schema.Types.ObjectId],
        saved: [mongoose.Schema.Types.ObjectId],
        voted: {
            questions: [mongoose.Schema.Types.ObjectId],
            answers: [mongoose.Schema.Types.ObjectId]
        }
    }
})

module.exports = mongoose.model("User", userSchema);