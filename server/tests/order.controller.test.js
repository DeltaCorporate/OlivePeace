import { expect } from 'chai';
import sinon from 'sinon';
import OrderController from '#app/src/controllers/order.controller.js';
import Order from '#app/src/mongoose/models/order.model.js';

describe('OrderController', () => {
    let req, res, sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        req = {
            params: {},
            query: {},
            user: { id: 'user123' },
        };
        res = {
            error: sandbox.stub(),
            success: sandbox.stub(),
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('list', () => {
        it('should return a list of orders for the user', async () => {
            const mockOrders = [{ _id: 'order1' }, { _id: 'order2' }];
            sandbox.stub(Order, 'countDocuments').resolves(2);
            const mockFind = {
                sort: sandbox.stub().returnsThis(),
                skip: sandbox.stub().returnsThis(),
                limit: sandbox.stub().resolves(mockOrders),
            };
            sandbox.stub(Order, 'find').returns(mockFind);

            await OrderController.list(req, res);

            expect(Order.find.calledWith({ userId: 'user123' })).to.be.true;
            expect(res.success.calledOnce).to.be.true;
            expect(res.success.firstCall.args[0]).to.have.property('data').that.deep.equals(mockOrders);
            expect(res.success.firstCall.args[0]).to.have.property('pagination');
        });

        it('should handle errors when fetching orders fails', async () => {
            sandbox.stub(Order, 'countDocuments').rejects(new Error('Database error'));

            await OrderController.list(req, res);

            expect(res.error.calledOnce).to.be.true;
            expect(res.error.firstCall.args[0]).to.equal('');
            expect(res.error.firstCall.args[1]).to.equal(500);
        });
    });

    describe('findOne', () => {
        it('should return a specific order for the user', async () => {
            req.params.id = 'order123';
            const mockOrder = { _id: 'order123', userId: 'user123' };
            sandbox.stub(Order, 'findOne').resolves(mockOrder);

            await OrderController.findOne(req, res);

            expect(Order.findOne.calledWith({ _id: 'order123', userId: 'user123' })).to.be.true;
            expect(res.success.calledOnce).to.be.true;
            expect(res.success.firstCall.args[0]).to.deep.equal(mockOrder);
        });

        it('should return an error if order is not found', async () => {
            req.params.id = 'nonexistent';
            sandbox.stub(Order, 'findOne').resolves(null);

            await OrderController.findOne(req, res);

            expect(res.error.calledOnce).to.be.true;
            expect(res.error.firstCall.args[0]).to.equal('');
            expect(res.error.firstCall.args[1]).to.equal(404);
            expect(res.error.firstCall.args[2][0].message).to.equal('Commande non trouvée');
        });
    });
});