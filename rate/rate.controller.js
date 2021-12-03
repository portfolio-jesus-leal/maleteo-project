const Rate = require("./rate.model");
const RateResolver = require("./rate.resolver");
const { setError } = require("../_shared/utils/error/error.utils");

//
// Calculate final price for a booking
//
const calculatePrice = async (req, res, next) => {
  console.log("calculatePrice");
  console.log("req.query->", req.query);

  try {
    const { location, init_date, end_date, pieces } = req.query;

    result = await RateResolver.calculatePrice(location, init_date, end_date, pieces);
    return res.status(200).json(result);

  } catch (error) {
    return next(error);
  }
};

//
// GET all rates
//
const getAllRates = async (req, res, next) => {
  console.log("getAllRates");

  try {
    const rates = await Rate.find();
    return res.status(200).json({ rates });
  } catch (error) {
    next(error);
  }
};

//
// GET rate by Id
//
const getRateById = async (req, res, next) => {
  console.log("getRateById");

  try {
    const { id } = req.params;
    const rate = await Rate.findById(id);
    return res.status(200).json({ rate });
  } catch (error) {
    next(error);
  }
};

//
// GET all locations
//
const getAllLocations = async (req, res, next) => {
  console.log("getAllLocations");

  try {
    const listLocations = await Rate.find(
      { active: true },
      { 
        location: 1, 
        location_description: 1, 
        price: 1,
        price_extra: 1,
        _id: 0 
      }
    ).sort({ location: 1 });

    let previousKey = null;
    let locations = [];
    for (const item of listLocations) {
      if (item.location !== previousKey) {
        locations.push(item);
        previousKey = item.location;
      }
    }
    console.log("locations ->", locations);

    return res.status(200).json({ locations });
  } catch (error) {
    next(error);
  }
};

//
// GET the location that corresponds to certain coordinates
//
const getLocationByCoordinates = async (req, res, next) => {
  try {

    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return next(setError(400, 'Invalid coordinates'));
    }

    const listLocations = await Rate.find({ active: true, coordinates: {$exists:true} });

    for (const location of listLocations) {

      if (location.coordinates.longitude + location.coordinates.range >= longitude &&
          location.coordinates.longitude - location.coordinates.range <= longitude &&
          location.coordinates.latitude + location.coordinates.range >= latitude &&
          location.coordinates.latitude - location.coordinates.range <= latitude)
        {
          return res.status(200).json({ location: location.location });
        }
      
    }
    return res.status(404).json({ location: null });
    
  } catch (error) {
    return next(error);
  }
}

//
// GET location details
//
const getLocationDetails = async (req, res, next) => {
  try {
    const { location } = req.params;

    const locationDetails = await Rate.findOne(
      { location: location },
      { active: true }
    );
    
    return res.status(200).json();
  } catch (error) {
    return next(error);
  }
}

//
// POST - Create a new rate
//
const postNewRate = async (req, res, next) => {
  console.log("postNewRate");

  try {
    const {
      location,
      location_description,
      latitude,
      longitude,
      range,
      price,
      price_extra,
      fee,
      tax_pct,
      description,
    } = req.body;

    const newRate = new Rate({
      location: location.toLowerCase(),
      location_description: location_description,
      coordinates: { 
        latitude: latitude,
        longitude: longitude,
        range: range
      },
      price: price,
      price_extra: price_extra,
      fee: fee,
      tax_pct: tax_pct,
      description: description,
      active: true,
    });

    const rateInDB = await newRate.save();
    return res.status(201).json({ rateInDB });
  } catch (error) {
    next(error);
  }
};

//
// PUT - Update a rate
//
const updateRateById = async (req, res, next) => {
  console.log("updateRateById");

  try {
    const { id } = req.params;
    const {
      location,
      location_description,
      latitude,
      longitude,
      range,
      price,
      price_extra,
      fee,
      tax_pct,
      description,
      active,
    } = req.body;

    const updatedRate = await Rate.findByIdAndUpdate(
      id,
      {
        location: location.toLowerCase(),
        location_description: location_description,
        coordinates: { 
          latitude: latitude,
          longitude: longitude,
          range: range
        },
        price: price,
        price_extra: price_extra,
        fee: fee,
        tax_pct: tax_pct,
        description: description,
        active: active,
      },
      { returnDocument: "after" }
    );

    return res.status(201).json({ updatedRate });
  } catch (error) {
    next(error);
  }
};

//
// PATH Update status by id
//
const updateRateStatusById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateRate = await Rate.findByIdAndUpdate(
      id,
      { active: req.body.active },
      { returnDocument: "after" }
    );

    return res.status(200).json(updateRate);
  } catch (error) {
    return next(error);
  }
};

//
// DELETE Rate by Id
//
const deleteRateById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const rate = await Rate.findByIdAndDelete(id);
    return res.status(200).json(rate);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAllRates,
  getRateById,
  getLocationDetails,
  getLocationByCoordinates,
  calculatePrice,
  getAllLocations,
  postNewRate,
  updateRateById,
  updateRateStatusById,
  deleteRateById,
};
