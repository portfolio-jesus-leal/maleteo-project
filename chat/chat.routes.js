const chatRouter = require("express").Router();

const {
    getAllChats,
    getChatById,
    getChatsByUser,
    getChatsFrom,
    getChatsTo,
    postNewChat,
    updateChatStatusById,
    updateChatMessageById,
    deleteChatById,
    updateChatConfirmedById,
} = require("./chat.controller");

chatRouter.get("/user/:user", getChatsByUser);
chatRouter.get("/from/:user", getChatsFrom);
chatRouter.get("/to/:user", getChatsTo);
chatRouter.get("/:id", getChatById);
chatRouter.get("/", getAllChats);
chatRouter.post("/", postNewChat);
chatRouter.patch("/status/:id", updateChatStatusById);
chatRouter.patch("/msg/:id", updateChatMessageById);
chatRouter.patch("/confirmed/:id", updateChatConfirmedById);
chatRouter.delete("/:id", deleteChatById);

module.exports = chatRouter;