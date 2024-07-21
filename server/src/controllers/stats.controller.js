import StatsRepository  from "#app/src/mongoose/repositories/stats.repository.js";
import {handleError} from "#app/src/utils/error.util.js";

class StatsController {
    static async getStockPerMonth(req, res) {
        try {
            const { productId, year } = req.query;
            const data = await StatsRepository.getStockPerMonth(productId, parseInt(year));
            res.success(data);
        } catch (error) {
            handleError(res,error);
        }
    }

    static async getSalesByYears(req, res) {
        try {
            const data = await StatsRepository.getSalesByYears();
            res.success(data);
        } catch (error) {
            handleError(res,error);
        }
    }

    static async getSalesByMonth(req, res) {
        try {
            const { year } = req.params;
            const data = await StatsRepository.getSalesByMonth(parseInt(year));
            res.success(data);
        } catch (error) {
            handleError(res,error);
        }
    }

    static async getUserByMonth(req, res) {
        try {
            const { year } = req.params;
            const data = await StatsRepository.getUserByMonth(parseInt(year));
            res.success(data);
        } catch (error) {
            handleError(res,error);
        }
    }

    static async getMostSoldProductByMonth(req, res) {
        try {
            const { year } = req.params;
            const data = await StatsRepository.getMostSoldProductByMonth(parseInt(year));
            res.success(data);
        } catch (error) {
            handleError(res,error);
        }
    }
    static async getProductSalesEvolution(req, res) {
        try {
            const { productId, year } = req.query;
            const data = await StatsRepository.getProductSalesEvolution(productId, parseInt(year));
            res.success(data);
        } catch (error) {

            handleError(res,error);
        }
    }
}
export default StatsController;

