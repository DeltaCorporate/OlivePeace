import { Request, Response } from 'express';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);

const { expect } = chai;

const User = {
    findOne: sinon.stub(),
    create: sinon.stub(),
    findByPk: sinon.stub(),
    generateConfirmationTokenExpirationDate: sinon.stub().returns(new Date()),
};

const sendConfirmationEmail = sinon.stub();
const sendResetPasswordEmail = sinon.stub();
const registerSchema = {};
const loginSchema = {};
const resetPasswordSchema = {};
const UserMessage = {
    emailTaken: 'Email already taken',
    invalidConfirmationToken: 'Invalid confirmation token',
    accountLocked: 'Account is locked',
    invalidCredentials: 'Invalid credentials',
    unconfirmedEmail: 'Email not confirmed',
    invalidResetToken: 'Invalid reset token',
    userNotFound: 'User not found',
};
const GlobalMessage = {
    validationError: 'Validation error',
};
const formatJoiErrors = sinon.stub();
const handleError = sinon.stub();
const generateToken = sinon.stub().returns('generated-token');
const UserService = {
    handleFailedLogin: sinon.stub(),
};

const AuthController = proxyquire('../../src/controllers/auth.controller', {
    '../sequelize/models/user.model': User,
    '../services/emails/auth.email': { sendConfirmationEmail, sendResetPasswordEmail },
    '#shared/validations/schema/auth.validation-schema': { registerSchema, loginSchema, resetPasswordSchema },
    '../validations/errors.messages': { UserMessage, GlobalMessage },
    '../utils/error.util': { formatJoiErrors, handleError },
    '#app/src/utils/string.util': { generateToken },
    '#app/src/services/user.service': { UserService },
}).default;

describe('Auth Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let sandbox: sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        req = {
            body: {},
            params: {},
            user: {}
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
            created: sinon.stub(),
            error: sinon.stub(),
            success: sinon.stub()
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('register', () => {
        it('should register a user and send confirmation email', async () => {
            User.findOne.resolves(null);
            User.create.resolves({
                email: 'test@example.com',
                confirmationToken: 'token',
                save: sinon.stub().resolves()
            });
            sendConfirmationEmail.resolves();

            req.body = { email: 'test@example.com' };

            await AuthController.register(req as Request, res as Response);

            expect(User.findOne.calledOnce).to.be.true;
            expect(User.create.calledOnce).to.be.true;
            expect(sendConfirmationEmail.calledOnce).to.be.true;
            expect((res.created as sinon.SinonStub).calledOnce).to.be.true;
        });

        it('should return an error if user already exists', async () => {
            User.findOne.resolves({});
            req.body = { email: 'test@example.com' };

            await AuthController.register(req as Request, res as Response);

            expect((res.error as sinon.SinonStub).calledOnce).to.be.true;
        });
    });

});
