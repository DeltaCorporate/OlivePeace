import { Op } from 'sequelize';
import User from '../sequelize/models/user.model.js';
import { sendConfirmationEmail, sendResetPasswordEmail, sendPasswordChangeReminder } from '../services/emails/auth.email.js';
import { registerSchema, loginSchema, resetPasswordSchema } from '#shared/validations/schema/user.validation-schema.js';
import { UserMessage, GlobalMessage } from '../validations/errors.messages.js';
import { formatJoiErrors, handleError } from '../utils/error.util.js';
import {generateToken} from "#app/src/utils/string.util.js";
import {UserService} from "#app/src/services/user.service.js";

class AuthController {
    static async register(req, res) {
        let errors = [];
        try {
           errors = errors.concat(formatJoiErrors(registerSchema, req.body));
            if (errors.length > 0) return res.error(GlobalMessage.validationError, 422, errors);
            const data = req.body;
            const existingUser = await User.findOne({
                where: {email: data.email}
            });
            if (existingUser) {
                errors.push({ field: 'email', message: UserMessage.emailTaken });
                return res.error(GlobalMessage.validationError, 422, errors);
            }
            const confirmationToken = generateToken(20);
            const user = await User.create({
                ...data,
                confirmationToken,
                confirmationTokenExpiresAt: User.generateConfirmationTokenExpirationDate(),
            });

            await sendConfirmationEmail(user.email, confirmationToken);
            res.created({});
        } catch (error) {
            handleError(res, error);
        }
    }

    static async confirmEmail(req, res) {
        const errors = [];
        try {
            const { token } = req.params;
            const user = await User.findOne({
                where: { confirmationToken: token},
            });
            if (!user) {
                errors.push({ message: UserMessage.invalidConfirmationToken });
                return res.error(GlobalMessage.validationError, 400, errors);
            }
            if(user.isConfirmationTokenExpired()) {
                await user.regenerateConfirmationToken().save();
                await sendConfirmationEmail(user.email, user.confirmationToken);
                errors.push({ message: UserMessage.invalidConfirmationToken });
                return res.error(GlobalMessage.validationError, 400, errors);
            }
            user.validateConfirmationToken();
            await user.save();
            res.success();
        } catch (error) {
            handleError(res, error);
        }
    }

    static async login(req, res) {
        let errors = [];
        try {
            errors = errors.concat(formatJoiErrors(loginSchema, req.body));
            if (errors.length > 0) return res.error(GlobalMessage.validationError, 422, errors);
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email } });

            if (user && user.isLoginLocked()) {
                errors.push({ message: UserMessage.accountLocked });
                return res.error(GlobalMessage.validationError, 403, errors);
            }
            await UserService.handleFailedLogin(user);
            if (!user || !(await user.comparePassword(password))) {
                errors.push({ message: UserMessage.invalidCredentials });
                return res.error(GlobalMessage.validationError, 401, errors);
            }

            if (!user.isConfirmed()) {
                errors.push({ message: UserMessage.unconfirmedEmail });
                return res.error(GlobalMessage.validationError, 403, errors);
            }


            user.resetLoginAttempt();
            await user.save();
            const token = user.generateJwtToken();
            res.success({ token,
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    roles: user.roles
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    static async requestPasswordReset(req, res) {
        const errors = [];
        try {
            const { email } = req.body;
            const user = await User.findOne({ where: { email } });
            if (user) {
                user.regeneratePasswordToken();
                await user.save();
                await sendResetPasswordEmail(user.email, user.resetPasswordToken);
            }
            res.success();
        } catch (error) {
            handleError(res, error);
        }
    }

    static async resetPassword(req, res) {
        let errors = [];
        try {
            const { token } = req.params;
            errors = errors.concat(formatJoiErrors(resetPasswordSchema, req.body));
            if (errors.length > 0) return res.error(GlobalMessage.validationError, 422, errors);
            const { password } = req.body;
            const user = await User.findOne({
                where: {
                    resetPasswordToken: token,
                    resetPasswordExpiresAt: { [Op.gt]: Date.now() },
                },
            });
            if (!user) {
                errors.push({ message: UserMessage.invalidResetToken });
                return res.error(GlobalMessage.validationError, 400, errors);
            }
            user.password = password;
            user.clearResetPasswordToken();
            await user.save();
            res.success();
        } catch (error) {
            handleError(res, error);
        }
    }

    static async deleteAccount(req, res) {
        try {
            const userId = req.user.id;
            const user = await User.findByPk(userId);
            if (!user) return res.error(UserMessage.userNotFound, 404);
            await user.anonymize();
            await user.save();
            res.success();
        } catch (error) {
            handleError(res, error);
        }
    }
}

export default AuthController;