const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//const passportLocalMongoose = require('passport-local-mongoose');

const Entry = new Schema({
    horse: String,
    writtenBy: String,
    entry: String
});

//Horse.plugin(passportLocalMongoose);

module.exports = mongoose.model('entries', Entry);
