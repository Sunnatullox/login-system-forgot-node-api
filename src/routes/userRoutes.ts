import { Router } from "express";
import {
  sendForgotPassword,
  sendVerificationEmail,
  signInUser,
  signUpUser,
} from "../controllers/userController";
import {
  signUpValidation,
  signInValidation,
} from "../validation/userValidation/userValidation";

const router = Router();


router.get("/", async (req, res) => {
  res.json({ message: "Welcome to my Login System" });
});


router.post("/signUp", signUpValidation, signUpUser);
router.post("/signIn", signInValidation, signInUser);
router.post("/send-verification-email", sendVerificationEmail);
router.put("/forgot-password", sendForgotPassword);

export default router;
