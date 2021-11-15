const bookingRouter = require("express").Router();

const {
    getAllBookings,
    getBookingById,
    getBookingsByUser,
    getBookingsByGuardian,
    postNewBooking,
    updateBookingById,
    updateBookingReviewById,
    updateBookingStatusById,
} = require("./booking.controller");

bookingRouter.get("/", getAllBookings);
bookingRouter.get("/:id", getBookingById);
bookingRouter.get("/user/:user", getBookingsByUser);
bookingRouter.get("/guardian/:guardian", getBookingsByGuardian);
bookingRouter.post("/", postNewBooking);
bookingRouter.put("/:id", updateBookingById);
bookingRouter.patch("/review/:id", updateBookingReviewById);
bookingRouter.patch("/status/:id", updateBookingStatusById);

module.exports = bookingRouter;