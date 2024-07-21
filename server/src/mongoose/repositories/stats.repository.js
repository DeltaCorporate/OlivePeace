// src/mongoose/repositories/stats.repository.js

import StockHistory from '../models/stock-history.model.js';
import Order from '../models/order.model.js';
import User from '../../sequelize/models/user.model.js';
import Product from '../models/product.model.js';
import mongoose from 'mongoose';
import Sequelize from "sequelize";

class StatsRepository {
    static async getStockPerMonth(productId, year) {
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31, 23, 59, 59);

        const stockData = await StockHistory.aggregate([
            {
                $match: {
                    productId: productId,
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    lastStock: { $last: "$stock" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        const labels = Array.from({length: 12}, (_, i) => i + 1);
        const dataset = labels.map(month => {
            const monthData = stockData.find(item => item._id === month);
            return monthData ? monthData.lastStock : null;
        });

        return {
            labels: labels.map(month => new Date(year, month - 1).toLocaleString('fr-FR', { month: 'long' })),
            datasets: dataset
        };
    }

    static async getSalesByYears() {
        const salesData = await Order.aggregate([
            {
                $match: {
                    isPaid: true
                }
            },
            {
                $group: {
                    _id: { $year: "$createdAt" },
                    totalSales: { $sum: "$price" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        return {
            labels: salesData.map(item => item._id),
            datasets: salesData.map(item => item.totalSales)
        };
    }

    static async getSalesByMonth(year) {
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31, 23, 59, 59);

        const salesData = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate },
                    isPaid: true
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    totalSales: { $sum: "$price" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        const labels = Array.from({length: 12}, (_, i) => i + 1);
        const dataset = labels.map(month => {
            const monthData = salesData.find(item => item._id === month);
            return monthData ? monthData.totalSales : 0;
        });

        return {
            labels: labels.map(month => new Date(year, month - 1).toLocaleString('fr-FR', { month: 'long' })),
            datasets: dataset
        };
    }

    static async getUserByMonth(year) {
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31, 23, 59, 59);

        const userData = await User.findAll({
            attributes: [
                [Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('created_at')), 'month'],
                [Sequelize.fn('COUNT', '*'), 'count']
            ],
            where: {
                created_at: {
                    [Sequelize.Op.between]: [startDate, endDate]
                }
            },
            group: [Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('created_at'))],
            order: [[Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('created_at')), 'ASC']],
            raw: true
        });

        const labels = Array.from({length: 12}, (_, i) => i + 1);
        const dataset = labels.map(month => {
            const monthData = userData.find(item => new Date(item.month).getMonth() + 1 === month);
            return monthData ? parseInt(monthData.count) : 0;
        });

        return {
            labels: labels.map(month => new Date(year, month - 1).toLocaleString('fr-FR', { month: 'long' })),
            datasets: dataset
        };
    }

    static async getMostSoldProductByMonth(year) {
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31, 23, 59, 59);

        const salesData = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate },
                    isPaid: true
                }
            },
            { $unwind: "$orderDetails" },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        productId: "$orderDetails.productId"
                    },
                    totalQuantity: { $sum: "$orderDetails.quantity" }
                }
            },
            {
                $sort: { totalQuantity: -1 }
            },
            {
                $group: {
                    _id: "$_id.month",
                    productId: { $first: "$_id.productId" },
                    totalQuantity: { $first: "$totalQuantity" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);


        const productIds = salesData.map(item => item.productId);
        const products = await Product.find({ _id: { $in: productIds } });

        const result = salesData.map(item => {
            const product = products.find(p => p._id.toString() === item.productId.toString());
            return {
                month: new Date(year, item._id - 1).toLocaleString('fr-FR', { month: 'long' }),
                productName: product ? product.name : 'Inconnu',
                productId: item.productId,
                salesCount: item.totalQuantity
            };
        });

        return result;
    }

    static async getProductSalesEvolution(productId, year) {
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31, 23, 59, 59);

        const salesData = await Order.aggregate([
            {
                $match: {
                    isPaid: true,
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            { $unwind: "$orderDetails" },
            {
                $match: {
                    "orderDetails.productId": parseInt(productId)
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    totalSales: { $sum: "$orderDetails.quantity" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        const labels = Array.from({length: 12}, (_, i) => i + 1);
        const dataset = labels.map(month => {
            const monthData = salesData.find(item => item._id === month);
            return monthData ? monthData.totalSales : 0;
        });

        return {
            labels: labels.map(month => new Date(year, month - 1).toLocaleString('fr-FR', { month: 'long' })),
            datasets: dataset
        };
    }

}

export default StatsRepository;