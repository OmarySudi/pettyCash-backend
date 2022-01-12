const mongoose = require("mongoose")

const ExpenditureSchema = new mongoose.Schema(
    {
        expenditureType: { type: String, required: true},
        category: {type: String, required: true},
        amount: { type: Number, required: true},
        country: { type: String, required: true},
        currency: { type: String, required: true},
        description: {type: String},
        registeredBy: {type: String},
        staffId: { type: String},
        date: { type: Date}
    },
    //{timestamps: true}
)

module.exports = mongoose.model("Expenditure",ExpenditureSchema)