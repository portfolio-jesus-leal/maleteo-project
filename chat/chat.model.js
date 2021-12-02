const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
{
    from: { type:String, ref: 'users', required:true, trim:true},
    to: { type:String, ref: 'users', required:true, trim:true},
    msg: { type:String },
    date: { type:Date, default: Date.now },
    booking: { type:String, ref: 'bookings'},
    isConfirmed: { type:Boolean, default:false},
    status: { type:String, 
        enum:['sent', 'received', 'read', 'replied'],
        default: 'sent'
    }
},
{
    timestamps: true
});

// Name of collection in MongoDB and schema
const Chat = mongoose.model('chats', chatSchema);

module.exports = Chat;

