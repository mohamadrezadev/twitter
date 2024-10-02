import { generateTokenAndSetCookie } from "../lib/utils/GenerateToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup=async (req,res)=>{
    try {
        const { fullname,username,email,password}=req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email))
           return res.status(400).json({message:"Invalid email"});
        
    const existedUser=await User.findOne({username});
    if(existedUser)
       return res.status(400).json({message:"Username Already Exist"});
       
    const existedEmail=await User.findOne({email});
    if(existedEmail)
      return res.status(400).json({message:"Email Already Exist"});
    
    
    if(password.length<6)
      return res.status(400).json({ error: "Password must be at least 6 characters long" });

    
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt);
    const newuser=new User({
        fullname,
        username,
        email,
        password:hashedPassword,
    });
    if(newuser){
       
        generateTokenAndSetCookie(newuser._id,res);
        await newuser.save();

        res.status(201).json({
            _id:newuser._id,
            fullname:newuser.fullname,
            username:newuser.username,
            email:newuser.email,
            followers:newuser.followers,
            following:  newuser.following,
            profileImage: newuser.profileImage,
            coverImage: newuser.coverImage,
        });
       
    }
    else{
        res.status(400).json({ error: "Invalid user data" });
    }

    } catch (error) {
        console.log("Error in signup controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
    }
}


export const login=async (req,res)=>{
    try {
        const {username,password}=req.body;
        const user=await User.findOne({username});

        console.log(user?.password);
        const isPasswordCorrect=await bcrypt.compare(password,user?.password||"");
        if(!user|| ! isPasswordCorrect)
            return res.status(400).json({error: "Invalid username or password" });
        
        generateTokenAndSetCookie(user._id,res);
        res.status(200).json({
            _id:user._id,
            fullname:user.fullname,
            username:user.username,
            email:user.email,
            followers:user.followers,
            following:  user.following,
            profileImage: user.profileImage,
            coverImage: user.coverImage,
        });


    } catch (error) {
        console.log("Error in login controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
    }
}

export const logout=async (req,res)=>{
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({message: "Logged out successfully" });

    } catch (error) {
        console.log("Error in logout controller",error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
export const getMe=async(req,res)=>{
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in get me  controller",error.message);
        res.status(500).json({ error: "Internal Server Error" }); 
    }
}