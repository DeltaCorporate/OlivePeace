export class UserService {
    static async handleFailedLogin(user) {
        if (user) {
            user.failedLoginAttempts += 1;
            if (user.failedLoginAttempts >= 3) {
                user.lockUntilAt = new Date(Date.now() + 15 * 60 * 1000);
            }
            await user.save();
        }
    }

}