import express from "express";
import { protectRoute } from "../middleware/Auth.js";
import { sendMessage , getMessages , getConversation} from "../controllers/messageController.js";

const router = express.Router();

router.post("/", protectRoute, sendMessage);
router.get("/conversations", protectRoute, getConversation);
router.get("/:otherUserId", protectRoute, getMessages);

export default router;
