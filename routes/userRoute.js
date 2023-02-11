var express = require("express");
const userSchema = require("../database/schemas/userSchema");
const { generateToken } = require("../extras/JWTHelper");
var router = express.Router();

// voters signup
router.post("/signup", (req, res) => {
    const { name, email, username, password } = req.body;

    const newVoter = new userSchema({
        name: name,
        email: email,
        username: username,
        password: password,
    });
    newVoter.save((err) => {
        if (err) {
            return res.status(500).send(err);
        } else {
            return res.status(200).send("registerd")
        }
    });
});

// voter login
router.post("/signin", (req, res) => {
    const { username, password } = req.body;

    userSchema.findOne({
        username: username,
        password: password
    }, (err, data) => {
        if (err || data == null) {
            return res.status(400).send("wrong username or password");
        } else {
            return res.status(200).json({
                "token": generateToken(data._id),
                "name": data.name,
                "email": data.email,
                "username": data.username,
                "userID":data._id
            })
        }
    });
});

module.exports = router;
