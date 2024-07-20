import UserRepository from '../sequelize/repositories/user.repository.js';
import { sendStockAlertEmail } from './emails/product.email.js';

class ProductService {
    static async alertLowStock(product) {
        const adminAndStoreKeeperUsers = await UserRepository.getUsersByRoles(['ROLE_ADMIN', 'ROLE_STORE_KEEPER']);

        const recipientEmails = adminAndStoreKeeperUsers.map(user => user.email);

        for (const email of recipientEmails)
            await sendStockAlertEmail(email, product);
    }
}

export default ProductService;