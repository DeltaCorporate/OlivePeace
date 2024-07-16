import { FindOptions } from 'sequelize';
import Stock from '../../sequelize/models/stock.model.js';
import AbstractRepository from "./abstract.repository.js";

class StockRepository extends AbstractRepository {
    constructor(idOrInstance) {
        super(Stock, idOrInstance);
    }

    static async isStockExist(productId: number, location: string) {
        const options: FindOptions = {
            where: { productId, location },
            attributes: ['id', 'productId', 'location', 'quantity', 'createdAt', 'updatedAt'],
            sort: [],
            filter: {},
            page: 1
        };
        return await Stock.findOne(options);
    }
}

export default StockRepository;
