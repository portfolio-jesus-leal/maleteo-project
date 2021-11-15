const Locker = require("./locker.model");
const UserResolver = require("../user/user.resolver");
const { setError } = require("../_shared/utils/error/error.utils");

//
// GET all lockers
//
const getAllLockers = async (req, res, next) => {
  console.log("getAllLockers");

  try {
    const lockers = await Locker.find();
    return res.status(200).json({ lockers });
  } catch (error) {
    next(error);
  }
};

//
// GET a locker by id
//
const getLockerById = async (req, res) => {
  console.log("getLockerById");

  try {
    const { id } = req.params;
    const locker = await Locker.findById(id);
    return res.status(200).json(locker);
  } catch (error) {
    return next(error);
  }
};

//
// GET lockers by guardian
//
const getLockersByGuardian = async (req, res) => {
  try {
    const { guardian } = req.params;
    const lockers = await Locker.find({ guardian });
    return res.status(200).json(lockers);
  } catch (error) {
    return next(error);
  }
};

//
// GET lockers by location
//
const getLockersByLocation = async (req, res) => {
  try {
    const { location } = req.params;
    const lockers = await Locker.find({ location });
    return res.status(200).json(lockers);
  } catch (error) {
    return next(error);
  }
};

//
// POST - Create a new locker
//
const postNewLocker = async (req, res, next) => {
  try {
    const {
      guardian,
      description,
      location,
      address,
      latitude,
      longitude,
      available,
      pieces_max,
      tags,
      images,
    } = req.body;

    if (!guardian || !UserResolver.findUserById(guardian)) {
      next(setError(400, "Guardian not found"));
    }

    const newLocker = new Locker({
      guardian,
      description,
      location,
      address,
      latitude,
      longitude,
      available,
      pieces_max,
      tags,
      images,
    });

    const lockerInDB = await newLocker.save();
    return res.status(201).json({ lockerInDB });
  } catch (error) {
    next(error);
  }
};

//
// PUT - Update a locker
//
const updateLockerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      guardian,
      description,
      location,
      address,
      latitude,
      longitude,
      available,
      pieces_max,
      tags,
      images,
    } = req.body;

    if (!guardian || !UserResolver.findUserById(guardian)) {
        next(setError(400, "Guardian not found"));
    }

    const updateLocker = await Locker.findByIdAndUpdate(
      id,
      {
        guardian,
        description,
        location,
        address,
        latitude,
        longitude,
        available,
        pieces_max,
        tags,
        images,
      },
      { returnDocument: "after" }
    );

    return res.status(200).json(updateLocker);
  } catch (error) {
    return next(error);
  }
};

//
// PATH Update status by id
//
const updateLockerStatusById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!req.body.active) {
      return next(setError(400, "Field active is required"));
    }

    const updateLocker = await Locker.findByIdAndUpdate(id, {
        active: req.body.active,
    });

    return res.status(200).json(updateLocker);
  } catch (error) {
    return next(error);
  }
};

//
// PATH Add images to a locker by id
//
const addImagesLockerById = async (req, res, next) => {

    try {
        console.log('addImagesLockerById')
        
    } catch (error) {
        return next(error);
    }
}

//
// PATH Remove image of a locker by id
//
const removeImageLockerById = async (req, res, next) => {

    try {
        console.log('removeImageLockerById')
        
    } catch (error) {
        return next(error);
    }
}

//
// PATH Add availability to a locker by id
//
const addAvailabilityLockerById = async (req, res, next) => {

    try {
        console.log('addAvailabilityLockerById')
        
    } catch (error) {
        return next(error);
    }
}

//
// PATH Remove availability of a locker by id
//
const removeAvailabilityLockerById = async (req, res, next) => {

    try {
        console.log('removeAvailabilityLockerById')
        
    } catch (error) {
        return next(error);
    }
}

module.exports = {
  getAllLockers,
  getLockerById,
  getLockersByGuardian,
  getLockersByLocation,
  postNewLocker,
  updateLockerById,
  updateLockerStatusById,
};
