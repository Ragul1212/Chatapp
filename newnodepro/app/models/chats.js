var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var msgSchema = new Schema({
    chatusername: String,
    msg: String,
    time: { type: Date, default: Date.now}
});
module.exports = mongoose.model('Messages', msgSchema);