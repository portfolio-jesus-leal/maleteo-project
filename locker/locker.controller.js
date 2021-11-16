const Locker = require("./locker.model");
const UserResolver = require("../user/user.resolver");
const RateResolver = require("../rate/rate.resolver");
const LockerResolver = require("./locker.resolver");
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
      type,
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

    if (!location || !RateResolver.findRateByLocation(location)) {
      next(setError(400, "Location not found"));
    }

    const newLocker = new Locker({
      guardian,
      type,
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
      type,
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

    if (!location || !RateResolver.findRateByLocation(location)) {
      next(setError(400, "Location not found"));
    }

    const updateLocker = await Locker.findByIdAndUpdate(
      id,
      {
        guardian,
        type,
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
const addImageLockerById = async (req, res, next) => {

    try {
        console.log('addImageLockerById');

        const { id } = req.params;
        const { image } = req.body;
    
        console.log("image->", image);
        console.log("img_url->", image.img_url);
        if (!image.img_url) {
            next(setError(400, "Missing imagen url"));
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

const checkAvailabilityLockerById = async (req, res, next) => {

  try {
    const { id } = req.params;
    const { init_date, end_date } = req.body;

    const isAvailable = await LockerResolver.checkAvailabilityLocker(id, init_date, end_date);

    if (isAvailable) {
      return res.status(200).json({available:true});
    } else {
      return res.status(200).json({available:false});
    }

    /* // Parse dates
    const initDate = Date.parse(init_date);
    const endDate = Date.parse(end_date);

    // Check if dates are not valid
    if (isNaN(initDate) || isNaN(endDate)) {
       return next(setError(400, "Dates are not valid"));
    }

    const lockerDetails = await Locker.findById( id );
    if (!lockerDetails) {
      return next(setError(400, "Locker not found"));
    }

    for (const item of lockerDetails.available) {

      const _from = item.available_from.getTime();
      const _to = item.available_to.getTime();

      console.log(item.available_from, '<', init_date, '/', end_date, '<', item.available_to);

      if (_from <= initDate && _to >= endDate) {
        return res.status(200).json({available:true});
      }
    } 
    return res.status(200).json({available:false}); */
    
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
  addImageLockerById,
  checkAvailabilityLockerById
};
