import { expect } from 'chai';
import sinon from 'sinon';
import StatsController from '#app/src/controllers/stats.controller.js';
import StatsRepository from '#app/src/mongoose/repositories/stats.repository.js';

describe('StatsController', () => {
    let req, res, sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        req = {
            query: {},
            params: {},
        };
        res = {
            error: sandbox.stub(),
            success: sandbox.stub(),
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('getStockPerMonth', () => {
        it('should return stock data per month', async () => {
            req.query = { productId: '123', year: '2023' };
            const mockData = { labels: ['Jan', 'Feb'], datasets: [10, 20] };
            sandbox.stub(StatsRepository, 'getStockPerMonth').resolves(mockData);

            await StatsController.getStockPerMonth(req, res);

            expect(StatsRepository.getStockPerMonth.calledWith('123', 2023)).to.be.true;
            expect(res.success.calledOnce).to.be.true;
            expect(res.success.firstCall.args[0]).to.deep.equal(mockData);
        });

        it('should handle errors', async () => {
            req.query = { productId: '123', year: '2023' };
            sandbox.stub(StatsRepository, 'getStockPerMonth').rejects(new Error('Database error'));

            await StatsController.getStockPerMonth(req, res);

            expect(res.error.calledOnce).to.be.true;
        });
    });

    describe('getSalesByYears', () => {
        it('should return sales data by years', async () => {
            const mockData = { labels: [2022, 2023], datasets: [1000, 1500] };
            sandbox.stub(StatsRepository, 'getSalesByYears').resolves(mockData);

            await StatsController.getSalesByYears(req, res);

            expect(StatsRepository.getSalesByYears.calledOnce).to.be.true;
            expect(res.success.calledOnce).to.be.true;
            expect(res.success.firstCall.args[0]).to.deep.equal(mockData);
        });

        it('should handle errors', async () => {
            sandbox.stub(StatsRepository, 'getSalesByYears').rejects(new Error('Database error'));

            await StatsController.getSalesByYears(req, res);

            expect(res.error.calledOnce).to.be.true;
        });
    });

    describe('getSalesByMonth', () => {
        it('should return sales data by month', async () => {
            req.params = { year: '2023' };
            const mockData = { labels: ['Jan', 'Feb'], datasets: [1000, 1500] };
            sandbox.stub(StatsRepository, 'getSalesByMonth').resolves(mockData);

            await StatsController.getSalesByMonth(req, res);

            expect(StatsRepository.getSalesByMonth.calledWith(2023)).to.be.true;
            expect(res.success.calledOnce).to.be.true;
            expect(res.success.firstCall.args[0]).to.deep.equal(mockData);
        });

        it('should handle errors', async () => {
            req.params = { year: '2023' };
            sandbox.stub(StatsRepository, 'getSalesByMonth').rejects(new Error('Database error'));

            await StatsController.getSalesByMonth(req, res);

            expect(res.error.calledOnce).to.be.true;
        });
    });

    describe('getUserByMonth', () => {
        it('should return user data by month', async () => {
            req.params = { year: '2023' };
            const mockData = { labels: ['Jan', 'Feb'], datasets: [10, 20] };
            sandbox.stub(StatsRepository, 'getUserByMonth').resolves(mockData);

            await StatsController.getUserByMonth(req, res);

            expect(StatsRepository.getUserByMonth.calledWith(2023)).to.be.true;
            expect(res.success.calledOnce).to.be.true;
            expect(res.success.firstCall.args[0]).to.deep.equal(mockData);
        });

        it('should handle errors', async () => {
            req.params = { year: '2023' };
            sandbox.stub(StatsRepository, 'getUserByMonth').rejects(new Error('Database error'));

            await StatsController.getUserByMonth(req, res);

            expect(res.error.calledOnce).to.be.true;
        });
    });

    describe('getMostSoldProductByMonth', () => {
        it('should return most sold product data by month', async () => {
            req.params = { year: '2023' };
            const mockData = [{ month: 'Jan', productName: 'Product A', salesCount: 100 }];
            sandbox.stub(StatsRepository, 'getMostSoldProductByMonth').resolves(mockData);

            await StatsController.getMostSoldProductByMonth(req, res);

            expect(StatsRepository.getMostSoldProductByMonth.calledWith(2023)).to.be.true;
            expect(res.success.calledOnce).to.be.true;
            expect(res.success.firstCall.args[0]).to.deep.equal(mockData);
        });

        it('should handle errors', async () => {
            req.params = { year: '2023' };
            sandbox.stub(StatsRepository, 'getMostSoldProductByMonth').rejects(new Error('Database error'));

            await StatsController.getMostSoldProductByMonth(req, res);

            expect(res.error.calledOnce).to.be.true;
        });
    });

    describe('getProductSalesEvolution', () => {
        it('should return product sales evolution data', async () => {
            req.query = { productId: '123', year: '2023' };
            const mockData = { labels: ['Jan', 'Feb'], datasets: [10, 20] };
            sandbox.stub(StatsRepository, 'getProductSalesEvolution').resolves(mockData);

            await StatsController.getProductSalesEvolution(req, res);

            expect(StatsRepository.getProductSalesEvolution.calledWith('123', 2023)).to.be.true;
            expect(res.success.calledOnce).to.be.true;
            expect(res.success.firstCall.args[0]).to.deep.equal(mockData);
        });

        it('should handle errors', async () => {
            req.query = { productId: '123', year: '2023' };
            sandbox.stub(StatsRepository, 'getProductSalesEvolution').rejects(new Error('Database error'));

            await StatsController.getProductSalesEvolution(req, res);

            expect(res.error.calledOnce).to.be.true;
        });
    });
});