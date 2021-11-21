const lockerRouter = require("express").Router();
const upload = require("../_shared/middleware/file.middleware");

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
lockerRouter.post("/", upload.single('image'), postNewLocker);
lockerRouter.put("/:id", upload.single('image'), updateLockerById);
lockerRouter.patch("/addimage/:id", upload.single('image'), addImageLockerById);
lockerRouter.patch("/status/:id", updateLockerStatusById);

module.exports = lockerRouter;