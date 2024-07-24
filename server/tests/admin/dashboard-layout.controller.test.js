import { expect } from 'chai';
import sinon from 'sinon';
import DashboardLayoutController from '#app/src/controllers/admin/dashboard-layout.controller.js';
import Config from '#app/src/mongoose/models/config.model.js';

describe('DashboardLayoutController', () => {
    let req, res, sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        req = {
            params: {},
            body: {},
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
        it('should return a list of dashboard layouts', async () => {
            const mockLayouts = [
                { _id: '1', value: { name: 'Layout 1', layout: [] } },
                { _id: '2', value: { name: 'Layout 2', layout: [] } },
            ];
            const mockSelected = {
                value: {
                    '1': { priority: 1, roles: ['ROLE_ADMIN'] },
                    '2': { priority: 2, roles: ['ROLE_USER'] },
                },
            };
            sandbox.stub(Config, 'find').resolves(mockLayouts);
            sandbox.stub(Config, 'findOne').resolves(mockSelected);

            await DashboardLayoutController.list(req, res);

            expect(Config.find.calledWith({ key: 'admin_dashboard_layouts' })).to.be.true;
            expect(Config.findOne.calledWith({ key: 'admin_dashboard_layout_selected' })).to.be.true;
            expect(res.success.calledOnce).to.be.true;
            expect(res.success.firstCall.args[0]).to.be.an('array').with.lengthOf(2);
            expect(res.success.firstCall.args[0][0]).to.have.property('priority', 1);
            expect(res.success.firstCall.args[0][1]).to.have.property('priority', 2);
        });

        it('should handle errors when fetching layouts fails', async () => {
            sandbox.stub(Config, 'find').rejects(new Error('Database error'));

            await DashboardLayoutController.list(req, res);

            expect(res.error.calledOnce).to.be.true;
        });
    });

    describe('findOne', () => {
        it('should return a specific layout', async () => {
            req.params.id = '1';
            const mockLayout = { _id: '1', key: 'admin_dashboard_layouts', value: { name: 'Layout 1', layout: [] } };
            sandbox.stub(Config, 'findById').resolves(mockLayout);

            await DashboardLayoutController.findOne(req, res);

            expect(Config.findById.calledWith('1')).to.be.true;
            expect(res.success.calledOnce).to.be.true;
            expect(res.success.firstCall.args[0]).to.deep.equal({ name: 'Layout 1', layout: [] });
        });

        it('should return error if layout is not found', async () => {
            req.params.id = 'nonexistent';
            sandbox.stub(Config, 'findById').resolves(null);

            await DashboardLayoutController.findOne(req, res);

            expect(res.error.calledOnce).to.be.true;
            expect(res.error.firstCall.args[0]).to.equal('Layout non trouvé');
            expect(res.error.firstCall.args[1]).to.equal(404);
        });
    });

    describe('create', () => {
        it('should create a new layout', async () => {
            req.body = { name: 'New Layout', layout: [] };
            const mockCreatedLayout = { _id: '3', key: 'admin_dashboard_layouts', value: req.body };
            sandbox.stub(Config, 'create').resolves(mockCreatedLayout);

            await DashboardLayoutController.create(req, res);

            expect(Config.create.calledOnce).to.be.true;
            expect(res.success.calledOnce).to.be.true;
            expect(res.success.firstCall.args[0]).to.deep.equal(mockCreatedLayout);
        });

        it('should handle errors during layout creation', async () => {
            req.body = { name: 'New Layout', layout: [] };
            sandbox.stub(Config, 'create').rejects(new Error('Database error'));

            await DashboardLayoutController.create(req, res);

            expect(res.error.calledOnce).to.be.true;
        });
    });

    describe('update', () => {
        it('should update an existing layout', async () => {
            req.params.id = '1';
            req.body = { name: 'Updated Layout', layout: [] };
            const mockUpdatedLayout = { _id: '1', key: 'admin_dashboard_layouts', value: req.body };
            sandbox.stub(Config, 'findByIdAndUpdate').resolves(mockUpdatedLayout);

            await DashboardLayoutController.update(req, res);

            expect(Config.findByIdAndUpdate.calledOnce).to.be.true;
            expect(res.success.calledOnce).to.be.true;
            expect(res.success.firstCall.args[0]).to.deep.equal(req.body);
        });

        it('should return error if layout to update is not found', async () => {
            req.params.id = 'nonexistent';
            req.body = { name: 'Updated Layout', layout: [] };
            sandbox.stub(Config, 'findByIdAndUpdate').resolves(null);

            await DashboardLayoutController.update(req, res);

            expect(res.error.calledOnce).to.be.true;
            expect(res.error.firstCall.args[0]).to.equal('Layout non trouvé');
            expect(res.error.firstCall.args[1]).to.equal(404);
        });
    });

    describe('delete', () => {
        it('should delete a layout', async () => {
            req.params.id = '1';
            sandbox.stub(Config, 'findByIdAndDelete').resolves({ _id: '1' });
            sandbox.stub(DashboardLayoutController, 'removeLayoutSelection').resolves();

            await DashboardLayoutController.delete(req, res);

            expect(Config.findByIdAndDelete.calledWith('1')).to.be.true;
            expect(DashboardLayoutController.removeLayoutSelection.calledWith('1')).to.be.true;
            expect(res.success.calledOnce).to.be.true;
            expect(res.success.firstCall.args[0].message).to.equal('Layout supprimé avec succès');
        });

        it('should return error if layout to delete is not found', async () => {
            req.params.id = 'nonexistent';
            sandbox.stub(Config, 'findByIdAndDelete').resolves(null);

            await DashboardLayoutController.delete(req, res);

            expect(res.error.calledOnce).to.be.true;
            expect(res.error.firstCall.args[0]).to.equal('Layout non trouvé');
            expect(res.error.firstCall.args[1]).to.equal(404);
        });
    });

    describe('updateLayoutSelection', () => {
        it('should update layout selection', async () => {
            req.body = { layoutId: '1', priority: 1, roles: ['ROLE_ADMIN'] };
            const mockSelection = { value: {} };
            sandbox.stub(Config, 'findOne').resolves(mockSelection);
            sandbox.stub(Config, 'findOneAndUpdate').resolves({ value: { '1': { priority: 1, roles: ['ROLE_ADMIN'] } } });

            await DashboardLayoutController.updateLayoutSelection(req, res);

            expect(Config.findOne.calledWith({ key: 'admin_dashboard_layout_selected' })).to.be.true;
            expect(Config.findOneAndUpdate.calledOnce).to.be.true;
            expect(res.success.calledOnce).to.be.true;
            expect(res.success.firstCall.args[0].message).to.equal('Sélection de layout mise à jour avec succès');
        });

        it('should handle errors during layout selection update', async () => {
            req.body = { layoutId: '1', priority: 1, roles: ['ROLE_ADMIN'] };
            sandbox.stub(Config, 'findOne').rejects(new Error('Database error'));

            await DashboardLayoutController.updateLayoutSelection(req, res);

            expect(res.error.calledOnce).to.be.true;
        });
    });

    describe('getLayoutSelection', () => {
        it('should return layout selection', async () => {
            const mockSelection = { value: { '1': { priority: 1, roles: ['ROLE_ADMIN'] } } };
            sandbox.stub(Config, 'findOne').resolves(mockSelection);

            await DashboardLayoutController.getLayoutSelection(req, res);

            expect(Config.findOne.calledWith({ key: 'admin_dashboard_layout_selected' })).to.be.true;
            expect(res.success.calledOnce).to.be.true;
            expect(res.success.firstCall.args[0]).to.deep.equal(mockSelection.value);
        });

        it('should handle errors when fetching layout selection', async () => {
            sandbox.stub(Config, 'findOne').rejects(new Error('Database error'));

            await DashboardLayoutController.getLayoutSelection(req, res);

            expect(res.error.calledOnce).to.be.true;
        });
    });
});