import { expect } from 'chai';
import sinon from 'sinon';
import ProductCategoryController from '#app/src/controllers/admin/product-category.controller.js';
import ProductCategory from '#app/src/sequelize/models/product-category.model.js';
import ProductCategoryMongoose from '#app/src/mongoose/models/product-category.model.js';
import { deleteUploadedFile, moveTmpToUpload } from '#app/src/utils/file.util.js';
import PromotionRepository from '#app/src/sequelize/repositories/promotion.repository.js';

describe('Admin ProductCategoryController', () => {
    let req, res, sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        req = {
            params: {},
            body: {},
            file: { filename: 'test.jpg' },
        };
        res = {
            error: sandbox.stub(),
            created: sandbox.stub(),
            success: sandbox.stub(),
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('create', () => {
        it('should create a new product category', async () => {
            req.body = {
                name: 'Test Category',
                description: 'Test Description',
                PromotionId: 1,
            };
            const mockCategory = { id: 1, ...req.body };
            sandbox.stub(ProductCategory, 'create').resolves(mockCategory);
            sandbox.stub(moveTmpToUpload);
            sandbox.stub(PromotionRepository, 'isPromotionExistAndNotExpired').resolves(true);

            await ProductCategoryController.create(req, res);

            expect(moveTmpToUpload.calledWith('test.jpg')).to.be.true;
            expect(ProductCategory.create.calledOnce).to.be.true;
            expect(res.created.calledWith(mockCategory)).to.be.true;
        });

        it('should return error for invalid input', async () => {
            req.body = { name: 'Test' }; // Missing required fields

            await ProductCategoryController.create(req, res);

            expect(res.error.calledOnce).to.be.true;
            expect(res.error.firstCall.args[0]).to.equal('Erreur de validation');
            expect(res.error.firstCall.args[1]).to.equal(422);
        });
    });

    describe('update', () => {
        it('should update an existing product category', async () => {
            req.params.id = '1';
            req.body = {
                name: 'Updated Category',
                PromotionId: 2,
            };
            const mockCategory = {
                id: 1,
                name: 'Old Category',
                imageName: 'old.jpg',
                update: sandbox.stub().resolves(),
            };
            sandbox.stub(ProductCategory, 'findByPk').resolves(mockCategory);
            sandbox.stub(deleteUploadedFile);
            sandbox.stub(moveTmpToUpload);
            sandbox.stub(PromotionRepository, 'isPromotionExistAndNotExpired').resolves(true);

            await ProductCategoryController.update(req, res);

            expect(deleteUploadedFile.calledWith('old.jpg')).to.be.true;
            expect(moveTmpToUpload.calledWith('test.jpg')).to.be.true;
            expect(mockCategory.update.calledWith(req.body)).to.be.true;
            expect(res.success.calledWith(mockCategory)).to.be.true;
        });

        it('should return error if category is not found', async () => {
            req.params.id = '999';
            sandbox.stub(ProductCategory, 'findByPk').resolves(null);

            await ProductCategoryController.update(req, res);

            expect(res.error.calledOnce).to.be.true;
            expect(res.error.firstCall.args[0]).to.equal('Erreur de validation');
            expect(res.error.firstCall.args[1]).to.equal(422);
        });
    });

    describe('getAll', () => {
        it('should return all product categories', async () => {
            const mockCategories = [{ id: 1, name: 'Category 1' }, { id: 2, name: 'Category 2' }];
            sandbox.stub(ProductCategoryMongoose, 'find').returns({
                sort: sandbox.stub().returnsThis(),
                exec: sandbox.stub().resolves(mockCategories),
            });

            await ProductCategoryController.getAll(req, res);

            expect(ProductCategoryMongoose.find.calledOnce).to.be.true;
            expect(res.success.calledWith(mockCategories)).to.be.true;
        });

        it('should handle errors when fetching categories', async () => {
            sandbox.stub(ProductCategoryMongoose, 'find').throws(new Error('Database error'));

            await ProductCategoryController.getAll(req, res);

            expect(res.error.calledOnce).to.be.true;
        });
    });

    describe('delete', () => {
        it('should delete a product category', async () => {
            req.params.id = '1';
            const mockCategory = {
                id: 1,
                imageName: 'test.jpg',
                destroy: sandbox.stub().resolves(),
            };
            sandbox.stub(ProductCategory, 'findByPk').resolves(mockCategory);
            sandbox.stub(deleteUploadedFile);

            await ProductCategoryController.delete(req, res);

            expect(deleteUploadedFile.calledWith('test.jpg')).to.be.true;
            expect(mockCategory.destroy.calledOnce).to.be.true;
            expect(res.status(204).send.calledOnce).to.be.true;
        });

        it('should return error if category is not found', async () => {
            req.params.id = '999';
            sandbox.stub(ProductCategory, 'findByPk').resolves(null);

            await ProductCategoryController.delete(req, res);

            expect(res.error.calledOnce).to.be.true;
            expect(res.error.firstCall.args[0]).to.equal('Erreur de validation');
            expect(res.error.firstCall.args[1]).to.equal(404);
        });
    });
});