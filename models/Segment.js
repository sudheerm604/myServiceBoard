var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var SegmentSchema = new Schema({
	title: { type: String, required: true, default: 'Enter Segment name' }
});
module.exports = mongoose.model('Segment', SegmentSchema);