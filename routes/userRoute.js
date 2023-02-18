var express = require("express");
const userSchema = require("../database/schemas/userSchema");
const { generateToken } = require("../extras/JWTHelper");
const { verifyToken } = require("../extras/JWTHelper");
var router = express.Router();

// user signup
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

// user login
router.post("/signin", (req, res) => {
    const { username, password } = req.body;

    userSchema.findOne({
        username: username,
        password: password
    }).then(data => {
        return res.status(200).json({
            "token": generateToken(data._id),
            "name": data.name,
            "email": data.email,
            "username": data.username,
            "userID": data._id
        })
    }).catch(err => { return res.status(400).send("wrong username or password"); })
});

router.get("/profile", verifyToken, (req, res) => {
    const userID = req.user._id;
    userSchema.findOne({_id:userID}, {question:1, name:1, email:1, username:1})
    .then(data=>{
        return res.send(data)
    }).catch(err=>{
        return res.status(500).send("something went wrong");
    })
})

module.exports = router;
