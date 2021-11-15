const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
{
    from: { type:String, ref: 'Users', required:true, trim:true},
    to: { type:String, ref: 'Users', required:true, trim:true},
    msg: { type:String },
    date: { type:Date, default: Date.now },
    status: { type:String, 
        enum:['sent', 'received', 'read', 'replied'],
        default: 'sent'
    }
},
{
    timestamps: true
});

// Name of collection in MongoDB and schema
const Chat = mongoose.model('Chats', chatSchema);

module.exports = Chat;

