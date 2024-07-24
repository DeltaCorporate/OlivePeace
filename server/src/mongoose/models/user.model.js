import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    _id: String,
    email: String,
    zipCode: String,
    address: String,
    city: String,
    firstName: String,
    lastName: String,
    roles: [String],
    isConfirmed: Boolean,
    createdAt: Date,
    updatedAt: Date
}, { versionKey: false });

const User = mongoose.model('User', UserSchema);

export default User;