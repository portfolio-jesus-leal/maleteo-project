const chatRouter = require("express").Router();

const {
    getAllChats,
    getChatById,
    getChatsByUser,
    postNewChat,
    updateChatStatusById,
    updateChatMessageById,
    deleteChatById,
} = require("./chat.controller");

chatRouter.get("/", getAllChats);
chatRouter.get("/:id", getChatById);
chatRouter.get("/user/:user", getChatsByUser);
chatRouter.post("/", postNewChat);
chatRouter.patch("/status/:id", updateChatStatusById);
chatRouter.patch("/msg/:id", updateChatMessageById);
chatRouter.delete("/:id", deleteChatById);

module.exports = chatRouter;