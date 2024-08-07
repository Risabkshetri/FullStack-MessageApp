import mongoose, {Schema, Document} from "mongoose";

 export interface Message extends Document {
    content: string;
    createdAt: Date;
}

const messageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpires: Date;
    isverified: boolean;
    isAcceptingMessages: boolean;
    messages: Message[];
}

const userSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        trim: true,
        unique: true,
        match: [ /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
    },
    verifyCode: {
        type: String,
        required: [true, "Please provide a verify code"],
    },
    isverified: {
        type: Boolean,
        default: false
    },
    verifyCodeExpires: {
        type: Date
    },
    isAcceptingMessages: {
        type: Boolean,
        default: true
    },
    messages: [messageSchema]
});

const userModel = ( mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", userSchema);

export default userModel