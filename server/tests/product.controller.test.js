import { expect } from 'chai';
import sinon from 'sinon';
import ProductController from '#app/src/controllers/product.controller.js';
import Product from '#app/src/sequelize/models/product.model.js';
import ProductMongoose from '#app/src/mongoose/models/product.model.js';
import ProductCategory from '#app/src/sequelize/models/product-category.model.js';
import Promotion from '#app/src/sequelize/models/promotion.model.js';

describe('ProductController', () => {
    let req, res, sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        req = {
            params: {},
            query: {},
        };
        res = {
            error: sandbox.stub(),
            success: sandbox.stub(),
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('findOne', () => {
        it('should return a product by slug', async () => {
            req.params.slugOrId = 'test-product';
            const mockProduct = {
                id: 1,
                name: 'Test Product',
                toJsonWithVirtuals: sandbox.stub().resolves({
                    id: 1,
                    name: 'Test Product',
                    discountedPrice: 90,
                }),
            };
            sandbox.stub(Product, 'findOne').resolves(mockProduct);

            await ProductController.findOne(req, res);

            expect(Product.findOne.calledWith({
                include: [ProductCategory, Promotion],
                where: { slug: 'test-product' },
            })).to.be.true;
            expect(res.success.calledOnce).to.be.true;
            expect(res.success.firstCall.args[0]).to.deep.equal({
                id: 1,
                name: 'Test Product',
                discountedPrice: 90,
            });
        });

        it('should return an error if product is not found', async () => {
            req.params.slugOrId = 'nonexistent';
            sandbox.stub(Product, 'findOne').resolves(null);

            await ProductController.findOne(req, res);

            expect(res.error.calledOnce).to.be.true;
            expect(res.error.firstCall.args[0]).to.equal('Erreur de validation');
            expect(res.error.firstCall.args[1]).to.equal(404);
            expect(res.error.firstCall.args[2][0].message).to.equal('Produit non trouvé');
        });
    });

    describe('list', () => {
        it('should return a list of products', async () => {
            req.query = { page: '1', limit: '10' };
            const mockProducts = [{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }];
            sandbox.stub(ProductMongoose, 'countDocuments').resolves(2);
            sandbox.stub(ProductMongoose, 'find').returns({
                sort: sandbox.stub().returnsThis(),
                skip: sandbox.stub().returnsThis(),
                limit: sandbox.stub().resolves(mockProducts),
            });

            await ProductController.list(req, res);

            expect(ProductMongoose.countDocuments.calledOnce).to.be.true;
            expect(ProductMongoose.find.calledOnce).to.be.true;
            expect(res.success.calledOnce).to.be.true;
            expect(res.success.firstCall.args[0]).to.have.property('data').that.deep.equals(mockProducts);
            expect(res.success.firstCall.args[0]).to.have.property('pagination');
        });

        it('should handle errors when fetching products fails', async () => {
            req.query = { page: '1', limit: '10' };
            sandbox.stub(ProductMongoose, 'countDocuments').rejects(new Error('Database error'));

            await ProductController.list(req, res);

            expect(res.error.calledOnce).to.be.true;
            expect(res.error.firstCall.args[0]).to.equal('Une erreur est survenue');
            expect(res.error.firstCall.args[1]).to.equal(500);
        });
    });
});