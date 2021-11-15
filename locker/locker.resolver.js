const Locker = require('./locker.model');

class LockerResolver {
    
  static async findLockerById(id) {
    try {
      return await Locker.findById(id);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = LockerResolver;