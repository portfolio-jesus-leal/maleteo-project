const User = require("./user.model");
const BookingResolver = require("../booking/booking.resolver");
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
// GET a user by alias
//
const getUserByAlias = async (req, res) => {
  try {
    const { alias } = req.params;
    const user = await User.find({ alias });

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
  const {
    alias,
    email,
    name,
    last_name,
    birthday,
    address,
    gender,
    img_profile,
    guardian,
    password,
    bookings,
    searchs,
    active,
  } = req.body;

  try {
    const newUser = new User({
      alias: alias.toLowerCase(),
      email: email,
      name: name,
      last_name: last_name,
      birthday: birthday,
      address: address,
      gender: gender.toLowerCase(),
      img_profile: img_profile,
      guardian: guardian,
      password: password,
      bookings: bookings,
      searchs: searchs,
      active: active,
    });
    password = null;
    req.body.password = null;

    const userInBD = await newUser.save();
    return res.status(201).json({ userInBD });
  } catch (error) {
    next(error);
  }
};

//
// POST - Login
//
const loginUser = async (req, res, next) => {
  try {
    if (req.body.alias) {
      const userInBD = await User.findOne({ alias: req.body.alias });
      console.log("Usuario encontrado ->", userInBD);
    } else {
      if (req.body.email) {
        const userInBD = await User.findOne({ email: req.body.email });
        console.log("Usuario encontrado ->", userInBD);
      }
    }

    if (!userInBD) {
      const error = new Error();
      error.message = "Alias does not exist";
      error.status = 404;
      return next(error);
    }

    const isValidPassword = bcrypt.compareSync(
      req.body.password,
      userInBD.password
    );
    userInBD.password = null;
    req.body.password = null;

    if (!isValidPassword) {
      const error = new Error();
      error.message = "Invalid credentials";
      error.status = 403;
      return next(error);
    }

    console.log("Contraseña correcta");
    const token = jwt.sign(
      { id: userInBD._id, alias: userInBD.alias },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    return res.status(201).json(token);
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
      alias,
      email,
      name,
      last_name,
      birthday,
      address,
      gender,
      img_profile,
      guardian,
      password,
      bookings,
      searchs,
      active,
    } = req.body;

    const updateUser = await User.findByIdAndUpdate(id, {
      alias: alias.toLowerCase(),
      email: email,
      name: name,
      last_name: last_name,
      birthday: birthday,
      address: address,
      gender: gender.toLowerCase(),
      img_profile: img_profile,
      guardian: guardian,
      password: password,
      bookings: bookings,
      searchs: searchs,
      active: active,
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
    return res.status(204).json();
  } catch (error) {
    return next(error);
  }
};

//
// PATH Update status by id
//
const updateUserStatusById = async (req, res, next) => {
  try {
    const { id } = req.params;

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
        const error = new Error();
        error.message="The image name is not valid";
        error.status=400;
        return next(error);
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
      const error = new Error();
      error.message = "Field search is required";
      error.status = 400;
      return next(error);
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
// PATH Add a booking to user (by Id)
//
const addBookingUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!req.body.booking) {
      const error = new Error();
      error.message = "Field booking is required";
      error.status = 400;
      return next(error);
    } else {
      BookingResolver.findBookingById(req.body.booking);
    }

    const updateUser = await User.findByIdAndUpdate(id, {
      $push: { bookings: req.body.booking },
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
      const error = new Error();
      error.message = "The user has actived bookings";
      error.status = 400;
      return next(error);
    }

    const updateUser = await User.findByIdAndUpdate(id, {
      email: null,
      name: null,
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
  getUserByAlias,
  postNewUser,
  loginUser,
  logoutUser,
  updateUserById,
  updateUserStatusById,
  updateUserPasswordById,
  updateImageUser,
  setUserAsGuardianById,
  addSearchUserById,
  addBookingUserById,
  deleteUserById,
};
