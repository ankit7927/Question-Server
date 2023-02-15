const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
    tags: [String]
})

module.exports = mongoose.model("Tags", tagSchema);