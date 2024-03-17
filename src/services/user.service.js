const userSchema = require("../models/user.model");
const questionSchema = require("../models/question.model");
const bcrypt = require('bcrypt');
const errorGen = require("../utility/errorGen")

const userService = {}


userService.signup = async (name, email, password) => {
    const existingUser = await userSchema.findOne({ email: email }).lean().exec();
    if (existingUser) errorGen('Email alredy used', 409);

    const hashpass = await bcrypt.hash(password, 10);

    await userSchema.create({ name, email, "password": hashpass });
}

userService.updateProfile = async (userId, name, email) => {
    const existingUser = await userSchema.findOneAndUpdate({ _id: userId },
        { name: name, email: email }, { new: true })
        .select("name email -password").lean().exec();

    if (!existingUser) errorGen('user not found', 404)

    return existingUser;
}

userService.getQuestions = async (userId) => {
    const userQuestion = await userSchema.findOne({ _id: userId })
        .select("question")
        .lean().exec()

    let quesObj = {}

    quesObj.asked = await questionSchema.find({ _id: { $in: userQuestion.question.asked } })
        .select("question createdAt votes").lean().exec();

    quesObj.answerd = await questionSchema.find({ _id: { $in: userQuestion.question.answerd } })
        .select("question createdAt votes").lean().exec();

    quesObj.saved = await questionSchema.find({ _id: { $in: userQuestion.question.saved } })
        .select("question createdAt votes").lean().exec();

    return quesObj;
}

userService.saveORremoveQuestion = async (userId, quesId) => {
    const user = await userSchema.findOne({ _id: userId })
        .select("question");

    if (!user) errorGen("user not found", 404);

    if (!user.question.saved.includes(quesId)) {
        user.question.saved.push(quesId)
        await user.save()

        return "saved"
    } else {
        user.question.saved.pull(quesId)
        await user.save()

        return "removed"
    }
}

module.exports = userService;
