const mongoose = require("mongoose")

const ExpenseSchema = new mongoose.Schema(
    {
        expenseType: { type: String, required: true},
        amount: { type: Number, required: true},
        country: { type: String, required: true},
        currency: { type: String, required: true},
        description: {type: String},
        staffId: { type: String},
        date: { type: Date}
    },
    //{timestamps: true}
)

module.exports = mongoose.model("Expense",ExpenseSchema)