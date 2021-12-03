const userRouter = require("express").Router();
const upload = require('../_shared/middleware/file.middleware');
const { isAuth } = require('../_shared/middleware/auth.middleware');

const {
    getAllUsers,
    getUserById,
    postNewUser,
    loginUser,
    logoutUser,
    updateUserById,
    setUserStatusById,
    updateUserPasswordById,
    updateImageUser,
    updateUserAddressById,
    setUserAsGuardianById,
    addSearchUserById,
    setMarketingUserById,
    deleteUserById,
} = require("./user.controller");

// Routes NOT secured by isAuth
userRouter.post("/login", loginUser);
userRouter.post("/", upload.single('image'), postNewUser);

// Routes secured by isAuth
userRouter.get("/", [isAuth], getAllUsers);
userRouter.get("/:id", [isAuth], getUserById);
userRouter.put("/:id", [isAuth], upload.single('image'), updateUserById);
userRouter.post("/logout", [isAuth], logoutUser);
userRouter.patch("/image/:id", [isAuth], upload.single('image'), updateImageUser);
userRouter.patch("/address/:id", [isAuth], updateUserAddressById);
userRouter.patch("/status/:id", [isAuth], setUserStatusById);
userRouter.patch("/guardian/:id", [isAuth], setUserAsGuardianById);
userRouter.patch("/search/:id", [isAuth], addSearchUserById);
userRouter.patch("/marketing/:id", [isAuth], setMarketingUserById);
userRouter.patch("/password/:id", [isAuth],updateUserPasswordById);
userRouter.delete("/:id", [isAuth], deleteUserById);

module.exports = userRouter;