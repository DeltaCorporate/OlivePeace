import { Request, Response } from 'express';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';

chai.use(chaiHttp);

const { expect } = chai;

const Cart = {
    findById: sinon.stub(),
    findOne: sinon.stub(),
    find: sinon.stub(),
    save: sinon.stub(),
    remove: sinon.stub(),
};
const Product = {
    findByPk: sinon.stub(),
};
const customJoi = {
    object: sinon.stub().returnsThis(),
    string: sinon.stub().returnsThis(),
    array: sinon.stub().returnsThis(),
    items: sinon.stub().returnsThis(),
    required: sinon.stub().returnsThis(),
    validateAsync: sinon.stub(),
};
const getPagedData = sinon.stub();
const handleError = sinon.stub();
const updateCartWithVersioning = sinon.stub();
const performTransactionalOperation = sinon.stub();

const CartController = proxyquire('../../src/controllers/CartController', {
    '../mongoose/models/cart.model': Cart,
    '../sequelize/models/product.model': Product,
    '#shared/config/joi.config': customJoi,
    '../utils/pagination.util': { getPagedData },
    '../utils/error.util': { handleError },
    '../utils/cart.util': { updateCartWithVersioning, performTransactionalOperation },
}).default;

describe('Cart Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let sandbox: sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        req = {
            params: {},
            query: {},
            body: {},
            user: { _id: new mongoose.Types.ObjectId() }
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
            created: sinon.stub(),
            error: sinon.stub(),
            success: sinon.stub(),
            send: sinon.stub()
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('create', () => {
        it('should create a cart and return it', async () => {
            const data = {
                userId: '12345',
                items: [{ product: '12345', quantity: 2 }]
            };

            req.body = data;

            const product = { price: 100 };
            Product.findByPk.resolves(product);
            customJoi.validateAsync.resolves();

            const cart = {
                save: sinon.stub().resolves(),
                toObject: () => data
            };

            Cart.save.resolves(cart);

            await CartController.create(req as Request, res as Response, sinon.stub());

            expect(customJoi.validateAsync.calledOnce).to.be.true;
            expect(Product.findByPk.calledOnce).to.be.true;
            expect(Cart.save.calledOnce).to.be.true;
            expect((res.created as sinon.SinonStub).calledOnce).to.be.true;
        });

        it('should return an error if product is not found', async () => {
            const data = {
                userId: '12345',
                items: [{ product: '12345', quantity: 2 }]
            };

            req.body = data;

            Product.findByPk.resolves(null);
            customJoi.validateAsync.resolves();

            await CartController.create(req as Request, res as Response, sinon.stub());

            expect(customJoi.validateAsync.calledOnce).to.be.true;
            expect(Product.findByPk.calledOnce).to.be.true;
            expect((res.error as sinon.SinonStub).calledOnce).to.be.true;
        });
    });

    describe('update', () => {
        it('should update a cart successfully', async () => {
            const data = {
                items: [{ product: '12345', quantity: 2 }]
            };

            req.params = { cartId: '12345' };
            req.body = data;

            customJoi.validateAsync.resolves();
            performTransactionalOperation.resolves();

            await CartController.update(req as Request, res as Response, sinon.stub());

            expect(customJoi.validateAsync.calledOnce).to.be.true;
            expect(performTransactionalOperation.calledOnce).to.be.true;
            expect((res.success as sinon.SinonStub).calledOnce).to.be.true;
        });
    });

    describe('delete', () => {
        it('should delete a cart', async () => {
            const cart = { remove: sinon.stub().resolves() };
            Cart.findById.resolves(cart);

            req.params = { cartId: '12345' };

            await CartController.delete(req as Request, res as Response, sinon.stub());

            expect(Cart.findById.calledOnce).to.be.true;
            expect(cart.remove.calledOnce).to.be.true;
            expect((res.status as sinon.SinonStub).calledWith(204)).to.be.true;
        });

        it('should return an error if cart is not found', async () => {
            Cart.findById.resolves(null);

            req.params = { cartId: '12345' };

            await CartController.delete(req as Request, res as Response, sinon.stub());

            expect(Cart.findById.calledOnce).to.be.true;
            expect((res.error as sinon.SinonStub).calledOnce).to.be.true;
        });
    });

    describe('findOne', () => {
        it('should return a cart if found', async () => {
            const cart = { _id: '12345' };
            Cart.findById.resolves(cart);

            req.params = { cartId: '12345' };

            await CartController.findOne(req as Request, res as Response, sinon.stub());

            expect(Cart.findById.calledOnce).to.be.true;
            expect((res.success as sinon.SinonStub).calledOnce).to.be.true;
        });

        it('should return an error if cart is not found', async () => {
            Cart.findById.resolves(null);

            req.params = { cartId: '12345' };

            await CartController.findOne(req as Request, res as Response, sinon.stub());

            expect(Cart.findById.calledOnce).to.be.true;
            expect((res.error as sinon.SinonStub).calledOnce).to.be.true;
        });
    });

    describe('getCart', () => {
        it('should return the user\'s cart', async () => {
            const cart = {
                items: [{ product: { _id: '12345' }, quantity: 2, reserved: false, reservationExpiry: null }],
                totalPrice: 200
            };
            Cart.findOne.resolves(cart);
            Product.findByPk.resolves({ id: '12345', name: 'Test Product', price: 100, image: 'image.jpg' });

            await CartController.getCart(req as Request, res as Response, sinon.stub());

            expect(Cart.findOne.calledOnce).to.be.true;
            expect(Product.findByPk.calledOnce).to.be.true;
            expect((res.send as sinon.SinonStub).calledOnce).to.be.true;
        });

        it('should return an error if cart is not found', async () => {
            Cart.findOne.resolves(null);

            await CartController.getCart(req as Request, res as Response, sinon.stub());

            expect(Cart.findOne.calledOnce).to.be.true;
            expect((res.status as sinon.SinonStub).calledWith(404)).to.be.true;
        });
    });

    describe('reserveItems', () => {
        it('should reserve items in the cart', async () => {
            const cart = {
                items: [{ reserved: false, reservationExpiry: null }],
                save: sinon.stub().resolves()
            };
            Cart.findById.resolves(cart);

            req.params = { cartId: '12345' };

            await CartController.reserveItems(req as Request, res as Response, sinon.stub());

            expect(Cart.findById.calledOnce).to.be.true;
            expect(cart.save.calledOnce).to.be.true;
            expect((res.success as sinon.SinonStub).calledOnce).to.be.true;
        });

        it('should return an error if cart is not found', async () => {
            Cart.findById.resolves(null);

            req.params = { cartId: '12345' };

            await CartController.reserveItems(req as Request, res as Response, sinon.stub());

            expect(Cart.findById.calledOnce).to.be.true;
            expect((res.error as sinon.SinonStub).calledOnce).to.be.true;
        });
    });

    describe('releaseExpiredReservations', () => {
        it('should release expired reservations', async () => {
            const carts = [{
                items: [
                    { reserved: true, reservationExpiry: new Date(Date.now() - 1000) }
                ],
                save: sinon.stub().resolves()
            }];

            Cart.find.resolves(carts);

            await CartController.releaseExpiredReservations();

            expect(Cart.find.calledOnce).to.be.true;
            expect(carts[0].save.calledOnce).to.be.true;
        });
    });
});
