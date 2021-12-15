const mongoose = require("mongoose")

const CountrySchema = new mongoose.Schema(
    {
        name: { type: String, required: true},
        currency: { type: String, required: true},
        officeAddress: { type: String, required: true},
    },
    {timestamps: true}
)

module.exports = mongoose.model("Country",CountrySchema)