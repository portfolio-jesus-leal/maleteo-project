const lockerRouter = require("express").Router();

const {
    getAllLockers,
    getLockerById,
    getLockersByGuardian,
    getLockersByLocation,
    postNewLocker,
    updateLockerById,
    updateLockerStatusById,
    addImageLockerById,
    checkAvailabilityLockerById,
} = require("./locker.controller");

lockerRouter.get("/", getAllLockers);
lockerRouter.get("/:id", getLockerById);
lockerRouter.get("/guardian/:guardian", getLockersByGuardian);
lockerRouter.get("/location/:location", getLockersByLocation);
lockerRouter.get("/available/:id", checkAvailabilityLockerById);
lockerRouter.post("/", postNewLocker);
lockerRouter.put("/:id", updateLockerById);
lockerRouter.patch("/status/:id", updateLockerStatusById);
lockerRouter.patch("/addimage/:id", addImageLockerById);

module.exports = lockerRouter;