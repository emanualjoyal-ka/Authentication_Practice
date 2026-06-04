import { Router } from "express";
import { deleteUser, login, logout, profile, refreshAccessToken, register, test } from "../controller/auth.controller.js";
import { authenticate } from "../middleware/authenticate.middleware.js";
import { authorization } from "../middleware/authorize.middleware.js";
const router = Router();

router.post("/register",register);
router.post("/login",login);
router.get("/profile",authenticate,authorization("USER"),profile);
router.delete("/delete-user",deleteUser);
router.post("/logout",authenticate,logout);
router.post("/refresh-token",refreshAccessToken); //should not use authenticate for refresh access token, because we use it when accesstoken expires and authentication uses accesstoken to verify
router.get("/test",authenticate,authorization("USER"),test);


export default router;