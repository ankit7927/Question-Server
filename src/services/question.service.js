const userSchema = require("../models/user.model");
const questionSchema = require("../models/question.model");
const errorGen = require("../utility/errorGen")

const questionService = {}

questionService.newQuestion = async (userId, title, content, tags) => {

    const user = await userSchema.findOne({ _id: userId })
        .select("question name")
        .exec()

    if (!user) errorGen("user not found", 400);

    const quest = await questionSchema.create({
        question: { title, content },
        name: user.name,
        tags: tags.split(",")
    });

    user.question.asked.push(quest._id);

    user.save();

    return quest;
}

questionService.newAnswer = async (answer, email, quesId) => {
    const user = await userSchema.findOne({ email })
        .select("question name")
        .exec()

    const question = await questionSchema.findByIdAndUpdate({ _id: quesId },
        {
            '$push': {
                answers: { answer, email: user.email, name: user.name }
            }
        }, { new: true })
        .lean().exec()

    if (!question) errorGen('question not found', 404);

    user?.question.answerd.push(question._id)

    user?.save()

    return question
}

questionService.latestQuestions = async () => {
    const latestQuestions = await questionSchema.find({})
        .select('question votes createdAt name')
        .sort({ createdAt: -1 })
        .limit(15)
        .lean()
        .exec();

    return latestQuestions;
}

questionService.unanswredQuestions = async () =>{
    const unansweredQuestions = await questionSchema.find({ answers: { $eq: [] } })
        .select('question votes createdAt name')
        .limit(20)
        .sort({ createdAt: -1 })
        .lean()
        .exec();

    return unansweredQuestions;
}


questionService.questionByID = async (quesId) =>{
    return await questionSchema.findById({ _id: quesId })
        .select("-tags").lean().exec()
}

questionService.questionQuery =  async (query) =>{
    const question = await questionSchema.find({
        "$or": [
            {
                "question.title": {
                    $regex: query
                }
            },
            {
                "question.content": {
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
        .exec();

    return question;
}

questionService.indexQuestions = async () => {
    const result = {}
    result.latest = await questionSchema.find({})
        .select('question')
        .sort({ createdAt: -1 })
        .limit(15).lean().exec();

    result.trending = await questionSchema.find({})
        .select('question votes createdAt name')
        .sort({ views: -1, answers: -1 })
        .limit(10).lean().exec();

    return result;
}

// TODO check if user or question is null or not
questionService.voteQuestion = async (userId, quesId) => { 
    const user = await userSchema.findOne({ _id: userId })
        .select("question")
        .exec();

    const question = await questionSchema.findById({ _id: quesId })
        .select("votes").exec();
    
    if (user.question.voted.questions.includes(quesId)) {
        user.question.voted.questions.pull(quesId)
        question.votes = question.votes - 1
    } else {
        user.question.voted.questions.push(quesId)
        question.votes = question.votes + 1
    }

    await user.save();
    await question.save();

    return question.votes;
}

// TODO check if user or question is null or not
questionService.voteAnswer = async (userId, quesId, ansId) => { 
    const user = await userSchema.findOne({ _id: userId })
        .select("question")
        .exec();

    const question = await questionSchema.findById({ _id: quesId })
        .select("votes answers").exec()

    const x = question.answers.find(item => item._id == ansId)
    let votes = 0

    if (user.question.voted.answers.includes(ansId)) {
        user.question.voted.answers.pull(ansId)
        votes = x.votes = x.votes - 1
    } else {
        user.question.voted.answers.push(ansId)
        votes = x.votes = x.votes + 1
    }

    await user.save()
    await question.save()

    return votes
}

module.exports = questionService;