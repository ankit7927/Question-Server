var express = require("express");
const userSchema = require("../database/schemas/userSchema");
const { generateToken } = require("../extras/JWTHelper");
const { verifyToken } = require("../extras/JWTHelper");
const bcrypt = require('bcrypt');
var router = express.Router();

// user signup
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await userSchema.findOne({ email: email })
        if (existingUser) {
            return res.status(500).send('Email alredy used...');
        }

        const newUser = new userSchema({
            name: name,
            email: email,
            password: await bcrypt.hash(password, 10),
        });

        newUser.save((err) => {
            if (err) {
                throw err
            } else {
                return res.status(201).send("registerd")
            }
        });
    } catch (error) {
        return res.status(500).send(error)
    }
});

// user login
router.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await userSchema.findOne({ email: email })
        if (!existingUser) {
            return res.status(404).send('Wrong Email..');
        }

        const passwordMatch = await bcrypt.compare(password, existingUser.password);
        if (!passwordMatch) {
            return res.status(404).send('wrong password..');
        }

        res.status(200).json({
            "token": generateToken(existingUser._id),
            "name": existingUser.name,
            "email": existingUser.email,
            "userID": existingUser._id
        })
    } catch (error) {
        return res.status(500).send(error)
    }
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
        }).catch(err => { return res.status(500).send(err); })
})

router.get("/questions", verifyToken, (req, res) => {
    const userID = req.user._id;
    userSchema.findOne({ _id: userID }, { question: 1 })
        .then(data => {
            return res.send(data)
        }).catch(err => { return res.status(500).send(err); })
})

module.exports = router;
