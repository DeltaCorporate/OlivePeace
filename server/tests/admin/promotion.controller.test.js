import { expect } from 'chai';
import sinon from 'sinon';
import PromotionController from '#app/src/controllers/admin/promotion.controller.js';
import Promotion from '#app/src/sequelize/models/promotion.model.js';
import PromotionMongoose from '#app/src/mongoose/models/promotion.model.js';
import PromotionRepository from '#app/src/sequelize/repositories/promotion.repository.js';

describe('Admin PromotionController', () => {
    let req, res, sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        req = {
            params: {},
            body: {},
            query: {},
        };
        res = {
            error: sandbox.stub(),
            created: sandbox.stub(),
            success: sandbox.stub(),
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub(),
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('create', () => {
        it('should create a new promotion', async () => {
            req.body = {
                name: 'Summer Sale',
                value: 20,
                expirationDate: '2023-08-31',
            };
            const mockPromotion = {id: 1, ...req.body};
            sandbox.stub(PromotionRepository, 'isNameTaken').resolves(false);
            sandbox.stub(Promotion, 'create').resolves(mockPromotion);

            await PromotionController.create(req, res);

            expect(Promotion.create.calledOnce).to.be.true;
            expect(res.created.calledWith(mockPromotion)).to.be.true;
        });

        it('should return error if promotion name is already taken', async () => {
            req.body = {
                name: 'Existing Promotion',
                value: 10,
                expirationDate: '2023-12-31',
            };
            sandbox.stub(PromotionRepository, 'isNameTaken').resolves(true);

            await PromotionController.create(req, res);

            expect(res.error.calledOnce).to.be.true;
            expect(res.error.firstCall.args[0]).to.equal('Erreur de validation');
            expect(res.error.firstCall.args[1]).to.equal(422);
        });
    });

    describe('update', () => {
        it('should update an existing promotion', async () => {
            req.params.id = '1';
            req.body = {
                name: 'Updated Promotion',
                value: 25,
            };
            const mockPromotion = {
                id: 1,
                name: 'Old Promotion',
                value: 20,
                update: sandbox.stub().resolves(),
            };
            sandbox.stub(Promotion, 'findByPk').resolves(mockPromotion);
            sandbox.stub(PromotionRepository, 'isNameTaken').resolves(false);

            await PromotionController.update(req, res);

            expect(mockPromotion.update.calledWith(req.body)).to.be.true;
            expect(res.success.calledWith(mockPromotion)).to.be.true;
        });

        it('should return error if promotion is not found', async () => {
            req.params.id = '999';
            sandbox.stub(Promotion, 'findByPk').resolves(null);

            await PromotionController.update(req, res);

            expect(res.error.calledOnce).to.be.true;
            expect(res.error.firstCall.args[0]).to.equal('Erreur de validation');
            expect(res.error.firstCall.args[1]).to.equal(422);
        });
    });

    describe('delete', () => {
        it('should delete a promotion', async () => {
            req.params.id = '1';
            const mockPromotion = {
                id: 1,
                destroy: sandbox.stub().resolves(),
            };
            sandbox.stub(Promotion, 'findByPk').resolves(mockPromotion);

            await PromotionController.delete(req, res);

            expect(mockPromotion.destroy.calledOnce).to.be.true;
            expect(res.status(204).send.calledOnce).to.be.true;
        });

        it('should return error if promotion is not found', async () => {
            req.params.id = '999';
            sandbox.stub(Promotion, 'findByPk').resolves(null);

            await PromotionController.delete(req, res);

            expect(res.error.calledOnce).to.be.true;
            expect(res.error.firstCall.args[0]).to.equal('Promotion non trouvée');
            expect(res.error.firstCall.args[1]).to.equal(404);
        });
    });

    describe('findOne', () => {
        it('should return a specific promotion', async () => {
            req.params.id = '1';
            const mockPromotion = {id: 1, name: 'Test Promotion', value: 15};
            sandbox.stub(Promotion, 'findByPk').resolves(mockPromotion);

            await PromotionController.findOne(req, res);

            expect(Promotion.findByPk.calledWith('1')).to.be.true;
            expect(res.success.calledWith(mockPromotion)).to.be.true;
        });

        it('should return error if promotion is not found', async () => {
            req.params.id = '999';
            sandbox.stub(Promotion, 'findByPk').resolves(null);

            await PromotionController.findOne(req, res);

            expect(res.error.calledOnce).to.be.true;
            expect(res.error.firstCall.args[0]).to.equal('Promotion non trouvée');
            expect(res.error.firstCall.args[1]).to.equal(404);
        });
    });
});

    /*

    describe('findAll', () => {
        it('should return all promotions', async () => {

    }

     */