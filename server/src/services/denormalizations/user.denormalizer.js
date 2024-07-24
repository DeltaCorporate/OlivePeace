import UserMongoose from '../../mongoose/models/user.model.js';

export const denormalizeUser = async (user) => {
    try {
        const userData = user.toJSON();
        userData.isConfirmed = user.isConfirmed();
        await UserMongoose.findByIdAndUpdate(user.id, userData, { upsert: true, new: true });
    } catch (error) {
        console.error('Failed to denormalize user in MongoDB:', error);
    }
};