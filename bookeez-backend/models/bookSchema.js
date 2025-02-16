import mongoose from 'mongoose';
import { sellerSchema } from './buyerSchema.js';

export const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    price: { type: Number, required: true },
    isbn: { type: String, required: true },
    subject: { type: String, required: true },
    stream: { type: String, required: true },
    description: { type: String, required: true },
    semester: { type: String, required: true },
    condition: { type: String, required: true },
    imageUrl: { type: String, required: true },
    sellerDetails: sellerSchema
}, {timestamps: true});
