const Rate = require('./rate.model');

class RateResolver {
    
  static async findRateById(id) {
    try {
      return await Rate.findById(id);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = RateResolver;