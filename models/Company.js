var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CompanySchema = new Schema({
	title: { type: String, required: true, default: 'Enter Company name' },
	description: { type: String, required: true, default: 'Enter Company description' },
	segments: [{	type: Schema.Types.ObjectId, ref: 'Segment' }]
});
module.exports = mongoose.model('Company', CompanySchema);