import mongoose, { Schema } from "mongoose"
import bcryptjs from "bcryptjs"

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            unique: true,
            sparse: true, // allows students without email
            lowercase: true
        },

        username: {
            type: String,
            required: true,
            unique: true // rollNumber for students
        },

        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: ["ADMIN", "TEACHER", "STUDENT", "PARENT"],
            required: true
        },

        profilePhoto: {
            url: {
                type: String,
                default: ""
            },
            publicId: {
                type: String,
                default: ""
            }
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
)

userSchema.pre("save", async function () {

    if (!this.isModified("password")) return;

    this.password = await bcryptjs.hash(this.password, 10);

})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcryptjs.compare(password, this.password)
}

export const User = mongoose.model("User", userSchema)