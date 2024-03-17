const userService = require("../services/user.service");

const userController = {}

userController.signup = async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'all fields required' });
    } else if (password.length < 8) {
        return res.status(400).json({ message: 'password length is too short' });
    }

    try {
        await userService.signup(name, email, password)
        res.status(201).json({ message: "user created" })
    } catch (error) {
        next(error);
    }
}

userController.updateProfile = async (req, res, next) => {
    const userId = req.user._id;
    const { name, email } = req.body

    if (!email || !name) {
        return res.status(400).json({ message: 'all fields required' });
    }

    try {
        res.status(201).json(await userService.updateProfile(userId, name, email))
    } catch (error) {
        next(error);
    }
}

userController.question = async (req, res, next) => {
    const userId = req.user._id;

    try {
        res.json(await userService.getQuestions(userId))
    } catch (error) {
        next(error);
    }
}

userController.saveORremoveQuestion = async (req, res) => {
    const quesId = req.params.queID;
    const userId = req.user._id;

    try {
        res.send(await userService.saveORremoveQuestion(userId, quesId))
    } catch (error) {
        next(error);
    }
}

module.exports = userController;