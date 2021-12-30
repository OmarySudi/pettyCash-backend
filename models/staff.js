const mongoose = require("mongoose")

const StaffSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true},
        email: { type: String, required: true},
        phoneNumber: { type: String, required: true},
        profilePhoto: {type: String},
        address:  { type: String, required: true},
        jobTitle: { type: String, required: true},
        country: { type: String, required: true},
        identityCardNo: { type: String, required: true},
        identityCardCopy: { type: String, required: true},
        cv: { type: String},
        passportNo: {type: String},
        passport: { type: String},
        bankAccountNumber: { type: Number, required:true},
        bankName: { type: String, required:true},
        swiftCode: { type:String, required:true},
        IBAN: { type: String}

    },
    {timestamps: true}
)

module.exports = mongoose.model("Staff",StaffSchema)