// models/userModel.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: "user"
  },
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
  fcmToken: {
    type: String,
    required: false, // or true if you require it
  },
  notifications: [
    {
      title: String,
      body: String,
      timestamp: String,
    }
  ],
  createdAt:{ type: Date, default: Date.now},
});

const User = mongoose.model('User', userSchema);

export default User;