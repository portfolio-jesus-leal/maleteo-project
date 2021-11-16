const Locker = require('./locker.model');

class LockerResolver {
    
  static async findLockerById(id) {
    try {
      return await Locker.findById(id);
    } catch (error) {
      throw error;
    }
  }

  static async checkAvailabilityLocker(locker_id, init_date, end_date) {

    try {
      
      // Parse dates
      const initDate = Date.parse(init_date);
      const endDate = Date.parse(end_date);

      // Check if dates are not valid
      if (isNaN(initDate) || isNaN(endDate)) {
        throw setError(400, "Dates are not valid");
      }
    
      const lockerDetails = await Locker.findById( locker_id );
      if (!lockerDetails) {
        throw setError(400, "Locker not found");
      }

      for (const item of lockerDetails.available) {

        const _from = item.available_from.getTime();
        const _to = item.available_to.getTime();

        console.log(item.available_from, '<', init_date, '/', end_date, '<', item.available_to);
        console.log(_from, '<', initDate, '/', endDate, '<', _to);

        if (_from <= initDate && _to >= endDate) {
          console.log("Disponible");
          return true;
        }
      } 

      return false;

    } catch (error) {
      throw error;
    }
  }
}

module.exports = LockerResolver;