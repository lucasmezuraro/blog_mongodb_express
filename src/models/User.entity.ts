import { Schema, model, Document } from "mongoose"

export type UserType = Document & {
    username: string,
    email: string,
    password: string,
}

export const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }
}, {timestamps: true});

export const User = model<UserType>('User', userSchema);