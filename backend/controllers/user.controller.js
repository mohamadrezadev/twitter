import cloudinary from "cloudinary"
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
export const getUserProfile=async(req,res)=>{
    const {username}=req.params;
    try {
        const user=await User.findOne({username}).select("-password");
        if(!user) return res.status(404).json({message:"User not found"});

        return res.status(200).json(user);
    } catch (error) {
        console.log("Error in getUserProfile: ", error.message);
		return res.status(500).json({ error: error.message });
    }
};


export const followUnFollowUser=async (req,res)=>{
    try {
        
        const {id}=req.params;
        const userToModify=await User.findById(id);
        const currentUser=await User.findById(req.user._id);
        
        if(id===req.user._id.toString()) return res.status(400).json({ error: "You can't follow/UnFollow yourself" });

        if(!userToModify || !currentUser) return res.status(400).json({ error: "User not found" });

        const isFollowing=currentUser.following.includes(id);
     
        if(isFollowing)
        {
            await User.findByIdAndUpdate(id,{$pull:{followers:req.user._id}});
            await  User.findByIdAndUpdate(req.user._id,{$pull:{following:id}});
            console.log(currentUser.following.length);

            res.status(200).json({message: "User unfollowed successfully"});
        }
        else{
            // Follow the user
			await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

            // Send notification to the user
			const newNotification = new Notification({
				type: "follow",
				from: req.user._id,
				to: userToModify._id,
			});

			await newNotification.save();

            res.status(200).json({ message: "User followed successfully" });

        }

    } catch (error) {
        console.log("Error in followUnfollowUser: ", error.message);
		res.status(500).json({ error: error.message });
    }
}



export const getSuggestedUsers =async(req,res)=>{
    try {
        
        const userId=req.user._id;
        const usersFollowedByme=await User.findById(userId).select("following");
        const users=await User.aggregate([
            {
                $match: {_id:
                    {$ne: userId}
                }
            },
            {$sample:{size:10}},
        ]);

        const filteredUsers=users.filter((user)=>!usersFollowedByme.following.includes(user._id));
        const suggestUsers=filteredUsers.slice(0,4);

        suggestUsers.forEach(user => user.password=null);
        res.status(200).json(suggestUsers);

    } catch (error) {
        console.log("Error in getSuggestedUsers: ", error.message);
		res.status(500).json({ error: error.message });
    }
}

export const updateUser=async (req,res)=>{
  const {fullName,email,username,bio,link,newPassword,currentPassword }=req.body;
  const userId = req.user._id;

  let { profileImg, coverImg } = req.body;
    console.log(profileImg);
    try {
    let user=await User.findById(userId);
    if(!user) return res.status(400).json({ message: "User not found" });
    
    if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) 
        return res.status(400).json({ error: "Please provide both current password and new password" });

    if (currentPassword && newPassword) {
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ error: "Current password is incorrect" });
        if (newPassword.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
    }

    if(profileImg){
        if(user.profileImg){
            await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
        }
        const uploadedResponse =await cloudinary.uploader.upload(profileImg);
        console.log(uploadedResponse);
        profileImg=uploadedResponse.secure_url;
        console.log(profileImg);
        
    }
    if (coverImg) {
        if (user.coverImg) {
            await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
        }

        const uploadedResponse  = await cloudinary.uploader.upload(coverImg);
        coverImg = uploadedResponse .secure_url;
    }


    user.fullName = fullName || user.fullName;
	user.email = email || user.email;
	user.username = username || user.username;
	user.bio = bio || user.bio;
	user.link = link || user.link;
	user.profileImage = profileImg || user.profileImage;
	user.coverImage = coverImg || user.coverImage;

    console.log(user.profileImage);

    user = await user.save();
    user.password = null;

   return res.status(200).json(user);
    
  } catch (error) {
    console.log("Error in updateUser: ", error.message);
    res.status(500).json({ error: error.message });
  }
}

export const userData=async (req,res)=>{
    try {
        const action= req.params.action;
        console.log(action);
        const userIds = req.body.userIds;
        if (!Array.isArray(userIds)) {
            return res.status(400).json({ error: "Invalid input. Expected an array of user IDs." });
        }
        const users = await User.find({ _id: { $in: userIds } }).select("-password");

        if (!users.length) 
            return res.status(404).json({ message: "No users found with the provided IDs." });

        res.status(200).json(users);
   
        
    } catch (error) {
        console.log("Error in userData: ", error.message);
        res.status(500).json({ error: error.message });
    }
}