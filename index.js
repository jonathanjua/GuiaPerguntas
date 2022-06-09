const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connection =require('./database/database')
const Question = require('./database/question')
const raw = require('body-parser/lib/types/raw')

connection
    .authenticate()
    .then(()=> {
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

    Question.findAll({raw: true, order:[
        ['id', 'DESC']
    ]}).then(questions => {
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
       where: {id: id}
   }).then(question => {
         if(question != undefined){
              res.render("question_edit", {
                question: question
              })
         } else {
              res.redirect("/")
         }
   }) 
})

app.listen(8080, ()=> {
   console.log("App rodando") 
})
