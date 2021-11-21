const { setError } = require('../utils/error/error.utils');

function defaults(existing, fallback) {
    if (existing == null || existing == undefined) {
        return fallback;
    }

    return existing;
}

function isAvailable(availableArray, initDate, endDate) {

    try {
      
        // Parse dates
        const init = Date.parse(initDate);
        const end = Date.parse(endDate);
  
        // Check if dates are not valid
        if (isNaN(init) || isNaN(end)) {
          throw setError(400, "Dates are not valid");
        }

        // Check if dates are not valid
        if (!availableArray) {
            throw setError(400, "Missing availability dates");
        }
  
        for (const item of availableArray) {
  
          const _from = item.available_from.getTime();
          const _to = item.available_to.getTime();
  
          console.log(item.available_from, '<', initDate, '/', endDate, '<', item.available_to);
          console.log(_from, '<', init, '/', end, '<', _to);
  
          if (_from <= init && _to >= end) {
            console.log("Disponible");
            return true;
          }
        } 
  
        return false;
  
    } catch (error) {
        throw error;
    }
}

module.exports = {
    defaults,
    isAvailable,
}