const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let CommentSchema = new Schema({
    title: {
        type: String
    },
    body: {
        type: String
    }
});

let Comment = mongoose.model("Comment", CommentSchema);