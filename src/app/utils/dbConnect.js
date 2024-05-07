// utils/dbConnect.js
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

export default async function dbConnect() {
    try {
        await mongoose.connect(MONGODB_URI, {
        }).then( mongoose => {
                console.log('MongoDB connected successfully');
                return mongoose;
            }
        ).catch(e =>{
            console.log(`Error: ${e}`)
            throw new Error(`Error: ${e}`)
        });
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw new Error(`MongoDB Connection Error: ${error}`);
    }
}
