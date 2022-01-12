const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema(
    {
        userName: { type: String, required: true},
        email: { type: String, required: true, unique: true},
        password: {type: String, required: true},
        role: {type: String, default: "default"},
        confirmationCode: { type: String, unique: true},
        isEmailVerified: {type: Boolean, default: false},
        location: {type: String, required: true}
    },
    {timestamps: true}
)

module.exports = mongoose.model("User",UserSchema)