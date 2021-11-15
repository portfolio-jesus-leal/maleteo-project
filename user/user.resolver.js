const User = require('./user.model');

class UserResolver {
    
  static async findUserById(id) {
    try {
      return await User.findById(id);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserResolver;