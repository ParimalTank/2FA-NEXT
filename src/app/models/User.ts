import mongoose, { model, models } from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    verify: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: Number,
    },
    secret: {
        type: String,
    }
},
    {
        timestamps: true,
        versionKey: false,
    })

export default mongoose.models.User || mongoose.model("User", userSchema);