const Rate = require('./rate.model');

class RateResolver {
    
  static async findRateById(id) {
    try {
      return await Rate.findById(id);
    } catch (error) {
      throw error;
    }
  }

  static async findRateByLocation(location) {
    try {
      return await Rate.findOne({ 
        location: location, 
        active: true });
    } catch (error) {
      throw error;
    }
  }

  static async calculatePrice(location, init_date, end_date, pieces) {
    try {

      // Check input values
      if (!location || !init_date || !end_date || !pieces) {
        throw setError(400, "Invalid parameters");
      }

      // Parse dates
      const initDate = Date.parse(init_date);
      const endDate = Date.parse(end_date);

      // Check if dates are not valid
      if (isNaN(initDate) || isNaN(endDate)) {
        throw setError(400, "Dates are not valid");
      }

      // Calculate number of days
      const days = Math.ceil((endDate - initDate) / (1000 * 60 * 60 * 24));

      // Find a rate
      const rateDetails = await Rate.findOne({ location: location, active: true });

      if (!rateDetails) {
        throw setError(400, "Rate not found");
      }

      // Calculate prices
      const subtotalPrice = rateDetails.price * pieces;
      const subtotalPriceExtra = (rateDetails.price_extra * (days - 1)) * pieces;
      const grossPrice = subtotalPrice + subtotalPriceExtra;
      const taxes = (grossPrice * rateDetails.tax_pct) / 100;
      const totalPrice = grossPrice + taxes + rateDetails.fee;

      const result = {
        rate: rateDetails._id,
        rate_price: rateDetails.price,
        rate_price_extra: rateDetails.price_extra,
        pieces: pieces,
        days: days,
        subtotal_price: subtotalPrice,
        subtotal_price_extra: subtotalPriceExtra,
        gross_price: grossPrice,
        taxes: taxes,
        fee: rateDetails.fee,
        total_price: totalPrice,
      }

      return result;
    
    } catch (error) {
      throw error;
    }
  }
}

module.exports = RateResolver;