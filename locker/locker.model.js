const mongoose = require('mongoose');

const lockerSchema = new mongoose.Schema(
{
    guardian: { type:mongoose.Types.ObjectId, ref: 'Users', required:true, trim:true },
    description: { type:String, required:true },
    type: { type:String, required:true },
    location: { type:String, required:true },
    address: { type:String, required:true },
    latitude: { type:Number, required:true },
    longitude: { type:Number, required:true },
    available: [{ 
        available_from: { type:Date, default:Date.now },
        available_to: { type:Date, default:new Date('2999-12-31T00:00:00Z')},
    }],
    pieces_max: { type:Number, required:true, default:1 },
    tags: [{ type:String }],
    images: [{ 
        img_url: { type:String },
        img_description: { type:String },
    }],
    active: { type:Boolean, default:true}
},
{
    timestamps: true
});

// Name of collection in MongoDB and schema
const Locker = mongoose.model('lockers', lockerSchema);

module.exports = Locker;