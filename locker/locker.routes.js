const lockerRouter = require("express").Router();

const {
    getAllLockers,
    getLockerById,
    getLockersByGuardian,
    getLockersByLocation,
    getLockersAvailable,
    postNewLocker,
    updateLockerById,
    updateLockerStatusById,
    addImageLockerById,
    checkAvailabilityLockerById,
} = require("./locker.controller");

lockerRouter.get("/available", getLockersAvailable);
lockerRouter.get("/available/:id", checkAvailabilityLockerById);
lockerRouter.get("/guardian/:guardian", getLockersByGuardian);
lockerRouter.get("/location/:location", getLockersByLocation);
lockerRouter.get("/", getAllLockers);
lockerRouter.get("/:id", getLockerById);
lockerRouter.post("/", postNewLocker);
lockerRouter.put("/:id", updateLockerById);
lockerRouter.patch("/status/:id", updateLockerStatusById);
lockerRouter.patch("/addimage/:id", addImageLockerById);

module.exports = lockerRouter;