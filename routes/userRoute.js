var express = require("express");
const userSchema = require("../database/schemas/userSchema");
const { generateToken } = require("../extras/JWTHelper");
const { verifyToken } = require("../extras/JWTHelper");
var router = express.Router();

// user signup
router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = await userSchema.findOne({email:email})
    if(existingUser) return res.status(404).send("email alredy taken");
     
    const newUser = new userSchema({
        name: name,
        email: email,
        password: password,
    });
    console.log(newUser);
    newUser.save((err) => {
        if (err) {
            return res.status(500).send(err);
        } else {
            return res.status(200).send("registerd")
        }
    });
});

// user login
router.post("/signin", (req, res) => {
    const { email, password } = req.body;

    userSchema.findOne({
        email: email,
        password: password
    }).then(data => {
        return res.status(200).json({
            "token": generateToken(data._id),
            "name": data.name,
            "email": data.email,
            "userID": data._id
        })
    }).catch(err => { return res.status(400).send("wrong username or password"); })
});

router.put("/profile", verifyToken, (req, res) => {
    const userID = req.user._id;
    const { name, email } = req.body
    userSchema.findByIdAndUpdate({ _id: userID },
        {
            $set: {
                name: name,
                email: email
            }
        }).then(data => {
            return res.send(data);
        }).catch(err => { return res.status(400).send(err); })
})

router.get("/questions", verifyToken, (req, res) => {
    const userID = req.user._id;
    userSchema.findOne({ _id: userID }, { question: 1 })
        .then(data => {
            return res.send(data)
        }).catch(err => { return res.status(400).send(err); })
})

module.exports = router;
