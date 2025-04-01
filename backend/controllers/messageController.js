import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import { getRecipientSocketId, io } from "../socket/socket.js";
import { v2 as cloudinary } from "cloudinary";
async function sendMessage(req, res) {
  try {
    const { recipientId, message } = req.body;
    let { img } = req.body;
    const senderId = req.user._id;
    let conversation = await Conversation.findOne({
      participants: {
        $all: [senderId, recipientId],
      },
    });
    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, recipientId],
        lastMessage: {
          sender: senderId,
          text: message,
        },
      });
      await conversation.save();
    }

    if (img) {
      const uploadedRes = await cloudinary.uploader.upload(img)
      img = uploadedRes.secure_url;
    }
    const newMessage = new Message({
      conversationId: conversation._id,
      sender: senderId,
      text: message,
      img: img || "",
    });
    await Promise.all([
      newMessage.save(),
      conversation.updateOne({
        lastMessage: {
          sender: senderId,
          text: message,
        },
      }),
    ]);
    const recipientsSocketId = getRecipientSocketId(recipientId);
    if (recipientsSocketId) {
      io.to(recipientsSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
async function getMessages(req, res) {
  const userId = req.user._id;
  const { otherUserId } = req.params;
  try {
    const conversation = await Conversation.findOne({
      participants: {
        $all: [userId, otherUserId],
      },
    });
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    const messages = await Message.find({
      conversationId: conversation._id,
    }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
async function getConversation(req, res) {
  const userId = req.user._id;
  try {
    const conversations = await Conversation.find({
      participants: userId,
    }).populate({
      path: "participants",
      select: "username profilePic",
    });

    conversations.forEach((convo) => {
      convo.participants = convo.participants.filter(
        (participant) => participant._id.toString() !== userId.toString()
      );
    });
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export { sendMessage, getMessages, getConversation };
