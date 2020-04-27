const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const dotenv = require('dotenv').config();
const path = require('path');
const expressHandlebars = require('express-handlebars');


let app = express();
// let mongoUri = "mongodb://dbuser:dbuser11@ds259351.mlab.com:59351/heroku_1x1rtxz9"

let PORT = process.env.PORT || 3001;
let db = require('./models');

app.use(express.static("public"));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", expressHandlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


let mongoUri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ds259351.mlab.com:59351/heroku_1x1rtxz9`;
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.get("/", (req, res) => {
    // res.end('hi');
    // res.sendFile(path.join("./public", "index.html"));
    var hbsObject = {
        cats: "blah"
    };
    res.render("index", hbsObject);
});


app.get("/submit", (req, res) => {
    let myArticle = {
        title: "Article to read lots about",
        link: "facebook.com"
    };

    let myComment = {
        title: "My title for my comment",
        body: "Thought it was pretty good, with a hint of bad"
    }

    db.Article.create(myArticle)
        .then(function(dbArticle){
            db.Comment.create(myComment)
                .then(function(dbComment) {
                    console.log('cool it went down');
                })
                .catch(function(err) {
                    console.log(err);
                });


            res.json(dbArticle);
        })
        .catch(function(err){
            console.log(err);
        });


});


// LISTEN
// =============================================================
app.listen(PORT, () => {
    console.log("App running on port " + PORT + "!");
});