import mongoose from "mongoose";
const connectDB = async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`MongoDB connected: ${conn.connection.host}`);
        
    } catch (error) {
        console.error(`MongoDB connection failed: ${error.message}`);
        setTimeout(connectDB, 5000);
        
    }
}
export default connectDB
