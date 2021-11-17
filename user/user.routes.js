const userRouter = require("express").Router();
const upload = require('../_shared/middleware/file.middleware');
const { isAuth } = require('../_shared/middleware/auth.middleware');

const {
    getAllUsers,
    getUserById,
    getUserByAlias,
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
} = require("./user.controller");

// Routes NOT secured by isAuth
userRouter.post("/login", loginUser);
userRouter.post("/", upload.single('image'), postNewUser);

// Routes secured by isAuth
userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);
userRouter.get("/alias/:alias", getUserByAlias);
userRouter.put("/:id", upload.single('image'), updateUserById);
userRouter.post("/logout", logoutUser);
userRouter.patch("/image/:id", upload.single('image'), updateImageUser);
userRouter.patch("/status/:id", setUserStatusById);
userRouter.patch("/guardian/:id", setUserAsGuardianById);
userRouter.patch("/search/:id", addSearchUserById);
userRouter.patch("/marketing/:id", setMarketingUserById);
userRouter.patch("/password/:id",updateUserPasswordById);
userRouter.delete("/:id", deleteUserById);

module.exports = userRouter;