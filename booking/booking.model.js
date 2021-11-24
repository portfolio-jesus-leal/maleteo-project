const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
{
    user: { type: mongoose.Types.ObjectId, ref: 'users', required:true, trim:true },
    guardian: { type: mongoose.Types.ObjectId, ref: 'users', required:true, trim:true },
    init_date: { type:Date, required:true },
    end_date: { type:Date, required:true },
    pieces: { type:Number, required:true },
    locker: { type: mongoose.Types.ObjectId, ref: 'lockers', required:true, trim:true},
    rate: { type: mongoose.Types.ObjectId, ref: 'rates', required:true, trim:true},
    price: { type:Number, default:0 },
    review: { type:String },
    review_starts: { type:Number, default:0, max:5 },
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

