import { Document, Schema, model } from "mongoose";
import { UserType, userSchema } from "./User.entity";
import { CategoryType, categorySchema } from "./Category.entity";

export type PostType = Document & {
    title: string,
    author: UserType,
    content: string,
    category: CategoryType
}

const postSchema = new Schema({
    title: {
        required: true,
        unique: true,
        index: true,
        type: String
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String
    }
}, {timestamps: true});

export const Post = model<PostType>('Post', postSchema);