import User from '../models/user.model.js';
import { Op } from 'sequelize';

class UserRepository {
  static async getUsersByRoles(roles) {
    return await User.findAll({
      where: {
        roles: {
          [Op.overlap]: roles
        }
      }
    });
  }
}

export default UserRepository;