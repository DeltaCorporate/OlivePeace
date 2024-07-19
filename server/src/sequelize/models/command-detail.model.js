import { Model, DataTypes } from 'sequelize';
import db from './index.js';
import Commande from './command.model.js';
import Promotion from './promotion.model.js';

class CommandeDetail extends Model {}

CommandeDetail.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV7,
        primaryKey: true
    },
    commandeId: {
        type: DataTypes.UUID,
        references: {
            model: Commande,
            key: 'id'
        }
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    imageName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    promotionName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    promotionValue: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true
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
    modelName: 'CommandeDetail',
    underscored: true
});

CommandeDetail.belongsTo(Commande);
Commande.hasMany(CommandeDetail);

CommandeDetail.belongsTo(Promotion);
Promotion.hasMany(CommandeDetail);

export default CommandeDetail;