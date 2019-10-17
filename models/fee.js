let mongoose = require('mongoose');
let passportLocalMongoose = require('passport-local-mongoose');

let FeeSchema = new mongoose.Schema({
	StudentID:String,
	Fileshifted: String,
	DepositedFeeRs : String,
	RefundedviaChequeNo :String,
	Dated :String,
	Drawnon :String,
	RefundAmountRs :String,
	ModeofRefund :String ,
	Remarks: String

});

module.exports = mongoose.model('Fee', FeeSchema);