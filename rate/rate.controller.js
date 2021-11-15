const Rate = require("./rate.model");

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
}

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
  getAllLocations,
  postNewRate,
  updateRateById,
  updateRateStatusById,
  deleteRateById,
};
