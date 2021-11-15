const lockerRouter = require("express").Router();

const {
    getAllLockers,
    getLockerById,
    getLockersByGuardian,
    getLockersByLocation,
    postNewLocker,
    updateLockerById,
    updateLockerStatusById,
} = require("./locker.controller");

lockerRouter.get("/", getAllLockers);
lockerRouter.get("/:id", getLockerById);
lockerRouter.get("/guardian/:guardian", getLockersByGuardian);
lockerRouter.get("/location/:location", getLockersByLocation);
lockerRouter.post("/", postNewLocker);
lockerRouter.put("/:id", updateLockerById);
lockerRouter.patch("/status/:id", updateLockerStatusById);

module.exports = lockerRouter;