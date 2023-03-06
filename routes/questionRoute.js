var express = require("express");
const questionSchema = require("../database/schemas/questionSchema");
const tagSchema = require("../database/schemas/tagSchema");
const userSchema = require("../database/schemas/userSchema");
const { verifyToken } = require("../extras/JWTHelper");
var router = express.Router();



/**
 * create new question...
 * collect tags and update in db.
 */
router.post("/new-question", verifyToken, async (req, res) => {
    const id = req.user._id
    const { title, content, tags } = req.body;

    const user = await userSchema.findOne({ _id: id })

    const xtags = tags.split(",")
    const newQuestion = new questionSchema({
        "question.title": title,
        "question.content": content,
        name: user.name,
        tags: xtags
    })

    newQuestion.save()
        .then(data => {
            user.question.asked.push(data._id)

            user.save()

            tagSchema.updateMany({},
                {
                    $push: {
                        tags: xtags
                    }
                }).then(data => console.log(data))
                .catch(err => console.log(err))
            return res.send("ok")

        }).catch(err => { return res.status(500).send(err); })
})

router.post("/answer", async (req, res) => {
    const { answer, email, name, quesID } = req.body
    const user = await userSchema.findOne({ email: email })
    questionSchema.findByIdAndUpdate(
        { _id: quesID },
        {
            "$push": {
                answers: {
                    answer: answer,
                    email: email,
                    name: name
                }
            }
        }, { new: true })
        .then(data => {
            user?.question.answerd.push(data._id)

            user?.save()

            return res.status(200).send(data);
        }
        ).catch(err => { return res.status(500).send(err); })
})

router.get("/que/:queID", (req, res) => {
    questionSchema.findById(
        { _id: req.params.queID })
        .then(data => {
            console.log(data);
            questionSchema.findByIdAndUpdate({ _id: data._id },
                {
                    $set: {
                        views: data.views + 1
                    }
                }, { new: true })
                .then(updated => { return res.send(updated) })
                .catch(err => { console.log(err); })

        }).catch(err => { return res.status(500).send(err); })
})

/**
 * search question on query
 */
router.get("/", (req, res) => {
    const query = req.query.question;
    questionSchema.find(
        {
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
        }, { question: 1, createdAt: 1, email: 1, votes: 1 }, { limit: 18 })
        .then(data => {
            return res.send(data)
        }).catch(err => { return res.status(500).send(err); })
})


router.get("/latest", async (req, res) => {
    const latestQuestions = await questionSchema.find()
        .select('question votes createdAt name')
        .sort({ createdAt: -1 })
        .limit(15);

    return res.send(latestQuestions)
})

router.get("/ananswred", async (req, res) => {
    const unansweredQuestions = await questionSchema.find({ answers: { $eq: [] } })
        .select('question votes createdAt name')
        .limit(20)
        .sort({ createdAt: -1 });

    res.send(unansweredQuestions);

})

router.get('/trending', async (req, res, next) => {
    try {
        const trendingQuestions = await Question.aggregate([
            {
                $project: {
                    _id: 1,
                    title: 1,
                    upvotes: { $size: "$upvotes" }
                }
            },
            {
                $sort: { upvotes: -1 }
            },
            {
                $limit: 10 // Returns only the top 10 trending questions
            }
        ]);

        res.send(trendingQuestions);
    } catch (error) {
        next(error);
    }
});


/**
 * get questions by tag
 */
router.get("/tag/:tag", (req, res) => {
    questionSchema.find({
        "tags": {
            $regex: req.params.tag
        }
    }, { question: 1, votes: 1 })
        .then(data => {
            return res.send(data)
        }).catch(err => { return res.status(500).send(err); })
})

/**
 * get questions for home page new, poplure, not answerd
 * new question have range of one month from now..
 * and pic those question which not answerd any more..
 * poploure questions will have higher votes
 */
router.get("/index", async (req, res) => {
    const result = {}
    const currentDt = new Date()
    const endDt = new Date()
    endDt.setMonth(currentDt.getMonth() - 1)

    result.latest = await questionSchema.find({
        createdAt: {
            $gte: endDt,
            $lte: currentDt
        }
    }, { question: 1, votes: 1, createdAt: 1 }, { limit: 6 })

    result.hot = await questionSchema.find({
        stars: {
            $gte: 50,
            $lte: 100
        }
    }, { question: 1, votes: 1, createdAt: 1 }, { limit: 6 })

    result.not_answerd = await questionSchema.find({
        answers: {
            $eq: []
        }
    }, { question: 1, votes: 1, createdAt: 1 }, { limit: 6 })

    return res.send(result)

})


router.get("/tags", (req, res) => {
    tagSchema.find({})
        .then(data => {
            data = [...new Set(data[0].tags)];
            return res.send(data)
        }).catch(err => { return res.send(err) })
})

router.post("/vote/:queID", verifyToken, async (req, res) => {
    const quesID = req.params.queID

    const user = await userSchema.findOne({ _id: req.user._id },
        {
            "question": 1
        })

    if (user.question.voted.includes(quesID)) {
        user.question.voted.pull(quesID)
    } else {
        user.question.voted.push(quesID)
    }
    await user.save()
    return res.send(user)
})

module.exports = router;