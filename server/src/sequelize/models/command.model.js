import { Model, DataTypes } from 'sequelize';
import db from './index.js';
import User from './user.model.js';
import {denormalizeCommande} from "#app/src/services/denormalizations/command.denormalizer.js";
import CommandMongoose from '../../mongoose/models/command.model.js';

class Command extends Model {
    calculateTotalPrice() {
        return this.CommandDetails.reduce((total, detail) => {
            const price = detail.price * detail.quantity;
            const discount = price * (detail.promotionValue / 100);
            return total + (price - discount);
        }, 0);
    }
}

Command.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV7,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        references: {
            model: User,
            key: 'id'
        }
    },
    isPaid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    paymentFailedMessage: {
        type: DataTypes.STRING,
        allowNull: true
    },
    deliveryStatus: {
        type: DataTypes.ENUM('processing', 'shipping', 'delivered', 'delivery_issue'),
        defaultValue: 'processing'
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize: db.sequelize,
    modelName: 'Command',
    underscored: true
});

Command.belongsTo(User);
User.hasMany(Commande);

Command.addHook('afterCreate', async (commande, options) => {
    await denormalizeCommande(commande);
});

Command.addHook('afterUpdate', async (commande, options) => {
    await denormalizeCommande(commande);
});

Command.addHook('afterDestroy', async (commande, options) => {
    try {
        await CommandMongoose.findByIdAndDelete(commande.id);
    } catch (error) {
        console.error('Failed to delete commande in MongoDB:', error);
    }
});

export default Command;