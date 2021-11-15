const userRouter = require("express").Router();
const upload = require('../_shared/middleware/file.middleware');
// ********** SOLO PARA PRUEBAS *****************
//const { isAuth } = require('../_shared/middleware/auth.middleware');
const isAuth = () => { console.log('isAuth')};
// ********** SOLO PARA PRUEBAS *****************

const {
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
} = require("./user.controller");

userRouter.post("/login", loginUser);
userRouter.post("/", upload.single('image'), postNewUser);

//userRouter.get("/", [isAuth], getAllUsers);
userRouter.get("/", getAllUsers);
userRouter.get("/:id", [isAuth], getUserById);
userRouter.get("/alias/:alias", [isAuth], getUserByAlias);
userRouter.put("/:id", [isAuth], upload.single('image'), updateUserById);
userRouter.post("/logout", [isAuth], logoutUser);
userRouter.patch("/image/:id", [isAuth], upload.single('image'), updateImageUser);
userRouter.patch("/status/:id", [isAuth], updateUserStatusById);
userRouter.patch("/guardian/:id", [isAuth], setUserAsGuardianById);
userRouter.patch("/search/:id", [isAuth], addSearchUserById);
userRouter.patch("/booking/:id", [isAuth], addBookingUserById);
userRouter.patch("/password/:id", [isAuth],updateUserPasswordById);
userRouter.delete("/:id", [isAuth], deleteUserById);

module.exports = userRouter;