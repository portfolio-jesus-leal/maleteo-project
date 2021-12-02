const Locker = require('./locker.model');
const { isAvailable } = require('../_shared/utils/utils.utils');

class LockerResolver {
    
  static async findLockerById(id) {
    try {
      return await Locker.findById(id);
    } catch (error) {
      throw error;
    }
  }

  //
  // GET a locker by id and check whether it is available in a dates range
  //
  static async checkAvailabilityLockerById( id, init_date, end_date ) {

    try {

      if (!init_date || !end_date) {
        throw setError(400, "Fields init_date and end_date are required");
      }

      const lockerDetails = await Locker.findById( id );

      if (!lockerDetails) {
        throw setError(400, "Locker not found");
      }

      return await isAvailable(lockerDetails.available, init_date, end_date);
      
    } catch (error) {
      throw error;
    }
  }
}

module.exports = LockerResolver;