const mongoose = require('mongoose');

const rateSchema = new mongoose.Schema(
{
    location: { type:String, required:true, trim:true },
    location_description: { type:String, required:true, trim:true },
    coordinates: {
        latitude: { type:Number, required:true },
        longitude: { type:Number, required:true },
        range: { type:Number, required:true },
    },
    price: { type:Number, required:true },
    price_extra: { type:Number, default:0 },
    fee: { type:Number, default:0 },
    tax_pct: { type:Number, default:0, min:0, max:100 },
    description: { type:String },
    active: { type:Boolean, default:true}
},
{
    timestamps: true
});

// Name of collection in MongoDB and schema
const Rate = mongoose.model('rates', rateSchema);

module.exports = Rate;