const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },

    link: {
        type: String,
        required: true
    },

    isSaved: {
        type: Boolean,
        default: false
    },

    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }
});

// these are suggestions from instructions
// TODO: look at restructer of this collection
// Headline - the title of the article
// Summary - a short summary of the article
// URL - the url to the original article
// Feel free to add more content to your database (photos, bylines, and so on).

let Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;