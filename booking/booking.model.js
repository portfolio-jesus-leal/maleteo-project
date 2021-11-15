const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
{
    user: { type:String, ref: 'Users', required:true, trim:true },
    guardian: { type:String, ref: 'Users', required:true, trim:true },
    init_date: { type:Date, required:true },
    end_date: { type:Date, required:true },
    pieces: { type:Number, required:true },
    locker: { type: mongoose.Types.ObjectId, ref: 'Lockers', required:true, trim:true},
    rate: { type: mongoose.Types.ObjectId, ref: 'Rates', required:true, trim:true},
    review: { type:String },
    review_starts: { type:Number, default:0, max:5 },
    price: { type:Number, default:0 },
    status: { type:String, 
        required:true, 
        enum:['open', 'paid', 'cancelled', 'closed'],
        default: 'open'
    }
},
{
    timestamps: true
});

// Name of collection in MongoDB and schema
const Booking = mongoose.model('bookings', bookingSchema);

module.exports = Booking;

