import { expect } from 'chai';
import sinon from 'sinon';
import ProductController from '#app/src/controllers/admin/product.controller.js';
import Product from '#app/src/sequelize/models/product.model.js';
import ProductMongoose from '#app/src/mongoose/models/product.model.js';
import { deleteUploadedFile, moveTmpToUpload } from '#app/src/utils/file.util.js';

describe('Admin ProductController', () => {
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
        it('should create a new product', async () => {
            req.body = {
                name: 'Test Product',
                brand: 'Test Brand',
                description: 'Test Description',
                price: 99.99,
                stock: 10,
                ProductCategoryId: 1,
            };
            const mockProduct = { id: 1, ...req.body };
            sandbox.stub(Product, 'create').resolves(mockProduct);
            sandbox.stub(moveTmpToUpload);

            await ProductController.create(req, res);

            expect(moveTmpToUpload.calledWith('test.jpg')).to.be.true;
            expect(Product.create.calledOnce).to.be.true;
            expect(res.created.calledWith(mockProduct)).to.be.true;
        });

        it('should return error for invalid input', async () => {
            req.body = { name: 'Test' }; // Missing required fields

            await ProductController.create(req, res);

            expect(res.error.calledOnce).to.be.true;
            expect(res.error.firstCall.args[0]).to.equal('Erreur de validation');
            expect(res.error.firstCall.args[1]).to.equal(422);
        });
    });

    describe('update', () => {
        it('should update an existing product', async () => {
            req.params.id = '1';
            req.body = {
                name: 'Updated Product',
                price: 129.99,
            };
            const mockProduct = {
                id: 1,
                name: 'Old Product',
                price: 99.99,
                imageName: 'old.jpg',
                update: sandbox.stub().resolves(),
            };
            sandbox.stub(Product, 'findByPk').resolves(mockProduct);
            sandbox.stub(deleteUploadedFile);
            sandbox.stub(moveTmpToUpload);

            await ProductController.update(req, res);

            expect(deleteUploadedFile.calledWith('old.jpg')).to.be.true;
            expect(moveTmpToUpload.calledWith('test.jpg')).to.be.true;
            expect(mockProduct.update.calledWith(req.body)).to.be.true;
            expect(res.success.calledWith(mockProduct)).to.be.true;
        });

        it('should return error if product is not found', async () => {
            req.params.id = '999';
            sandbox.stub(Product, 'findByPk').resolves(null);

            await ProductController.update(req, res);

            expect(res.error.calledOnce).to.be.true;
            expect(res.error.firstCall.args[0]).to.equal('Erreur de validation');
            expect(res.error.firstCall.args[1]).to.equal(422);
        });
    });

    describe('findAll', () => {
        it('should return all products', async () => {
            const mockProducts = [{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }];
            sandbox.stub(ProductMongoose, 'find').returns({
                sort: sandbox.stub().returnsThis(),
                exec: sandbox.stub().resolves(mockProducts),
            });

            await ProductController.findAll(req, res);

            expect(ProductMongoose.find.calledOnce).to.be.true;
            expect(res.success.calledWith(mockProducts)).to.be.true;
        });

        it('should handle errors when fetching products', async () => {
            sandbox.stub(ProductMongoose, 'find').throws(new Error('Database error'));

            await ProductController.findAll(req, res);

            expect(res.error.calledOnce).to.be.true;
        });
    });

    describe('delete', () => {
        it('should delete a product', async () => {
            req.params.id = '1';
            const mockProduct = {
                id: 1,
                imageName: 'test.jpg',
                destroy: sandbox.stub().resolves(),
            };
            sandbox.stub(Product, 'findByPk').resolves(mockProduct);
            sandbox.stub(deleteUploadedFile);

            await ProductController.delete(req, res);

            expect(deleteUploadedFile.calledWith('test.jpg')).to.be.true;
            expect(mockProduct.destroy.calledOnce).to.be.true;
            expect(res.status(204).send.calledOnce).to.be.true;
        });

        it('should return error if product is not found', async () => {
            req.params.id = '999';
            sandbox.stub(Product, 'findByPk').resolves(null);

            await ProductController.delete(req, res);

            expect(res.error.calledOnce).to.be.true;
            expect(res.error.firstCall.args[0]).to.equal('Produit non trouvé');
            expect(res.error.firstCall.args[1]).to.equal(404);
        });
    });
});