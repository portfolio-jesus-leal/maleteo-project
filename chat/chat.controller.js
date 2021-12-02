const Chat = require("./chat.model");

//
// GET all chats
//
const getAllChats = async (req, res, next) => {
  console.log("getAllChats");

  try {
    const chats = await Chat.find();
    return res.status(200).json({ chats });
  } catch (error) {
    next(error);
  }
};

//
// GET chat by Id
//
const getChatById = async (req, res, next) => {
    console.log("getChatById");

    try {
        const { id } = req.params;
        const chat = await Chat.findById(id);
        return res.status(200).json({ chat });
    } catch (error) {
        next(error);
    }
}

//
// GET chats by user
//
const getChatsByUser = async (req, res, next) => {
    console.log("getChatsByUser");

    try {
        const { user } = req.params;
        const chats = await Chat.find({
            $or: [{ from: user }, { to: user }]
        }).sort({ date: 1 });
        return res.status(200).json({ chats });
    } catch (error) {
        next(error);
    }
}

//
// GET chats by user From
//
const getChatsFrom = async (req, res, next) => {
  console.log("getChatsFrom");

  try {
      const { user } = req.params;
      const chats = await Chat.find({ from: user }).sort({ date: 1 });
      return res.status(200).json({ chats });
  } catch (error) {
      next(error);
  }
}

//
// GET chats by user To
//
const getChatsTo = async (req, res, next) => {
  console.log("getChatsTo");

  try {
      const { user } = req.params;
      const chats = await Chat.find({ to: user }).populate('to').sort({ date: 1 });
      return res.status(200).json({ chats });
  } catch (error) {
      next(error);
  }
}

//
// POST - Create a new chat
//
const postNewChat = async (req, res, next) => {
  console.log("postNewChat");

  try {
    const {
      from,
      to,
      msg,
      booking,
    } = req.body;

    if (!req.body.isConfirmed) {
      isConfirmed = false;
    } else {
      isConfirmed = req.body.isConfirmed;
    }

    if (!req.body.status) {
      _status = "sent"
    } else {
      _status = req.body.status;
    }

    const newChat = new Chat({
      from: from,
      to: to,
      msg: msg,
      booking: booking,
      date: Date.now(),
      isConfirmed: isConfirmed,
      status: _status,
    });

    const chatInDB = await newChat.save();
    return res.status(201).json({ chatInDB });
  } catch (error) {
    next(error);
  }
};

//
// PATH Update status by id
//
const updateChatStatusById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateChat = await Chat.findByIdAndUpdate(
      id,
      { status: req.body.status },
      { returnDocument: "after" }
    );

    return res.status(200).json(updateChat);
  } catch (error) {
    return next(error);
  }
};

//
// PATH Update Confirmed status by id
//
const updateChatConfirmedById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateChat = await Chat.findByIdAndUpdate(
      id,
      { isConfirmed: true },
      { returnDocument: "after" }
    );

    return res.status(200).json(updateChat);
  } catch (error) {
    return next(error);
  }
};

//
// PATH Update status by id
//
const updateChatMessageById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const updateChat = await Chat.findByIdAndUpdate(
        id,
        { msg: req.body.msg },
        { returnDocument: "after" }
      );
  
      return res.status(200).json(updateChat);
    } catch (error) {
      return next(error);
    }
  };

//
// DELETE Chat by Id
//
const deleteChatById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const chat = await Chat.findByIdAndDelete(id);
    return res.status(200).json(chat);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAllChats,
  getChatById,
  getChatsByUser,
  postNewChat,
  updateChatStatusById,
  updateChatMessageById,
  deleteChatById,
  updateChatConfirmedById,
  getChatsFrom,
  getChatsTo,
};
