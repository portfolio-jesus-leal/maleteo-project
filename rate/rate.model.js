const mongoose = require('mongoose');

const rateSchema = new mongoose.Schema(
{
    location: { type:String, required:true, trim:true },
    price: { type:Number, required:true },
    price_extra: { type:Number, default:0 },
    fee: { type:Number, default:0 },
    tax_pct: { type:Number, default:0 },
    description: { type:String },
    active: { type:Boolean, default:true}
},
{
    timestamps: true
});

// Name of collection in MongoDB and schema
const Rate = mongoose.model('rates', rateSchema);

module.exports = Rate;