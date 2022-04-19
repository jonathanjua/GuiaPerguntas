const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connection =require('./database/database')

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
    res.render("index")
})

app.get('/question', (req, res) => {
    res.render("question")
})

app.post('/savequestion', (req, res) => {
    var title = req.body.title
    var description = req.body.description
})

app.listen(8080, ()=> {
   console.log("App rodando") 
})
