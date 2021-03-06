const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const dotenv = require('dotenv').config();
const path = require('path');
const expressHandlebars = require('express-handlebars');
const axios = require('axios');
const cheerio = require('cheerio');

let app = express();

let PORT = process.env.PORT || 3001;
let db = require('./models');
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", expressHandlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// If deployed, use the deployed database. Otherwise use the local mongo database
let MONGODB_URI = process.env.NODE_ENV 
    ? process.env.MONGODB_URI 
    : "mongodb://localhost/mongo_madness_local";

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


// ** ROUTES **
// =============================================================
app.put("/api/article", (req, res) => {
    console.log('did I get here?');
    console.log(req.body);
    db.Article.updateOne({
            _id: req.body._id
        },
        {
            isSaved: true
        })
        .then(function(dbArticle) {
            console.log('cool');
            res.status(202).json(dbArticle);
        })
        .catch(function() {});
});

app.get("/", (req, res) => {
    // res.end('hi');
    // res.sendFile(path.join("./public", "index.html"));

    db.Article.find({})
        .then(function(dbArticleList) {
            const pageArray = [];

            
            dbArticleList.forEach(element => {
                pageArray.push({
                    articleTitle: element.title,
                    articleLink: element.link,
                    articleId: element._id
                })
            });

            const articleData = {
                pageTitle: "Article Scraper",
                articles: pageArray
            }

            // console.log(articleData);
            // console.log(pageArray);

            res.render("index", articleData);
        })
        .catch(function(error){

        });

    // res.render("index");
});

app.get("/saved-articles", (req, res) => {
    // res.end('hi');
    // res.sendFile(path.join("./public", "index.html"));

    db.Article.find({
            isSaved: true
        })
        .then(function(dbArticleList) {
            const pageArray = [];

            
            dbArticleList.forEach(element => {
                pageArray.push({
                    articleTitle: element.title,
                    articleLink: element.link,
                    articleId: element._id
                })
            });

            const articleData = {
                pageTitle: "Article Scraper",
                articles: pageArray
            }

            // console.log(articleData);
            // console.log(pageArray);

            res.render("saved", articleData);
        })
        .catch(function(error){

        });

    // res.render("index");
});

app.get("/scrape", (req, res) => {

    // let targetWebsite = "https://9to5mac.com";
    let targetWebsite = "https://www.cultofmac.com/category/news/";

    axios
    .get(targetWebsite)
    .then(function(httpResponse) {

        const htmlDocument = httpResponse.data;
        const $ = cheerio.load(htmlDocument);
        const scrapeResults = [];

        const allHeadlineLinks = $('.post-header > a');
        allHeadlineLinks.each(function(index, anchorElement) {
            const title = $(anchorElement).children('h2').text();
            const link = $(anchorElement).attr('href');
            scrapeResults.push({
                title,
                link
            });
        });


        // clears out the DB before we populate it with scrape data.
        db.Article.deleteMany({}, function() {
            db.Article.insertMany(scrapeResults)
                .then(function(dbArticles){
                    // res.json(dbArticles);
                    res.redirect("/");
                })
                .catch(function(error){
                    console.error(error);
                });
        });

        // res.send('OK');
    })
    .catch(function(err) {
        console.error(err);
    });

});

app.get("/all-articles", (req, res) => {
    db.Article.find({})
        .then(function(dbArticleList) {
            res.json(dbArticleList);
        })
        .catch(function(err) {
            console.err(err);
        });
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