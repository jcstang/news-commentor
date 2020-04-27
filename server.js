const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const dotenv = require('dotenv').config();
const path = require('path');
const expressHandlebars = require('express-handlebars');
const axios = require('axios');
const cheerio = require('cheerio');


let app = express();
// let mongoUri = "mongodb://dbuser:dbuser11@ds259351.mlab.com:59351/heroku_1x1rtxz9"

let PORT = process.env.PORT || 3001;
let db = require('./models');

app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", expressHandlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// If deployed, use the deployed database. Otherwise use the local mongo database
// let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongo_madness_local";
let MONGODB_URI = process.env.NODE_ENV ? process.env.MONGODB_URI : "mongodb://localhost/mongo_madness_local";
//"mongodb://localhost/schemaexample"//
console.log(MONGODB_URI);
// console.log(process.env.NODE_ENV);

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.get("/", (req, res) => {
    // res.end('hi');
    // res.sendFile(path.join("./public", "index.html"));
    res.render("index");
});

app.get("/scrape", (req, res) => {

    let targetWebsite = "https://9to5mac.com";

    axios
    .get(targetWebsite)
    .then(function(httpResponse) {

        const htmlDocument = httpResponse.data;
        const $ = cheerio.load(htmlDocument);

        // const allHeadlineLinks = $('.post-title a');
        const allHeadlineLinks = $('.post-title a');
        const scrapeResults = [];
        // console.log(allHeadlineLinks);
        allHeadlineLinks.each(function(index, anchorElement) {
            const title = $(anchorElement).text();
            const link = $(anchorElement).attr('href');

            scrapeResults.push({
                title,
                link
            });
        });

        db.Article.create(scrapeResults)
            .then(function(dbArticles){
                res.json(dbArticles);
            })
            .catch(function(error){

            });

        // res.send('OK');
    })
    .catch(function(err) {
        console.error(err);
    });

});

app.get("/all-data", (req, res) => {

});

app.get("/create-demo", (req, res) => {
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