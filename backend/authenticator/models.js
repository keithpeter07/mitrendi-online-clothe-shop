const mongoose = require('mongoose')

const Schema = mongoose.Schema


const UserSchema = new Schema({
    firstname : {type: String, required: true},
    lastname : {type: String, required: true},
    phonenumber : {type: String, required: true},
    MPESA_phonenumber : {type : String, required: false}, //will be made available once a payment is done (It may or may not be the same as the primary phone number)
    email : {type: String, required: true, unique: true},
    account_active : {type: Boolean, default: false},  //active if the email has been confirmed
    activation_code : {type: String, required: true},
    password : {type: String, required: true},
    staff : {type: Boolean, default: false},
    is_superuser : {type: Boolean, default: false},
    spent: {type: Number, default: 0},
    purchases : {type: Number, default: 0},
    modify: {type: Boolean, default: false},
    modify_token: {type: String, default: '_'}
}, {timestamps: true})




const SuperuserSchema = new Schema({
    user_id : {type: String, required: true},
    username : {type: String, required: true},
    password : {type: String, required: true},
    token : {type: String, required: false},
    pin : {type: String, required: true}
}, {timestamps: true})



const Users = mongoose.model('User', UserSchema)
const Superusers = mongoose.model('Superuser', SuperuserSchema)

module.exports = {Users, Superusers}