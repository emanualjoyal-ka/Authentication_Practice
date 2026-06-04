import bcrypt from "bcrypt";
import User from "../model/User.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import RefreshToken from "../model/RefreshToken.js";
import jwt from "jsonwebtoken";

//register user
export const register=async(req,res)=>{
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

       const hashedPassword=await bcrypt.hash(password,10);

        // Create new user
        const user=await User.create({
            name,
            email,
            password:hashedPassword
        });

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//login user
export const login=async(req,res)=>{
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }


        //generate access token and refresh token
        const accessToken=generateAccessToken(user);
        const refreshToken=generateRefreshToken(user);

        await RefreshToken.create({ // should hash the refresh token before saving to database for security reasons, but for simplicity we are saving it as plain text here
            userId:user._id,
            token:refreshToken
        });

        //send cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days, same as refresh token expiration
        });


        res.status(200).json({ message: "Login successful", accessToken,user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


//refresh access token
export const refreshAccessToken=async(req,res)=>{
    try {
        const refreshToken=req.cookies.refreshToken;

        if(!refreshToken){
            return res.status(401).json({ message: "No refresh token provided" });
        }

        const existingToken=await RefreshToken.findOne({ token:refreshToken });
        if(!existingToken){
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        //verify refresh token
        const decoded=jwt.verify(refreshToken,process.env.JWT_REFRESH_SECRET);
        
        const user=await User.findById(decoded.userId);
        if(!user){
            return res.status(401).json({ message: "User not found" });
        }

        //generate new access token
        const accessToken=generateAccessToken(user);

        res.status(200).json({ accessToken });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//profile
export const profile=async(req,res)=>{
    try {
        const user=await User.findById(req.user.userId).select("-password");
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const test=async(req,res)=>{
    try {
        res.json({message:"This is only accessable by admin, HELLO"})
    } catch (error) {
     res.status(500).json({ message: error.message });

    }
}

//delete user for just testing permission
export const deleteUser=async(req,res)=>{
    try {
        console.log(req.user.userId);
        
        await User.findByIdAndDelete(req.user.userId);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//logout user
export const logout=async(req,res)=>{
    try {
        // const refreshToken=req.headers.cookie; gives all cookies or refreshtoken in 'refreshToken=asdsad21ds...',we only need token part not refreshToken part, we need to split it to get the refresh token value
        const refreshToken=req.cookies.refreshToken; // so we use cookie-parser middleware to read cookies and get the refresh token value directly from req.cookies.refreshToken
        if(refreshToken){
            const deleted=await RefreshToken.findOneAndDelete({ token:refreshToken });
            console.log("deleted refresh token",deleted);
            
            res.clearCookie("refreshToken");
        }

        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}