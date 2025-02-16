import mongoose from 'mongoose';

 const paymentSchema = new mongoose.Schema({
    paymentId: { type: String, required: true },
    templateId: { type: String },
    userId: { type: String, required: true },
    bookId: { type: String },
    amount: { type: Number, required: true }
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;