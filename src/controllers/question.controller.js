const questionService = require("../services/question.service");

const questionController = {};

questionController.newQuestion = async (req, res, next) => {
    const id = req.user._id;
    const { title, content, tags } = req.body;

    if (!title || !content || !tags) {
        return res.status(400).json({ message: 'all fields required' });
    }

    try {
        res.json(await questionService.newQuestion(id, title, content, tags));
    } catch (error) {
        next(error);
    }
}

questionController.newAnswer = async (req, res, next) => {
    const { answer, email, quesID } = req.body;
    if (!answer || !email || !quesID)
        return res.status(400).json({ message: 'all fields required' });

    try {
        res.json(await questionService.newAnswer(answer, email, quesID));
    } catch (error) {
        next(error);
    }
}

questionController.latestQuestion = async (req, res, next) => {
    try {
        res.json(await questionService.latestQuestions());
    } catch (error) {
        next(error);
    }
}

questionController.unanswred = async (req, res, next) => {
    try {
        res.json(await questionService.unanswredQuestions());
    } catch (error) {
        next(error);
    }
}

// impliment trending question

questionController.questionByID = async (req, res, next) => {
    const quesID = req.params.quesID;
    try {
        res.json(await questionService.questionByID(quesID));
    } catch (error) {
        next(error);
    }
}

questionController.questionQuery = async (req, res) => {
    const query = req.query.query;
    try {
        res.json(await questionService.questionQuery(query));
    } catch (error) {
        next(error);
    }
}

questionController.indexQuestions = async (req, res, next) => {
    try {
        res.json(await questionService.indexQuestions());
    } catch (error) {
        next(error);
    }
}

questionController.voteQuestion = async (req, res) => {
    const quesId = req.body.quesId;
    const userId = req.user._id;

    try {
        res.json({ "votes": await questionService.voteQuestion(userId, quesId) });
    } catch (error) {
        next(error);
    }
}

questionController.voteAnswer = async (req, res, next) => {
    const { quesId, ansId } = req.body;
    const userId = req.user._id;

    try {
        res.json({ "votes": await questionService.voteAnswer(userId, quesId, ansId) })
    } catch (error) {
        next(error);
    }
}

module.exports = questionController;