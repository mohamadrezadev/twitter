import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { deleteNotifications, getNotifications } from "../controllers/notification.controller.js";

const router=express.Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         from:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *               description: Username of the user who triggered the notification.
 *               example: johndoe
 *             profileImage:
 *               type: string
 *               description: URL to the profile image of the user.
 *               example: https://example.com/profile-image.jpg
 *         to:
 *           type: string
 *           description: ID of the user receiving the notification.
 *           example: 6143b7a9f083a33a5f9d1234
 *         read:
 *           type: boolean
 *           description: Status of the notification, whether it has been read or not.
 *           example: false
 */

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get all notifications for the authenticated user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of notifications for the authenticated user.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *             examples:
 *               notificationsList:
 *                 summary: Example response for notifications list
 *                 value:
 *                   - from:
 *                       username: johndoe
 *                       profileImage: https://example.com/profile-image.jpg
 *                     to: 6143b7a9f083a33a5f9d1234
 *                     read: false
 *                   - from:
 *                       username: janedoe
 *                       profileImage: https://example.com/profile-image2.jpg
 *                     to: 6143b7a9f083a33a5f9d1234
 *                     read: true
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal Server Error"
 */

router.get("/",protectRoute,getNotifications);
/**
 * @swagger
 * /notifications:
 *   delete:
 *     summary: Delete all notifications for the authenticated user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success message after deleting all notifications.
 *         content:
 *           application/json:
 *             example:
 *               message: Notification delete successfully
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal Server Error"
 */
router.delete("/",protectRoute,deleteNotifications);

export default router