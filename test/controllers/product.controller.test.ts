import { Request, Response } from 'express';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);

const { expect } = chai;

const Product = {
    findOne: sinon.stub(),
};
const ProductMongoose = {
    countDocuments: sinon.stub(),
    find: sinon.stub(),
};
const ProductCategory = {};
const Promotion = {};
const getPagination = sinon.stub();
const getPagedData = sinon.stub();
const handleError = sinon.stub();
const MongooseFilter = sinon.stub();
const toJsonWithVirtuals = sinon.stub();

const ProductController = proxyquire('../../src/controllers/product.controller', {
    '../sequelize/models/product.model': Product,
    '../mongoose/models/product.model': ProductMongoose,
    '../utils/pagination.util': { getPagination, getPagedData },
    '../utils/error.util': { handleError },
    '../services/filters/mongoose.filter': MongooseFilter,
    '#app/src/validations/errors.messages': { ProductMessage: { notFound: 'Product not found' }, GlobalMessage: { validationError: 'Validation error' } },
    '#app/src/sequelize/models/product-category.model': ProductCategory,
    '#app/src/sequelize/models/promotion.model': Promotion,
}).default;

describe('Product Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let sandbox: sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        req = {
            params: {},
            query: {},
            body: {},
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
            created: sinon.stub(),
            error: sinon.stub(),
            success: sinon.stub(),
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('findOne', () => {
        it('should return a product if found', async () => {
            const product = {
                toJsonWithVirtuals: toJsonWithVirtuals.resolves({ name: 'Test Product' }),
            };
            Product.findOne.resolves(product);

            req.params = { slugOrId: '1' };

            await ProductController.findOne(req as Request, res as Response);

            expect(Product.findOne.calledOnce).to.be.true;
            expect(toJsonWithVirtuals.calledOnce).to.be.true;
            expect((res.success as sinon.SinonStub).calledOnce).to.be.true;
        });

        it('should return an error if product is not found', async () => {
            Product.findOne.resolves(null);

            req.params = { slugOrId: '1' };

            await ProductController.findOne(req as Request, res as Response);

            expect(Product.findOne.calledOnce).to.be.true;
            expect((res.error as sinon.SinonStub).calledOnce).to.be.true;
            expect((res.error as sinon.SinonStub).calledWith('Validation error', 404, [{ message: 'Product not found' }])).to.be.true;
        });

        it('should handle errors correctly', async () => {
            const error = new Error('Test Error');
            Product.findOne.rejects(error);

            req.params = { slugOrId: '1' };

            await ProductController.findOne(req as Request, res as Response);

            expect(Product.findOne.calledOnce).to.be.true;
            expect(handleError.calledOnce).to.be.true;
            expect(handleError.calledWith(res, error)).to.be.true;
        });
    });

    describe('list', () => {
        it('should return a list of products', async () => {
            const products = [{ name: 'Product 1' }, { name: 'Product 2' }];
            const totalItems = 2;

            getPagination.returns({ limit: 10, offset: 0 });
            MongooseFilter.prototype.applyFilters.returns({ filter: {}, sort: {} });
            ProductMongoose.countDocuments.resolves(totalItems);
            ProductMongoose.find.resolves(products);
            getPagedData.returns({ products, totalItems });

            req.query = { page: '1', limit: '10' };

            await ProductController.list(req as Request, res as Response);

            expect(ProductMongoose.countDocuments.calledOnce).to.be.true;
            expect(ProductMongoose.find.calledOnce).to.be.true;
            expect(getPagedData.calledOnce).to.be.true;
            expect((res.success as sinon.SinonStub).calledOnce).to.be.true;
        });

        it('should handle errors correctly', async () => {
            const error = new Error('Test Error');
            ProductMongoose.countDocuments.rejects(error);

            req.query = { page: '1', limit: '10' };

            await ProductController.list(req as Request, res as Response);

            expect(ProductMongoose.countDocuments.calledOnce).to.be.true;
            expect(handleError.calledOnce).to.be.true;
            expect(handleError.calledWith(res, error)).to.be.true;
        });
    });
});
