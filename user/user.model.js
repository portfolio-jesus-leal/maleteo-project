const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { validationPassword } = require("../_shared/utils/validations.utils");
const { setError } = require("../_shared/utils/error/error.utils");

const userSchema = new mongoose.Schema(
{
    email: { type:String, required:true, trim:true, unique:true },
    name: { type:String, required:true, trim:true },
    last_name: { type:String, required:true, trim:true },
    birthday: { type:Date, required:true },
    address: { type:String, trim:true },
    gender: { type:String },
    img_profile: { type:String },
    guardian: { type:Boolean, default:false },
    password: { type:String, required:true, trim:true },
    searchs: [ { type:String } ],
    active: { type:Boolean, default:true },
    marketing: { type:Boolean, default:false },
},
{
    timestamps: true
});

// Se ejecuta antes del save (document)
// Genera hash del password para guardarlo cifrado
userSchema.pre('save', function (next) {

    if (!validationPassword(this.password)) {
        return next(setError(400, "Invalid password"));
    } else {
        this.password = bcrypt.hashSync(this.password, 10);
    }
    next();
});

// Se ejecuta antes del findOneAndUpdate (query)
// Genera hash del password para guardarlo cifrado
userSchema.pre('findOneAndUpdate', function (next) {

    if (this._update.password) { 
        if (!validationPassword(this._update.password)) {
            return next(setError(400, "Invalid password"));
        } else {
            this._update.password = bcrypt.hashSync(this._update.password, 10);
        }
    }
    next();
});


// Name of collection in MongoDB and schema
const User = mongoose.model('users', userSchema);

module.exports = User;

