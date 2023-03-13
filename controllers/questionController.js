const asyncHandler = require("express-async-handler")
const userSchema = require("../database/schemas/userSchema");
const questionSchema = require("../database/schemas/questionSchema");

const questionController = {}

questionController.newQuestion = asyncHandler(async (req, res) => {
    const id = req.user._id
    const { title, content, tags } = req.body;

    if (!title || !content || !tags) {
        return res.status(400).json({ message: 'all fields required' });
    }

    const user = await userSchema.findOne({ _id: id })
        .select("question name")
        .exec()

    if (!user) return res.status(400).json({ message: 'user not found' });

    const questionObj = {
        question: { title, content },
        name: user.name,
        tags: tags.split(",")
    }

    const quest = await questionSchema.create(questionObj)

    user.question.asked.push(quest._id)

    user.save()

    if (quest) res.status(201).json({ message: "question created" })
    else res.status(400).json({ message: "invalid question data received" })
})

questionController.newAnswer = asyncHandler(async (req, res) => {
    const { answer, email, name, quesID } = req.body;
    if (!answer || !email || !name || !quesID)
        return res.status(400).json({ message: 'all fields required' });

    const user = await userSchema.findOne({ email })
        .select("question")
        .exec()

    const question = await questionSchema.findById({ _id: quesID })
        .select("answers").exec()

    if (!question)
        return res.status(400).json({ message: 'question not found' });

    question.answers.push({ answer, email, name })

    const savedQuestion = await question.save()

    user?.question.answerd.push(savedQuestion._id)

    user?.save()

    res.send(question)
})

questionController.latestQuestion = asyncHandler(async (req, res) => {
    const latestQuestions = await questionSchema.find({})
        .select('question votes createdAt name')
        .sort({ createdAt: -1 })
        .limit(15)
        .lean();

    res.json(latestQuestions)
})

questionController.unanswred = asyncHandler(async (req, res) => {
    const unansweredQuestions = await questionSchema.find({ answers: { $eq: [] } })
        .select('question votes createdAt name')
        .limit(20)
        .sort({ createdAt: -1 })
        .lean();

    res.json(unansweredQuestions);
})

// impliment trending question

questionController.questionByID = asyncHandler(async (req, res) => {
    const quesID = req.params.quesID;
    const question = await questionSchema.findById({ _id: quesID })
        .select("-tags").exec()

    if (!question)
        return res.status(400).json({ message: 'question not found' });

    question.views = question.views + 1
    const modQues = await question.save()

    res.status(200).json(modQues)
})

questionController.questionQuery = asyncHandler(async (req, res) => {
    const query = req.query.question;
    const question = await questionSchema.find({
        "$or": [
            {
                "question": {
                    $regex: query
                }
            },
            {
                "tags": {
                    $regex: query
                }
            }
        ]
    }).select("question createdAt email votes")
        .limit(16)
        .lean()

    res.status(200).json(question)
})

questionController.indexQuestions = asyncHandler(async (req, res) => {
    const result = {}
    result.latest = await questionSchema.find({})
        .select('question')
        .sort({ createdAt: -1 })
        .limit(15).lean();

    result.trending = await questionSchema.find({})
        .select('question votes createdAt name')
        .sort({ views: -1, answers: -1 })
        .limit(10).lean();

    return res.send(result)
})

questionController.voteQuestion = asyncHandler(async (req, res) => {
    const quesID = req.params.queID

    const user = await userSchema.findOne({ _id: req.user._id })
        .select("question")
        .exec()

    if (!user) return res.status(400).json({ message: 'user not found' });

    const question = await questionSchema.findById({ _id: quesID })
        .select("votes").exec()

    if (!question)
        return res.status(400).json({ message: 'question not found' });

    if (user.question.voted.questions.includes(quesID)) {
        user.question.voted.questions.pull(quesID)
        question.votes = question.votes - 1
    } else {
        user.question.voted.questions.push(quesID)
        question.votes = question.votes + 1
    }

    await user.save()
    await question.save()
    res.json({ votes: question.votes.toString() })
})

questionController.voteAnswer = asyncHandler(async (req, res) => {
    const quesID = req.params.queID
    const ansID = req.params.ansID

    const user = await userSchema.findOne({ _id: req.user._id })
        .select("question")
        .exec()

    if (!user) return res.status(400).json({ message: 'user not found' });

    const question = await questionSchema.findById({ _id: quesID })
        .select("votes").exec()

    if (!question)
        return res.status(400).json({ message: 'question not found' });

    const x = question.answers.find(item => item._id == ansID)
    let votes = 0

    if (user.question.voted.answers.includes(ansID)) {
        user.question.voted.answers.pull(ansID)
        votes = x.votes = x.votes - 1
    } else {
        user.question.voted.answers.push(ansID)
        votes = x.votes = x.votes + 1
    }

    await user.save()
    await question.save()

    res.json({ votes: votes.toString() })
})

module.exports = questionController;