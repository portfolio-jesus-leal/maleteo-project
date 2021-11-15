const Booking = require('./booking.model');

class BookingResolver {
    
  static async findBookingById(id) {
    try {
      return await Booking.findById(id);
    } catch (error) {
      throw error;
    }
  }

  static async hasBookingActive(userId) {
    try {
      const booking = await Booking.findOne({
        $and: [
          { $or: [{ user: userId }, { guardian: userId }] },
          { $or: [{ status: 'open' }, { status: 'paid' }] },
        ],
      });
      if (booking) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = BookingResolver;
