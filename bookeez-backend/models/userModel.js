// models/userModel.js
import mongoose from 'mongoose';
import {bookSchema} from './bookSchema.js';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: "user"
  },
  books: [bookSchema],
  cart: [
    {
      template: { type: mongoose.Schema.Types.ObjectId, ref: "Template" },
      quantity: {
        type: Number,
        default: 1
      },
      addedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdAt:{ type: Date, default: Date.now},
});

const User = mongoose.model('User', userSchema);

export default User;