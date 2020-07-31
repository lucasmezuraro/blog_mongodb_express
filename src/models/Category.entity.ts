import { Schema, model, Document } from "mongoose"

export type CategoryType = Document & {
    description: string
}

export const categorySchema = new Schema({
    description: {
        type: String,
        required: true,
        index: true,
        unique: true
    }
}, {timestamps: true});

export const Category = model<CategoryType>('Category', categorySchema);