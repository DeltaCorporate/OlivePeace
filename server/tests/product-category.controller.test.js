import { expect } from 'chai';
import sinon from 'sinon';
import ProductCategoryController from '#app/src/controllers/product-category.controller.js';
import ProductCategory from '#app/src/sequelize/models/product-category.model.js';
import ProductCategoryMongoose from '#app/src/mongoose/models/product-category.model.js';
import ProductMongoose from '#app/src/mongoose/models/product.model.js';
import Promotion from '#app/src/sequelize/models/promotion.model.js';

describe('ProductCategoryController', () => {
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
        it('should return a category by slug', async () => {
            req.params.slugOrId = 'test-category';
            const mockCategory = {
                id: 1,
                name: 'Test Category',
                slug: 'test-category',
            };
            sandbox.stub(ProductCategory, 'findOne').resolves(mockCategory);

            await ProductCategoryController.findOne(req, res);

            expect(ProductCategory.findOne.calledWith({
                where: { slug: 'test-category' },
                include: Promotion,
            })).to.be.true;
            expect(res.success.calledOnce).to.be.true;
            expect(res.success.firstCall.args[0]).to.deep.equal(mockCategory);
        });

        it('should return an error if category is not found', async () => {
            req.params.slugOrId = 'nonexistent';
            sandbox.stub(ProductCategory, 'findOne').resolves(null);

            await ProductCategoryController.findOne(req, res);

            expect(res.error.calledOnce).to.be.true;
            expect(res.error.firstCall.args[0]).to.equal('Erreur de validation');
            expect(res.error.firstCall.args[1]).to.equal(404);
            expect(res.error.firstCall.args[2][0].message).to.equal('Catégorie de produit non trouvée');
        });
    });

    describe('products', () => {
        it('should return products for a category', async () => {
            req.params.slugOrId = 'test-category';
            req.query = { page: '1', limit: '10' };
            const mockCategory = { id: 1, name: 'Test Category' };
            const mockProducts = [{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }];

            sandbox.stub(ProductCategory, 'findOne').resolves(mockCategory);
            sandbox.stub(ProductMongoose, 'countDocuments').resolves(2);
            sandbox.stub(ProductMongoose, 'find').returns({
                sort: sandbox.stub().returnsThis(),
                skip: sandbox.stub().returnsThis(),
                limit: sandbox.stub().resolves(mockProducts),
            });

            await ProductCategoryController.products(req, res);

            expect(ProductCategory.findOne.calledOnce).to.be.true;
            expect(ProductMongoose.countDocuments.calledOnce).to.be.true;
            expect(ProductMongoose.find.calledOnce).to.be.true;
            expect(res.success.calledOnce).to.be.true;
            expect(res.success.firstCall.args[0]).to.have.property('data').that.deep.equals(mockProducts);
            expect(res.success.firstCall.args[0]).to.have.property('pagination');
        });

        it('should return an error if category is not found', async () => {
            req.params.slugOrId = 'nonexistent';
            sandbox.stub(ProductCategory, 'findOne').resolves(null);

            await ProductCategoryController.products(req, res);

            expect(res.error.calledOnce).to.be.true;
            expect(res.error.firstCall.args[0]).to.equal('Erreur de validation');
            expect(res.error.firstCall.args[1]).to.equal(404);
            expect(res.error.firstCall.args[2][0].message).to.equal('Catégorie de produit non trouvée');
        });
    });

    describe('list', () => {
        it('should return a list of categories', async () => {
            req.query = { page: '1', limit: '10' };
            const mockCategories = [{ id: 1, name: 'Category 1' }, { id: 2, name: 'Category 2' }];
            sandbox.stub(ProductCategoryMongoose, 'countDocuments').resolves(2);
            sandbox.stub(ProductCategoryMongoose, 'find').returns({
                sort: sandbox.stub().returnsThis(),
                skip: sandbox.stub().returnsThis(),
                limit: sandbox.stub().resolves(mockCategories),
            });

            await ProductCategoryController.list(req, res);

            expect(ProductCategoryMongoose.countDocuments.calledOnce).to.be.true;
            expect(ProductCategoryMongoose.find.calledOnce).to.be.true;
            expect(res.success.calledOnce).to.be.true;
            expect(res.success.firstCall.args[0]).to.have.property('data').that.deep.equals(mockCategories);
            expect(res.success.firstCall.args[0]).to.have.property('pagination');
        });

        it('should handle errors when fetching categories fails', async () => {
            req.query = { page: '1', limit: '10' };
            sandbox.stub(ProductCategoryMongoose, 'countDocuments').rejects(new Error('Database error'));

            await ProductCategoryController.list(req, res);

            expect(res.error.calledOnce).to.be.true;
            expect(res.error.firstCall.args[0]).to.equal('Une erreur est survenue');
            expect(res.error.firstCall.args[1]).to.equal(500);
        });
    });
});