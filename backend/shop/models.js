const mongoose = require('mongoose')
const Schema = mongoose.Schema


const ItemSchema = new Schema({
    name : {type: String, required: true},
    image1: {type: String, required: true},
    image2: {type: String, required: true},
    description : {type: String, required: true},
    size : {type: String, required: true},
    price : {type: Number, required: true},
    bp : {type: Number, required: true}, //This is the buying price
    sold : {type: Boolean, default: false},
    category : {type: String, required: true},
    keywords : {type: String, required: true},
    female : {type: Boolean, required: true}, //When true, the item is for women
    male : {type: Boolean, required: true}, //When true, the item is for men
    //When Both Male and Female are true, the item is unisex
    enabled : {type: Boolean, default: true}
}, {timestamps: true})

const Items = mongoose.model('Item', ItemSchema)


module.exports = {Items}