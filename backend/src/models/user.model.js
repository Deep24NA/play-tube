import mongoose, {mongo, Schema} from "mongoose";
import bycrpt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            lowercase: true,
            trim: true,
            index: true, // indexing is required for index based searching
        },
        email: {
            type: String,
            unique: true,
            required: true,
            lowercase: true,
            trim: true, // indexing is not required because of emailbased searching
        },
        fullname: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            index: true,
        },
        avatar: {
            type: String, // cloudinary url
            required: true,
        },
        coverImage: {
            type: String,
        },
        watchHistory: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Video",
            }
        ],
        password: {
            type: String,
            required: [true , "password is required"],
        },
        refereshToken: {
            type: String,
        },
    },
    {timestamps: true}
)


userSchema.pre("save", async function (next) {
    if(!this.isModified("password")){
        return next();
    }
    this.password = bycrpt.hash(this.password , 10)
    next();
}) // do not use the arrow function inside the pre hook or any other hook because in the pre hook we have to command into a current context that is done by a normal function , always we a async function because the encryption algorithm takes time and always use a next parameter because we to work as a middleware

//authentication of password via a custom method we can create our own custom method which is run whenever we have to propose any speacial criteria , this is done by a "methods" method which is get by the mongoose 
userSchema.methods.isPasswordCorrect = async function (password){
   return await bycrpt.compare(password , this.password) // returns true or false
}


userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_EXPIRY
        },
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_EXPIRY
        }
    )
}

const User = mongoose.model("User" , userSchema);
export default User;