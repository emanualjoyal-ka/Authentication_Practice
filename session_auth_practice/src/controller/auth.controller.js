import User from "../model/user.model.js";
import bcrypt from "bcrypt";



export const registerUser=async(req,res)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({message:"Email and password are required"});
        }

        //check if user already exists
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"Email already exists"});
        }

        //hash password
        const hashedPassword=await bcrypt.hash(password,10);

        //create new user
        const newUser=new User({
            email,
            password:hashedPassword,
        })

        await newUser.save();

        res.status(201).json({message:"User registered successfully"});
    } catch (error) {
        return res.status(500).json({message:"Server error",error:error instanceof Error ? error.message : error});
    }
}

export const loginUser=async(req,res)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({message:"Email and password are required"});
        }

        //check if user exists
        const existingUser=await User.findOne({email});
        if(!existingUser){
            return res.status(400).json({message:"Invalid credentials"});
        }

        //compare password
        const isMatch=await bcrypt.compare(password,existingUser.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }

        req.session.user={ // this will be stored in server RAM by default and express-session creates a sessionId which is automatically sends to cookie in browser as session ID and automatically sends to server on every request
            id:existingUser._id,
             email:existingUser.email,  
        } 

        console.log("User logged in:", req.session.user);

        res.status(200).json({message:"Login successful"});

    } catch (error) {
        res.status(500).json({message:"Server error",error:error instanceof Error ? error.message : error});
    }
}

export const getProfile=async(req,res)=>{
    try {
        const user=req.session.user;
        console.log("Fetching profile for user:", user);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message:"Server error",error:error instanceof Error ? error.message : error});
    }
}

export const logoutUser=async(req,res)=>{
    try {
        req.session.destroy(err=>{
            if(err){
                return res.status(500).json({message:"Logout failed",error:err instanceof Error ? err.message : err});
            }
            res.clearCookie("connect.sid"); // Clear the session cookie
            return res.status(200).json({message:"Logout successful"});
        });
        
    } catch (error) {
        res.status(500).json({message:"Server error",error:error instanceof Error ? error.message : error});
    }
}

export const getUsers=async(req,res)=>{
    try {
        const users=await User.find().select("-password"); // Exclude password field
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({message:"Server error",error:error instanceof Error ? error.message : error});
    }
}

export const testAuth=async(req,res)=>{
    try {
        res.status(200).json({message:"Authentication test successful"});
    } catch (error) {
        res.status(500).json({message:"Server error",error:error instanceof Error ? error.message : error});
    }
}