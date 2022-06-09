const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connection = require('./database/database')
const Question = require('./database/question')
const Answer = require('./database/answer')
const raw = require('body-parser/lib/types/raw')

connection
    .authenticate()
    .then(() => {
        console.log('connection established')
    })
    .catch(err => {
        console.log(err)
    })

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {

    Question.findAll({
        raw: true, order: [
            ['id', 'DESC']
        ]
    }).then(questions => {
        res.render("index", {
            questions: questions
        })
    })

})

app.get('/question', (req, res) => {
    res.render("question")
})

app.post('/savequestion', (req, res) => {

    var title = req.body.title
    var description = req.body.description

    Question.create({
        title: title,
        description: description
    }).then(() => {
        res.redirect("/")
    })
})

app.get('/question/:id', (req, res) => {

    var id = req.params.id

    Question.findOne({
        where: { id: id }
    }).then(question => {
        if (question != undefined) {

            Answer.findAll({
                where: { questionId: id },
                order: [['id', 'DESC']]
            }).then(answers => {
                res.render("question_edit", {
                    question: question,
                    answers: answers
                })
            })
        } else {
            res.redirect("/")
        }
    })
})

app.post("/answer", (req, res) => {

    var body = req.body.body;
    var questionId = req.body.questionId;

    Answer.create({
        body: body,
        questionId: questionId
    }).then(() => {
        res.redirect("/question/" + questionId)
    })
})

app.listen(8080, () => {
    console.log("App rodando")
})
