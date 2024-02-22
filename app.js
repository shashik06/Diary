const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const app = express();
const port = process.env.PORT || 3000;

//set template Engine as EJS
app.set('view engine', 'ejs');

//serve static files
app.use(express.static('public'));
//use body parser

//parse form data
app.use(bodyParser.urlencoded({ extended: false}))

//parse application/json
app.use(bodyParser.json());

//method override
app.use(methodOverride('_method'));

//database url

const url = 'mongodb+srv://user:9014@project0.w1jwxrm.mongodb.net/Diary?retryWrites=true&w=majority';

//connect to database
mongoose.connect(url).then(console.log('conneted')).catch(err => console.log(err));


//import Diary model here
const Diary = require('./models/Diary')

app.get('/' , (req,res) => {
    res.render('home',{value : 'hello world'});
    
})
app.get('/about' , (req,res) => {
    res.render('about');
    
})
app.get('/diary' , (req,res) => {
    Diary.find().then((data) => {
        res.render('diary',{data:data});
    })
    
    
})
app.get('/add' , (req,res) => {
    res.render('add');
    
})
//route for saving Diiary

app.post('/add-to-diary' , (req,res) => {
    //save the data on database
    const data = new Diary({
        title:req.body.title,
        description : req.body.description,
        date : req.body.date
    })
    data.save().then(() => {
        res.redirect('/diary');
    }).catch(err => console.log(err));
})

//route for specific item
app.get('/diary/:id', (req,res) => {
    Diary.findOne({
        _id : req.params.id
    }).then((data) => res.render('page', {data:data}))
})
app.get('/edit/:id', (req,res) => {
    Diary.findOne({
        _id : req.params.id
    }).then(data => {
        
        res.render('edit', { data:data });
    }).catch(err => console.log(err));
})
app.put('/dairy/edit/:id',(req,res) => {
    Diary.findOne({
        _id : req.params.id
    }).then(data => {
        data.title = req.body.title
        data.description = req.body.description
        data.date = req.body.date

        data.save().then(() => {
            res.redirect('/diary');
        }).catch(err => console.log(err));
    })
})
    
app.delete('/delete/:id',(req,res) => {
    Diary.deleteOne({
        _id : req.params.id
    }).then(() => {
        res.redirect('/diary');
    }).catch(err => console.log(err));
})     

app.listen(port,() => {
    console.log(`server listening on ${port}`)
})