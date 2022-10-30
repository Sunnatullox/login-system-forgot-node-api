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

router.post("/signUp", signUpValidation, signUpUser);
router.post("/signIn", signInValidation, signInUser);
router.post("/send-verification-email", sendVerificationEmail);
router.post("/send-forgot-password", sendForgotPassword);

export default router;
