import mongoose from 'mongoose';
import User from './userModel.js';

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  price: { type: Number, required: true },
  isbn: { type: String, required: true },
  subject: { type: String, required: true },
  stream: { type: String, required: true },
  description: { type: String, required: true },
  semester: { type: String, required: true },
  condition : {type: String, required: true},
  imageUrl : {type: String, required: true},
});

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref:User },
  username: { type: String},
  comment:{ type: String, required: true },
  rating: { type: Number, required: true , min:1, max:5},
  date:{ type: Date, default: Date.now},
})

const templateSchema = new mongoose.Schema({
  template_name: { type: String, required: true },
  defaultValues: {
    title: { type: String, required: true },
    author: { type: String, required: true },
    price: { type: Number, required: true },
    isbn: { type: String, required: true },
    subject: { type: String, required: true },
    stream: { type: String, required: true },
    description: { type: String, required: true },
    semester: { type: String, required: true },
    condition : {type: String, required: true},
    imageUrl : {type: String, required: true},
  },
  books: [bookSchema],
  reviews: [reviewSchema]
});

const Template = mongoose.model('Template', templateSchema);

export default Template;
