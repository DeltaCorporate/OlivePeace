import { expect } from 'chai';
import sinon from 'sinon';
import AuthController from '#app/src/controllers/auth.controller.js';
import User from '#app/src/sequelize/models/user.model.js';
import { sendConfirmationEmail, sendResetPasswordEmail } from '#app/src/services/emails/auth.email.js';
import * as authValidationSchema from '#shared/validations/schema/auth.validation-schema.js';

describe('AuthController', () => {
    let req, res, sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        req = {
            body: {},
            params: {},
            user: {},
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

    describe('register', () => {
        it('should return errors for invalid input', async () => {
            req.body = {
                email: 'invalid-email',
                password: 'short',
            };

            await AuthController.register(req, res);

            expect(res.error.calledOnce).to.be.true;
            expect(res.error.firstCall.args[0]).to.equal('Erreur de validation');
            expect(res.error.firstCall.args[1]).to.equal(422);
            expect(res.error.firstCall.args[2]).to.be.an('array');
        });

        it('should create a new user and send confirmation email', async () => {
            req.body = {
                email: 'test@example.com',
                password: 'ValidPassword123!',
                firstName: 'John',
                lastName: 'Doe',
                zipCode: '12345',
                address: '123 Test St',
                city: 'Test City',
            };

            sandbox.stub(User, 'findOne').resolves(null);
            sandbox.stub(User, 'create').resolves({
                email: 'test@example.com',
                confirmationToken: 'token123',
            });
            sandbox.stub(sendConfirmationEmail);

            await AuthController.register(req, res);

            expect(User.create.calledOnce).to.be.true;
            expect(sendConfirmationEmail.calledWith('test@example.com', 'token123')).to.be.true;
            expect(res.created.calledOnce).to.be.true;
        });
    });

    describe('confirmEmail', () => {
        it('should return error for invalid token', async () => {
            req.params.token = 'invalid-token';
            sandbox.stub(User, 'findOne').resolves(null);

            await AuthController.confirmEmail(req, res);

            expect(res.error.calledOnce).to.be.true;
            expect(res.error.firstCall.args[0]).to.equal('Erreur de validation');
            expect(res.error.firstCall.args[1]).to.equal(400);
        });

        it('should confirm email successfully', async () => {
            req.params.token = 'valid-token';
            const mockUser = {
                isConfirmationTokenExpired: sandbox.stub().returns(false),
                validateConfirmationToken: sandbox.stub(),
                save: sandbox.stub(),
            };
            sandbox.stub(User, 'findOne').resolves(mockUser);

            await AuthController.confirmEmail(req, res);

            expect(mockUser.validateConfirmationToken.calledOnce).to.be.true;
            expect(mockUser.save.calledOnce).to.be.true;
            expect(res.success.calledOnce).to.be.true;
        });
    });

    describe('login', () => {
        it('should return error for invalid credentials', async () => {
            req.body = {
                email: 'test@example.com',
                password: 'WrongPassword123!',
            };

            sandbox.stub(User, 'findOne').resolves(null);

            await AuthController.login(req, res);

            expect(res.error.calledOnce).to.be.true;
            expect(res.error.firstCall.args[0]).to.equal('Erreur de validation');
            expect(res.error.firstCall.args[1]).to.equal(422);
        });

        it('should login successfully', async () => {
            req.body = {
                email: 'test@example.com',
                password: 'ValidPassword123!',
            };

            const mockUser = {
                isLoginLocked: sandbox.stub().returns(false),
                comparePassword: sandbox.stub().resolves(true),
                isConfirmed: sandbox.stub().returns(true),
                resetLoginAttempt: sandbox.stub(),
                save: sandbox.stub(),
                generateJwtToken: sandbox.stub().returns('jwt-token'),
                id: '123',
                email: 'test@example.com',
                firstName: 'John',
                lastName: 'Doe',
                roles: ['ROLE_USER'],
            };

            sandbox.stub(User, 'findOne').resolves(mockUser);

            await AuthController.login(req, res);

            expect(mockUser.resetLoginAttempt.calledOnce).to.be.true;
            expect(mockUser.save.calledOnce).to.be.true;
            expect(res.success.calledOnce).to.be.true;
            expect(res.success.firstCall.args[0]).to.deep.equal({
                token: 'jwt-token',
                id: '123',
                email: 'test@example.com',
                firstName: 'John',
                lastName: 'Doe',
                roles: ['ROLE_USER'],
            });
        });
    });

    describe('requestPasswordReset', () => {
        it('should always return success to prevent email enumeration', async () => {
            req.body = { email: 'nonexistent@example.com' };

            await AuthController.requestPasswordReset(req, res);

            expect(res.success.calledOnce).to.be.true;
        });

        it('should send reset password email for existing user', async () => {
            req.body = { email: 'test@example.com' };

            const mockUser = {
                regeneratePasswordToken: sandbox.stub(),
                save: sandbox.stub(),
                email: 'test@example.com',
                resetPasswordToken: 'reset-token',
            };

            sandbox.stub(User, 'findOne').resolves(mockUser);
            sandbox.stub(sendResetPasswordEmail);

            await AuthController.requestPasswordReset(req, res);

            expect(mockUser.regeneratePasswordToken.calledOnce).to.be.true;
            expect(mockUser.save.calledOnce).to.be.true;
            expect(sendResetPasswordEmail.calledWith('test@example.com', 'reset-token')).to.be.true;
            expect(res.success.calledOnce).to.be.true;
        });
    });

    describe('resetPassword', () => {
        it('should return error for invalid token', async () => {
            req.params.token = 'invalid-token';
            req.body = { password: 'NewValidPassword123!' };

            sandbox.stub(User, 'findOne').resolves(null);

            await AuthController.resetPassword(req, res);

            expect(res.error.calledOnce).to.be.true;
            expect(res.error.firstCall.args[0]).to.equal('Erreur de validation');
            expect(res.error.firstCall.args[1]).to.equal(400);
        });

        it('should reset password successfully', async () => {
            req.params.token = 'valid-token';
            req.body = { password: 'NewValidPassword123!' };

            const mockUser = {
                clearResetPasswordToken: sandbox.stub(),
                save: sandbox.stub(),
            };

            sandbox.stub(User, 'findOne').resolves(mockUser);

            await AuthController.resetPassword(req, res);

            expect(mockUser.clearResetPasswordToken.calledOnce).to.be.true;
            expect(mockUser.save.calledOnce).to.be.true;
            expect(res.success.calledOnce).to.be.true;
        });
    });

    describe('deleteAccount', () => {
        it('should return error if user not found', async () => {
            req.user.id = 'nonexistent-id';
            sandbox.stub(User, 'findByPk').resolves(null);

            await AuthController.deleteAccount(req, res);

            expect(res.error.calledOnce).to.be.true;
            expect(res.error.firstCall.args[0]).to.equal('Utilisateur non trouvé');
            expect(res.error.firstCall.args[1]).to.equal(404);
        });

        it('should anonymize user account successfully', async () => {
            req.user.id = 'existing-id';
            const mockUser = {
                anonymize: sandbox.stub(),
                save: sandbox.stub(),
            };

            sandbox.stub(User, 'findByPk').resolves(mockUser);

            await AuthController.deleteAccount(req, res);

            expect(mockUser.anonymize.calledOnce).to.be.true;
            expect(mockUser.save.calledOnce).to.be.true;
            expect(res.success.calledOnce).to.be.true;
        });
    });

    describe('isExpired', () => {
        it('should return success', async () => {
            await AuthController.isExpired(req, res);

            expect(res.success.calledOnce).to.be.true;
        });
    });
});