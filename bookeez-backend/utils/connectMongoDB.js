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

export default connectMongoDB;
