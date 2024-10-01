import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";

import {
  commentOnPost,
  createPost,
  getAllPosts,
  deletePost,
  getFollowingPosts,
  getLikedPosts,
  getUserPosts,
  likeUnlikePost,
} from "../controllers/post.controller.js";

const router=express.Router();
/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Apis Posts 
 */

/**
 * @swagger
 * /posts/all:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: List of all posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   user:
 *                     type: object
 *                   text:
 *                     type: string
 *                   img:
 *                     type: string
 *                   likes:
 *                     type: array
 *                     items:
 *                       type: string
 *                   comments:
 *                     type: array
 *                     items:
 *                       type: object
 *             example:
 *               - _id: "60b6c0f63e8c8b002aebb7b8"
 *                 user: { "_id": "60b6c0f63e8c8b002aebb7b7", "username": "john_doe" }
 *                 text: "Hello, world!"
 *                 img: "https://example.com/image.jpg"
 *                 likes: []
 *                 comments: []
 *       500:
 *         description: Internal server error
 */
router.get("/all",protectRoute,getAllPosts);

/**
 * @swagger
 * /posts/following:
 *   get:
 *     summary: Get posts from followed users
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: List of posts from followed users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   user:
 *                     type: object
 *                   text:
 *                     type: string
 *                   img:
 *                     type: string
 *                   likes:
 *                     type: array
 *                     items:
 *                       type: string
 *                   comments:
 *                     type: array
 *                     items:
 *                       type: object
 *             example:
 *               - _id: "60b6c0f63e8c8b002aebb7b8"
 *                 user: { "_id": "60b6c0f63e8c8b002aebb7b7", "username": "john_doe" }
 *                 text: "Beautiful day!"
 *                 img: "https://example.com/image.jpg"
 *                 likes: ["60b6c0f63e8c8b002aebb7b7"]
 *                 comments: []
 *       500:
 *         description: Internal server error
 */
router.get("/following",protectRoute,getFollowingPosts);

/**
 * @swagger
 * /posts/like/{id}:
 *   post:
 *     summary: Like or unlike a post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post liked or unliked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 likes:
 *                   type: number
 *             example:
 *               message: "Post liked successfully"
 *               likes: 10
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
router.get("/like/:id",protectRoute,getLikedPosts);

/**
 * @swagger
 * /posts/user/{username}:
 *   get:
 *     summary: Get all posts from a specific user by their username
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username of the user whose posts to fetch
 *     responses:
 *       200:
 *         description: List of posts created by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   user:
 *                     type: object
 *                   text:
 *                     type: string
 *                   img:
 *                     type: string
 *                   likes:
 *                     type: array
 *                     items:
 *                       type: string
 *                   comments:
 *                     type: array
 *                     items:
 *                       type: object
 *             example:
 *               - _id: "60b6c0f63e8c8b002aebb7b8"
 *                 user: { "_id": "60b6c0f63e8c8b002aebb7b7", "username": "jane_doe" }
 *                 text: "My first post!"
 *                 img: "https://example.com/photo.jpg"
 *                 likes: []
 *                 comments: []
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/user/:username",protectRoute,getUserPosts);

/**
 * @swagger
 * /posts/create:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *               img:
 *                 type: string
 *                 description: Image URL
 *             example:
 *               text: "This is a new post"
 *               img: "https://example.com/image.jpg"
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 user:
 *                   type: object
 *                 text:
 *                   type: string
 *                 img:
 *                   type: string
 *             example:
 *               _id: "60b6c0f63e8c8b002aebb7b8"
 *               user: { "_id": "60b6c0f63e8c8b002aebb7b7", "username": "john_doe" }
 *               text: "This is a new post"
 *               img: "https://example.com/image.jpg"
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post("/create",protectRoute,createPost);

/**
 * @swagger
 * /posts/like/{id}:
 *   get:
 *     summary: Get posts liked by a user
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of posts liked by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   user:
 *                     type: object
 *                   text:
 *                     type: string
 *                   img:
 *                     type: string
 *                   likes:
 *                     type: array
 *                     items:
 *                       type: string
 *                   comments:
 *                     type: array
 *                     items:
 *                       type: object
 *             example:
 *               - _id: "60b6c0f63e8c8b002aebb7b8"
 *                 user: { "_id": "60b6c0f63e8c8b002aebb7b7", "username": "john_doe" }
 *                 text: "Great picture!"
 *                 img: "https://example.com/image.jpg"
 *                 likes: ["60b6c0f63e8c8b002aebb7b7", "60b6c0f63e8c8b002aebb7b6"]
 *                 comments: []
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post("/like/:id",protectRoute,likeUnlikePost);

/**
 * @swagger
 * /posts/comment/{id}:
 *   post:
 *     summary: Comment on a post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *             example:
 *               text: "Great post!"
 *     responses:
 *       200:
 *         description: Comment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               _id: "60b6c0f63e8c8b002aebb7b8"
 *               comments: [{ "user": "60b6c0f63e8c8b002aebb7b7", "text": "Great post!" }]
 *       400:
 *         description: Text is required
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
router.post("/comment/:id",protectRoute,commentOnPost);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Post deleted successfully"
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id",protectRoute,deletePost);

export default router;