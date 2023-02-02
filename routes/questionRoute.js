var express = require("express");
const questionSchema = require("../database/schemas/questionSchema");
const userSchema = require("../database/schemas/userSchema");
var router = express.Router();

router.post("/new-question", (req, res) => {
    const { question, username, email, tags, userID } = req.body;   //replace usename with id useing token auth
    const newQuestion = new questionSchema({
        question: question,
        "createdBy.username": username,
        "createdBy.email": email,
        timeStamp: new Date(),
        tags: tags.split(",")
    })

    newQuestion.save(async (err, data) => {
        if (err) {
            return res.status(500).send(err);
        } else {
            const result = await userSchema.findByIdAndUpdate(
                {
                    _id: userID
                }, {
                "$push": {
                    "question.asked": {
                        question: data.question,
                        quesID: data._id
                    }
                }
            })

            if (!result) {
                return res.status(500).send("someting error");
            }
            return res.status(200).send(data)
        }
    })
})

router.post("/answer", (req, res) => {
    const { answer, username, email, userID, quesID } = req.body
    questionSchema.findByIdAndUpdate(
        { _id: quesID },
        {
            "$push": {
                answers: {
                    answer: answer,
                    timeStamp: new Date(),
                    "createdBy.username": username,
                    "createdBy.email": email,
                }
            }
        }, { new: true },
        async (err, data) => {
            if (err) {
                return res.status(500).send(err);
            } else {
                const result = await userSchema.findByIdAndUpdate(
                    {
                        _id: userID
                    }, {
                    "$push": {
                        "question.answerd": {
                            question: data.question,
                            quesID: data._id
                        }
                    }
                })

                if (!result) {
                    return res.status(500).send("someting error");
                }
                return res.status(200).send(data)
            }
        }
    )
})

router.get("/que/:queID", (req, res) => {
    questionSchema.findById(
        { _id: req.params.queID },
        { question: 1, stars: 1, createdBy: 1, timeStamp: 1, answers: 1 },
        (err, data) => {
            if (err) {
                return res.status(500).send(err);
            } else {
                return res.send(data)
            }
        })
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
        }, { question: 1, stars: 1 }, (err, data) => {
            if (err) {
                return res.status(500).send(err);
            } else {
                return res.send(data)
            }
        })
})


/**
 * get latest questions
 */
router.get("/latest", (req, res) => {
    questionSchema.find({

    })
})

/**
 * get questions by tag
 */
router.get("/tag/:tag", (req, res) => {
    questionSchema.find({
        "tags": {
            $regex: req.params.tag
        }
    }, { question: 1, stars: 1 }, (err, data) => {
        if (err) {
            return res.status(500).send(err);
        } else {
            return res.send(data)
        }
    })
})
module.exports = router;