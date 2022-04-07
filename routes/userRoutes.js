import express from "express";
import UserController from "../controllers/userControllers.js";
import userAuth from "../middleware/Auth_middleware.js";
const router = express.Router();

//? route level middleware to protect routes;
router.use("/changepassword", userAuth);
router.use("/loggeduser", userAuth);

//? public Routes
router.post("/register", UserController.UserRegistration);
router.post("/login", UserController.userLogin);
router.post(
  "/send-reset-password-email",
  UserController.sendUserResetPasswordEmail
);
router.post("/reset-password/:id/:token", UserController.userPasswordReset);

//? protected Routes
router.post("/changepassword", UserController.changePassword);
router.get("/loggeduser", UserController.loggedUser);

export default router;
