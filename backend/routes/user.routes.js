import express from "express";
import {protectRoute} from "../middleware/protectRoute.js";
import { getUserProfile,getSuggestedUsers ,followUnFollowUser,updateUser} from "../controllers/user.controller.js";

const router= express.Router();
/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management
 */

/**
 * @swagger
 * /user/profile/{username}:
 *   get:
 *     summary: Get user profile by username
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         description: Username of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 fullName:
 *                   type: string
 *             example:
 *               _id: "60b6c0f63e8c8b002aebb7b7"
 *               username: "john_doe"
 *               email: "john@example.com"
 *               fullName: "John Doe"
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/profile/:username",protectRoute,getUserProfile);

/**
 * @swagger
 * /users/suggested:
 *   get:
 *     summary: Get suggested users for following
 *     tags: [User]
 *     responses:
 *       200:
 *         description: List of suggested users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 *             example:
 *               - _id: "60b6c0f63e8c8b002aebb7b8"
 *                 username: "jane_doe"
 *                 email: "jane@example.com"
 *               - _id: "60b6c0f63e8c8b002aebb7b9"
 *                 username: "michael_smith"
 *                 email: "michael@example.com"
 *       500:
 *         description: Server error
 */
router.get("/suggested",protectRoute,getSuggestedUsers);

/**
 * @swagger
 * /users/follow/{id}:
 *   post:
 *     summary: Follow or unfollow a user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to follow/unfollow
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User followed/unfollowed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "User followed successfully"
 *       400:
 *         description: Bad request (e.g., cannot follow/unfollow self)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "You can't follow/unfollow yourself"
 *       500:
 *         description: Server error
 */
router.post("/follow/:id",protectRoute,followUnFollowUser);

/**
 * @swagger
 * /users/update:
 *   post:
 *     summary: Update user profile
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               bio:
 *                 type: string
 *               link:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               currentPassword:
 *                 type: string
 *               profileImg:
 *                 type: string
 *               coverImg:
 *                 type: string
 *             example:
 *               fullName: "John Doe"
 *               email: "john.doe@example.com"
 *               username: "john_doe"
 *               bio: "Web developer and photographer."
 *               link: "https://johndoe.com"
 *               newPassword: "newStrongPassword"
 *               currentPassword: "currentPassword"
 *               profileImg: "https://example.com/profile.jpg"
 *               coverImg: "https://example.com/cover.jpg"
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fullName:
 *                   type: string
 *                 email:
 *                   type: string
 *                 username:
 *                   type: string
 *                 bio:
 *                   type: string
 *                 link:
 *                   type: string
 *                 profileImg:
 *                   type: string
 *                 coverImg:
 *                   type: string
 *             example:
 *               fullName: "John Doe"
 *               email: "john.doe@example.com"
 *               username: "john_doe"
 *               bio: "Web developer and photographer."
 *               link: "https://johndoe.com"
 *               profileImg: "https://example.com/profile.jpg"
 *               coverImg: "https://example.com/cover.jpg"
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post("update",protectRoute,updateUser);

export default router;