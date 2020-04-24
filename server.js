const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const dotenv = require('dotenv').config();


let app = express();
// let mongoUri = "mongodb://dbuser:dbuser11@ds259351.mlab.com:59351/heroku_1x1rtxz9"

let PORT = process.env.PORT || 3000;
let db = require('./models');

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


let mongoUri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ds259351.mlab.com:59351/heroku_1x1rtxz9`;
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


// async function connectMongoose() {
//     // TODO: env variable for creds
//     await mongoose.connect(mongoUri, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     });
// };
// connectMongoose();



// LISTEN
// =============================================================
app.listen(PORT, () => {
    console.log("App running on port " + PORT + "!");
});