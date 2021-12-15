const mongoose = require("mongoose")

const StaffSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true},
        email: { type: String, required: true},
        phoneNumber: { type: String, required: true},
        address:  { type: String, required: true},
        jobTitle: { type: String, required: true},
        country: { type: String, required: true},
        identityCardNo: { type: String, required: true},
        identityCardCopy: { type: String, required: true},
        cv: { type: String, required: true},
        passport: { type: String},
          
    },
    {timestamps: true}
)

module.exports = mongoose.model("Staff",StaffSchema)