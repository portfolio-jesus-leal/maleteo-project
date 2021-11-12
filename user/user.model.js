const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { validationPassword } = require("../_shared/utils/validations.utils");

const userSchema = new mongoose.Schema(
{
    alias: { type:String, required:true, trim:true, unique:true },
    email: { type:String, required:true, trim:true, unique:true },
    name: { type:String, required:true, trim:true },
    last_name: { type:String, required:true, trim:true },
    birthday: { type:Date, required:true },
    address: { type:String, required:true, trim:true },
    gender: { type:String, required:true },
    img_profile: { type:String },
    guardian: { type:Boolean, default:false },
    password: { type:String, required:true, trim:true },
    bookings: [{type: mongoose.Types.ObjectId, ref: 'Bookings'}],
    searchs: [ { type:String } ],
    active: { type:Boolean, required:true, default:true }
},
{
    timestamps: true
});

// Se ejecuta antes del save (document)
// Genera hash del password para guardarlo cifrado
userSchema.pre('save', function (next) {

    if (!validationPassword(this.password)) {
        const error = new Error();
        error.message = "Invalid password";
        error.status = 400
    }

    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

// Se ejecuta antes del findOneAndUpdate (query)
// Genera hash del password para guardarlo cifrado
userSchema.pre('findOneAndUpdate', function (next) {

    if (this._update.password) { 
        if (!validationPassword(this._update.password)) {
            const error = new Error();
            error.message = "Invalid password";
            error.status = 400
        }
        this._update.password = bcrypt.hashSync(this._update.password, 10);
    }

    next();
});


// Name of collection in MongoDB and schema
const User = mongoose.model('Users', userSchema);

module.exports = User;

