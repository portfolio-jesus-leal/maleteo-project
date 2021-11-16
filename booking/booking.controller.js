const Booking = require("./booking.model");
const UserResolver = require("../user/user.resolver");
const RateResolver = require("../rate/rate.resolver");
const LockerResolver = require("../locker/locker.resolver");
const { setError } = require("../_shared/utils/error/error.utils");

//
// GET all bookings
//
const getAllBookings = async (req, res, next) => {
  console.log("getAllBookings");

  try {
    const bookings = await Booking.find();
    return res.status(200).json({ bookings });
  } catch (error) {
    next(error);
  }
};

//
// GET a booking by id
//
const getBookingById = async (req, res) => {
  console.log("getBookingById");

  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    return res.status(200).json(booking);
  } catch (error) {
    return next(error);
  }
};

//
// GET bookings by user
//
const getBookingsByUser = async (req, res) => {
  try {
    const { user } = req.params;
    const bookings = await Booking.find({ user });
    return res.status(200).json(bookings);
  } catch (error) {
    return next(error);
  }
};

//
// GET bookings by guardian
//
const getBookingsByGuardian = async (req, res) => {
  try {
    const { guardian } = req.params;
    const bookings = await Booking.find({ guardian });
    return res.status(200).json(bookings);
  } catch (error) {
    return next(error);
  }
};

//
// Function to check that values for others collections related are valid
//

const checkRelationsDB = (user, guardian, rate, locker) => {
  if (!user || !UserResolver.findUserById(user)) {
    return next(setError(400, "User not found"));
  }

  if (!guardian || !UserResolver.findUserById(guardian)) {
    return next(setError(400, "Guardian not found"));
  }

  if (!rate || !RateResolver.findRateById(rate)) {
    return next(setError(400, "Rate does not exist"));
  }

  if (!locker || !LockerResolver.findLockerById(locker)) {
    return next(setError(400, "Locker does not exist"));
  }
};

//
// POST - Create a new booking
//
const postNewBooking = async (req, res, next) => {
  try {
    const { user, guardian, init_date, end_date, pieces, locker, rate } =
      req.body;
      
    // Check references to others collections
    checkRelationsDB(user, guardian, rate, locker);

    // Get the locker details
    const lockerDetails = await LockerResolver.findLockerById(locker);

    // Check is the locker is available
    const isAvailable = await LockerResolver.checkAvailabilityLocker(locker, init_date, end_date);
    if (!isAvailable) {
        return next(setError(400, "Locker is not available"));
    };

    // Calculate the total price
    result = await RateResolver.calculatePrice(lockerDetails.location, init_date, end_date, pieces);
      
    const newBooking = new Booking({
      user,
      guardian,
      init_date,
      end_date,
      pieces,
      locker,
      rate,
      price: result.total_price,
    });

    const bookingInDB = await newBooking.save();
    return res.status(201).json({ bookingInDB });
  } catch (error) {
    next(error);
  }
};

//
// PUT - Update a booking
//
const updateBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user, guardian, init_date, end_date, pieces, locker, rate } =
      req.body;

    // Check references to others collections
    checkRelationsDB(user, guardian, rate, locker);

    // Get the locker details
    const lockerDetails = await LockerResolver.findLockerById(locker);

    // Check is the locker is available
    const isAvailable = await LockerResolver.checkAvailabilityLocker(locker, init_date, end_date);
    if (!isAvailable) {
      return next(setError(400, "Locker is not available"));
    };
    
    // Calculate the total price
    result = await RateResolver.calculatePrice(lockerDetails.location, init_date, end_date, pieces);

    const updateBooking = await Booking.findByIdAndUpdate(
      id,
      {
        user,
        guardian,
        init_date,
        end_date,
        pieces,
        locker,
        rate,
        price: result.total_price,
      },
      { returnDocument: "after" }
    );

    return res.status(200).json(updateBooking);
  } catch (error) {
    return next(error);
  }
};

//
// PATH Update booking review by id
//
const updateBookingReviewById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!req.body.review_starts) {
      return next(setError(400, "Field review_starts is required"));
    }

    await Booking.findByIdAndUpdate(id, {
      review: req.body.review,
      review_starts: req.body.review_starts,
    });
    return res.status(204).json();
  } catch (error) {
    return next(error);
  }
};

//
// PATH Update status by id
//
const updateBookingStatusById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!req.body.status) {
      return next(setError(400, "Field status is required"));
    }

    const updateBooking = await Booking.findByIdAndUpdate(id, {
      status: req.body.status,
    });

    return res.status(200).json(updateBooking);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAllBookings,
  getBookingById,
  getBookingsByUser,
  getBookingsByGuardian,
  postNewBooking,
  updateBookingById,
  updateBookingReviewById,
  updateBookingStatusById,
};
