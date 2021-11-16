const Rate = require("./rate.model");
const RateResolver = require("./rate.resolver");
const { setError } = require("../_shared/utils/error/error.utils");

//
// Calculate final price for a booking
//
const calculatePrice = async (req, res, next) => {
  console.log("calculatePrice");

  try {
    const { location, init_date, end_date, pieces } = req.body;

    result = await RateResolver.calculatePrice(location, init_date, end_date, pieces);

    return res.status(200).json({
      pieces: pieces,
      days: result.days,
      gross_price: result.gross_price,
      taxes: result.taxes,
      fee: result.fee,
      total_price: result.total_price
    });

    /*
    // Check input values
    if (!location || !init_date || !end_date || !pieces) {
      return next(setError(400, "Invalid parameters"));
    }

    // Parse dates
    const initDate = Date.parse(init_date);
    const endDate = Date.parse(end_date);

    // Check if dates are not valid
    if (isNaN(initDate) || isNaN(endDate)) {
      return next(setError(400, "Dates are not valid"));
    }

    // Calculate number of days
    const days = Math.ceil((endDate - initDate) / (1000 * 60 * 60 * 24));

    // Find a rate
    rateDetails = await Rate.findOne({ location: location, active: true });

    if (!rateDetails) {
      return next(setError(400, "Rate not found"));
    }

    // Calculate prices
    const grossPrice =
      (rateDetails.price + ((days - 1) * rateDetails.price_extra)) * pieces;
    const taxes = (grossPrice * rateDetails.tax_pct) / 100;
    const totalPrice = grossPrice + taxes + rateDetails.fee;

    return res.status(200).json({
      pieces: pieces,
      days: days,
      gross_price: grossPrice,
      taxes: taxes,
      fee: rateDetails.fee,
      total_price: totalPrice
    }); */

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
    const locations = await Rate.find(
      {},
      { location: 1, location_description: 1, _id: 0 }
    ).sort({ location: 1 });

    let previousKey = null;
    let finalLocations = [];
    for (const item of locations) {
      if (item.location !== previousKey) {
        finalLocations.push(item);
        previousKey = item.location;
      }
    }
    console.log("finalLocations ->", finalLocations);

    return res.status(200).json({ finalLocations });
  } catch (error) {
    next(error);
  }
};

//
// POST - Create a new rate
//
const postNewRate = async (req, res, next) => {
  console.log("postNewRate");

  try {
    const {
      location,
      location_description,
      price,
      price_extra,
      fee,
      tax_pct,
      description,
    } = req.body;

    const newRate = new Rate({
      location: location.toLowerCase(),
      location_description: location_description,
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
  calculatePrice,
  getAllLocations,
  postNewRate,
  updateRateById,
  updateRateStatusById,
  deleteRateById,
};
