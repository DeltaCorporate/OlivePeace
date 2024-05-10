import mongoose from "mongoose";
async function mdb_connect() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
    }
}
export {mongoose as mdb, mdb_connect};




