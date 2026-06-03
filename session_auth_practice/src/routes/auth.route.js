import { Router } from "express";
import { getProfile, getUsers, loginUser, logoutUser, registerUser, testAuth } from "../controller/auth.controller.js";
import { isAuthenticated } from "../middleware/auth.Middleware.js";

const router=Router();

router.post("/register",registerUser);
router.get("/get-Users",isAuthenticated,getUsers);
router.post("/login",loginUser);
router.get("/profile",isAuthenticated,getProfile);
router.get("/test-auth",isAuthenticated,testAuth);
router.post("/logout",isAuthenticated,logoutUser);


export default router;