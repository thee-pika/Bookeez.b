import mongoose from 'mongoose';

export const sellerSchema = new mongoose.Schema({
  userId:  { type: String},
  name: { type: String, required: true },
  address: { type: String, required: true },
  email: { type: String }
}, {timestamps: true})

