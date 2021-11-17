const User = require("./user.model");
const BookingResolver = require("../booking/booking.resolver");
const { setError } = require("../_shared/utils/error/error.utils");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//
// GET all users
//
const getAllUsers = async (req, res, next) => {
  console.log('getAllUsers');

  try {
    const users = await User.find();
    return res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

//
// GET a user by id
//
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    user.password = "";

    return res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
};

//
// POST - Create a new user
//
const postNewUser = async (req, res, next) => {
  try {

    const {
      email,
      name,
      last_name,
      birthday,
      address,
      gender,
      img_profile,
      marketing,
    } = req.body;
    let password = req.body.password;

    const newUser = new User({
      email: email,
      name: name,
      last_name: last_name,
      birthday: birthday,
      address: address,
      gender: gender.toLowerCase(),
      img_profile: img_profile,
      password: password,
      guardian: false,
      active: true,
      marketing: marketing,
    });
    password = null;
    req.body.password = null;

    const userInDB = await newUser.save();
    //userInDB.password = null;

    return res.status(201).json({ userInDB });
  } catch (error) {
    next(error);
  }
};

//
// POST - Login
//
const loginUser = async (req, res, next) => {
  try {

    if (!req.body.email) {
      return next(setError(400, "email is missing"));
    }
    
    const userInDB = await User.findOne({ email: req.body.email });
    console.log("Usuario encontrado ->", userInDB);

    if (!userInDB) {
      return next(setError(404, "email does not exist"));
    }

    const isValidPassword = bcrypt.compareSync(
      req.body.password,
      userInDB.password
    );
    req.body.password = null;
    userInDB.password = null;

    if (!isValidPassword) {
      return next(setError(403, "Invalid credentials"));
    }

    console.log("Contraseña correcta");
    const token = jwt.sign(
      { id: userInDB._id, email: userInDB.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    return res.status(201).json({ token: token, user: userInDB });
  } catch (error) {
    next(error);
  }
};

//
// POST - Logout
//
const logoutUser = (req, res, next) => {
  try {
    const token = null;
    return res.status(200).json(token);
  } catch (error) {
    return next(error);
  }
};

//
// PUT - Update a user
//
const updateUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      email,
      name,
      last_name,
      birthday,
      address,
      gender,
      img_profile,
      marketing,
    } = req.body;
   
    const updateUser = await User.findByIdAndUpdate(id, {
      email: email,
      name: name,
      last_name: last_name,
      birthday: birthday,
      address: address,
      gender: gender.toLowerCase(),
      img_profile: img_profile,
      marketing: marketing,
    }, {returnDocument: 'after'});
    updateUser.password = null;
   
    return res.status(200).json(updateUser);
  } catch (error) {
    return next(error);
  }
};

//
// PATH Update password by id
//
const updateUserPasswordById = async (req, res, next) => {
  try {
    const { id } = req.params;

    await User.findByIdAndUpdate(id, { password: req.body.password });
    req.body.password = null;
    return res.status(204).json();
  } catch (error) {
    return next(error);
  }
};

//
// PATH Set user status by id
//
const setUserStatusById = async (req, res, next) => {
  try {
    const { id } = req.params;

    console.log('Tipo->', typeof req.body.active);

    if (typeof req.body.active !== 'boolean') {
      return next(setError(400, "Field active is required"));
    }

    const updateUser = await User.findByIdAndUpdate(id, {
      active: req.body.active,
    });
    updateUser.password = null;

    return res.status(200).json(updateUser);
  } catch (error) {
    return next(error);
  }
};

//
// PATH - Update just the image of a user
//
const updateImageUser = async (req, res, next) => {
    try {
      const { id } = req.params;
      const image = req.file ? req.file.path : null
  
      if (image) {
        const updatedUser = await User.findByIdAndUpdate(id, {image});
        updatedUser.password = null;
        return res.status(200).json(updatedUser);
      } else {
        return next(setError(400, "The image name is not valid"));
      }
  
    } catch (error) {
      return next(error);
    }
  };

//
// PATH Set user as guardian (by Id)
//
const setUserAsGuardianById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (typeof req.body.guardian !== 'boolean') {
      return next(setError(400, "Field guardian is required"));
    }

    const updateUser = await User.findByIdAndUpdate(id, {
      guardian: req.body.guardian,
    });
    updateUser.password = null;

    return res.status(200).json(updateUser);
  } catch (error) {
    return next(error);
  }
};

//
// PATH Add a search to user (by Id)
//
const addSearchUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!req.body.search) {
      return next(setError(400, "Field search is required"));
    }

    const updateUser = await User.findByIdAndUpdate(id, {
      $push: { searchs: req.body.search },
    });

    updateUser.password = null;

    return res.status(200).json(updateUser);
  } catch (error) {
    return next(error);
  }
};

//
// PATH Set marketing indicator of a user (by Id)
//
const setMarketingUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (typeof req.body.marketing !== 'boolean') {
      return next(setError(400, "Field marketing is required"));
    }

    const updateUser = await User.findByIdAndUpdate(id, { 
      marketing: req.body.marketing 
    });
    updateUser.password = null;

    return res.status(200).json(updateUser);
  } catch (error) {
    return next(error);
  }
};

//
// DELETE User by Id
//
const deleteUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    
    if (BookingResolver.hasBookingActive(id)) {
      return next(setError(400, "The user has actived bookings"));
    }

    const updateUser = await User.findByIdAndUpdate(id, {
      email: null,
      name: 'User canceled',
      last_name: null,
      birthday: null,
      address: null,
      gender: null,
      img_profile: null,
      guardian: false,
      password: null,
      active: false,
    });

    //const user = await User.findByIdAndDelete(id);
    return res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  postNewUser,
  loginUser,
  logoutUser,
  updateUserById,
  setUserStatusById,
  updateUserPasswordById,
  updateImageUser,
  setUserAsGuardianById,
  addSearchUserById,
  setMarketingUserById,
  deleteUserById,
};
