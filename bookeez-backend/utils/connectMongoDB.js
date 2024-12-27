import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();
const mongoURI = process.env.MONGO_URI;

const connectMongoDB = async () => {

try {
   await mongoose.connect(mongoURI)
   console.log("mongodb connected successfully");
} catch (error) {
    console.log("error", error)
}
       
}
// Fm2z3wuETcJn2mck
//mongodb+srv://mogilideepika218:Fm2z3wuETcJn2mck@cluster0.ns6tl.mongodb.net/
export default connectMongoDB;
