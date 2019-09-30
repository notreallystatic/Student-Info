const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
	RegnNo: String ,
	AadhaarNo: String, 
	Name:String,
	Fname:String,
	Gender:String,
	AdmissionYear:String,
	Course:String,
	Branch:String,
	AllotmentCategory:String,
	AdmissionMode: String,
	Contact1:String,
	Contact2:String,
	Email:String
});

module.exports = mongoose.model('student', StudentSchema);