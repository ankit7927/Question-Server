const asyncHandler = require("express-async-handler")
const userSchema = require("../database/schemas/userSchema");
const questionSchema = require("../database/schemas/questionSchema");
const bcrypt = require('bcrypt');

const userController = {}

userController.signup = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'all fields required' });
    } else if (password.length < 8) {
        return res.status(400).json({ message: 'password length is too short' });
    }

    const existingUser = await userSchema.findOne({ email: email }).lean().exec()
    if (existingUser) {
        return res.status(409).json({ message: 'Email alredy used' });
    }

    const hashpass = await bcrypt.hash(password, 10)

    const newuser = { name, email, "password": hashpass }

    const user = await userSchema.create(newuser)

    if (user) {
        res.status(201).json({ message: "user created" })
    } else {
        res.status(400).json({ message: "invalid user data received" })
    }
})

userController.updateProfile = asyncHandler(async (req, res) => {
    const userID = req.user._id;
    const { name, email } = req.body

    if (!email || !name) {
        return res.status(400).json({ message: 'all fields required' });
    }

    const existingUser = await userSchema.findById({ _id: userID })
        .select("name email").select("-password").exec()

    if (!existingUser) {
        return res.status(400).json({ message: 'user not found' });
    }

    existingUser.name = name;
    existingUser.email = email;

    const updatedUser = await existingUser.save()

    res.json(updatedUser)
})

userController.question = asyncHandler(async (req, res) => {
    const userQuestion = await userSchema.findOne({ _id: req.user._id })
        .select("question")
        .lean().exec()

    let quesObj = {}

    quesObj.asked = await questionSchema.find({ _id: { $in: userQuestion.question.asked } })
        .select("question createdAt votes")

    quesObj.answerd = await questionSchema.find({ _id: { $in: userQuestion.question.answerd } })
        .select("question createdAt votes")

    quesObj.saved = await questionSchema.find({ _id: { $in: userQuestion.question.saved } })
        .select("question createdAt votes")

    res.json(quesObj)
})

userController.saveRemoveQues = asyncHandler(async (req, res) => {
    const quesID = req.params.queID;
    const user = await userSchema.findOne({ _id: req.user._id })
        .select("question");

    if (!user) return res.status(400).json({ message: 'User not found' });

    if (!user.question.saved.includes(quesID)) {
        user.question.saved.push(quesID)
        await user.save()

        res.send("saved")
    } else {
        user.question.saved.pull(quesID)
        await user.save()

        res.send("removed")
    }
})

module.exports = userController;