const Locker = require("./locker.model");
const UserResolver = require("../user/user.resolver");
const RateResolver = require("../rate/rate.resolver");
const { setError } = require("../_shared/utils/error/error.utils");
const { isAvailable } = require('../_shared/utils/utils.utils');

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
const getLockerById = async (req, res, next) => {
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
const getLockersByGuardian = async (req, res, next) => {
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
const getLockersByLocation = async (req, res, next) => {
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
      property_type,
      space_type,
      description,
      location,
      address,
      latitude,
      longitude,
      available_from,
      available_to,
      pieces_max,
      tags,
    } = req.body;

    if (!guardian || !UserResolver.findUserById(guardian)) {
      next(setError(400, "Guardian not found"));
    }

    if (!location || !RateResolver.findRateByLocation(location)) {
      next(setError(400, "Location not found"));
    }

    const newLocker = new Locker({
      guardian,
      property_type,
      space_type,
      description,
      location,
      address,
      latitude,
      longitude,
      available: [{available_from: available_from, available_to: available_to}],
      pieces_max,
      tags,
      images: [req.file ? req.file.path : null],
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
      property_type,
      space_type,
      description,
      location,
      address,
      latitude,
      longitude,
      available_from,
      available_to,
      pieces_max,
      tags,
    } = req.body;
    const image = req.file ? req.file.path : null;

    if (!guardian || !UserResolver.findUserById(guardian)) {
        next(setError(400, "Guardian not found"));
    }

    if (!location || !RateResolver.findRateByLocation(location)) {
      next(setError(400, "Location not found"));
    }

    const updateLocker = await Locker.findByIdAndUpdate(
      id,
      {
        guardian,
        property_type,
        space_type,
        description,
        location,
        address,
        latitude,
        longitude,
        available: [{available_from: available_from, available_to: available_to}],
        pieces_max,
        tags,
        images: [image],
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
const addImageLockerById = async (req, res, next) => {

    try {
        console.log('addImageLockerById');

        const { id } = req.params;
        const image = req.file ? req.file.path : null
    
        console.log("image->", image);

        if (!image) {
            next(setError(400, "Field image is required"));
        }
    
        const updateLocker = await Locker.findByIdAndUpdate(
          id,
          {
            $push: {images: image}
          },
          { returnDocument: "after" }
        );
    
        return res.status(200).json(updateLocker);
            
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

//
// GET a locker by id and check whether it is available in a dates range
//
const checkAvailabilityLockerById = async (req, res, next) => {

  try {
    const { id } = req.params;
    const { init_date, end_date } = req.body;

    if (!init_date || !end_date) {
      return next(setError(400, "Fields init_date and end_date are required"));
    }

    const lockerDetails = await Locker.findById( id );

    if (!lockerDetails) {
      return next(setError(400, "Locker not found"));
    }

    if (isAvailable(lockerDetails.available, init_date, end_date)) {
      return res.status(200).json({available:true});
    } else {
      return res.status(200).json({available:false});
    }
    
  } catch (error) {
    return next(error);
  }
}

//
// GET all lockers available in a location, in a range of date 
// and with capacity enough (pieces)
//
const getLockersAvailable = async (req, res, next) => {
  try {

    const {
      location,
      init_date, 
      end_date,
      pieces
    } = req.body;

    if (!location || !init_date || !end_date || !pieces) {
      return next(setError(400, "Invalid parameters"));
    }

    const lockers = await Locker.find(
      { location: location, active: true, pieces_max: {$gte: pieces} }
    );

    const lockersAvailable = [];
    for (const item of lockers) {
      if (isAvailable(item.available, init_date, end_date)) {
        lockersAvailable.push(item);
      }
    }
    
    console.log('lockersAvailable->', lockersAvailable);

    return res.status(200).json(lockersAvailable);
    
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getAllLockers,
  getLockerById,
  getLockersByGuardian,
  getLockersByLocation,
  getLockersAvailable,
  postNewLocker,
  updateLockerById,
  updateLockerStatusById,
  addImageLockerById,
  checkAvailabilityLockerById
};
