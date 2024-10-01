import express from "express";
import {signup,login,getMe,logout} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
import passport from "passport";
const router=express.Router();
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Apis Auth 
*/


/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get the logged-in user's profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns the current logged-in user's profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 fullname:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 followers:
 *                   type: array
 *                   items:
 *                     type: string
 *                 following:
 *                   type: array
 *                   items:
 *                     type: string
 *                 profileImage:
 *                   type: string
 *                   nullable: true
 *                 coverImage:
 *                   type: string
 *                   nullable: true
 *             example:
 *               _id: "60b6c0f63e8c8b002aebb7b9"
 *               fullname: "John Doe"
 *               username: "johndoe"
 *               email: "johndoe@example.com"
 *               followers: []
 *               following: []
 *               profileImage: null
 *               coverImage: null
 *       500:
 *         description: Internal server error
 */
router.get("/me",protectRoute,getMe);

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Sign up a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullname
 *               - username
 *               - email
 *               - password
 *             properties:
 *               fullname:
 *                 type: string
 *                 example: John Doe
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: MySecurePassword123
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 fullname:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 followers:
 *                   type: array
 *                   items:
 *                     type: string
 *                 following:
 *                   type: array
 *                   items:
 *                     type: string
 *                 profileImage:
 *                   type: string
 *                   nullable: true
 *                 coverImage:
 *                   type: string
 *                   nullable: true
 *             example:
 *               _id: "60b6c0f63e8c8b002aebb7b9"
 *               fullname: "John Doe"
 *               username: "johndoe"
 *               email: "johndoe@example.com"
 *               followers: []
 *               following: []
 *               profileImage: null
 *               coverImage: null
 *       400:
 *         description: Validation errors
 *       500:
 *         description: Internal server error
 */
router.post("/signup",signup);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in an existing user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 format: password
 *                 example: MySecurePassword123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 fullname:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 followers:
 *                   type: array
 *                   items:
 *                     type: string
 *                 following:
 *                   type: array
 *                   items:
 *                     type: string
 *                 profileImage:
 *                   type: string
 *                   nullable: true
 *                 coverImage:
 *                   type: string
 *                   nullable: true
 *             example:
 *               _id: "60b6c0f63e8c8b002aebb7b9"
 *               fullname: "John Doe"
 *               username: "johndoe"
 *               email: "johndoe@example.com"
 *               followers: []
 *               following: []
 *               profileImage: null
 *               coverImage: null
 *       400:
 *         description: Invalid username or password
 *       500:
 *         description: Internal server error
 */
router.post("/login",login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Log out the current user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Logged out successfully"
 *       500:
 *         description: Internal server error
 */
router.post("/logout",logout);



/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: "Start Google OAuth login flow"
 *     description: "Redirects to Google for OAuth login."
 *     tags:
 *       - Authentication
 *     responses:
 *       302:
 *         description: "Redirect to Google for authentication."
 *       500:
 *         description: "Internal Server Error."
 */
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );
  
/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: "Handle OAuth callback from Google"
 *     description: "Handles the callback after Google authentication and redirects to success or failure."
 *     tags:
 *       - Authentication
 *     responses:
 *       302:
 *         description: "Redirect to home page on success or login page on failure."
 *       500:
 *         description: "Internal Server Error."
 */
router.get(
    "/google/callback",
    passport.authenticate("google", {
      failureRedirect: "/login", // Redirect if login fails
      successRedirect: "/", // Redirect to home or dashboard on success
    })
  );
  
/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: "Log out the user"
 *     description: "Logs out the authenticated user and clears the session."
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: "User logged out successfully."
 *       500:
 *         description: "Internal Server Error."
 */
router.get("/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/"); // Redirect to home after logout
    });
  });

export default router;