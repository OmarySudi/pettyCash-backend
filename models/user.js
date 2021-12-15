const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema(
    {
        userName: {type: String, required: true, unique: true},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        isOperator: {type: Boolean, default: false},
        isEmailVerified: {type: Boolean, default: false}
    },
    {timestamps: true}
)

module.exports = mongoose.model("User",UserSchema)