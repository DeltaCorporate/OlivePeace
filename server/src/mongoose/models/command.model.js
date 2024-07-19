import { Schema, model } from 'mongoose';
import CommandDetailSchema from './command-detail.model.js';
import Commande from "#app/src/sequelize/models/command.model.js";

const CommandSchema = new Schema({
    _id: String,
    userId: String,
    isPaid: Boolean,
    paymentFailedMessage: String,
    deliveryStatus: String,
    price: Number,
    commandeDetails: [CommandDetailSchema],
    createdAt: Date,
    updatedAt: Date
}, { versionKey: false });

const Command = model('Command', CommandSchema);

export default Command;
