const mongoose = require('mongoose')
const Schema = mongoose.Schema


//Model for orders not paid for yet

const PendingOrdersSchema = new Schema({
    owner_id : {type: String, required: true},
    owner_name : {type: String, required: true},
    owner_phonenumber : {type: String, required: true},
    item_id_array : {type: Array, required: true},
    item_name_array : {type: Array, required: true},
    amount_to_be_paid : {type: Number, required: true},
    pickup_area : {type: String, required: true},
    pickup_location : {type: String, required: true},
    pickup_note : {type: String, required: false},
    MerchantRequestID : {type: String, required: false},
    CheckoutRequestID : {type: String, required: false}
}, {timestamps: true})

//Model for paid orders
//NOTE: Orders are inserted by the 'payment' application but read by the 'orders' application

const OrdersSchema = new Schema({
    owner_id : {type: String, required: true},
    owner_name : {type: String, required: true},
    owner_phonenumber : {type: String, required: true},
    item_id_array : {type: Array, required: true},
    item_name_array : {type: Array, required: true},
    amount_paid : {type: Number, required: true},
    pickup_area : {type: String, required: true},
    pickup_location : {type: String, required: true},
    pickup_note : {type: String, required: false},
    dispatched : {type: Boolean, default: false},
    MerchantRequestID : {type: String, required: true},
    CheckoutRequestID : {type: String, required: true},
    MpesaReceiptNumber : {type: String, required: false}
}, {timestamps: true})


const PendingOrders = mongoose.model('PendingOrder', PendingOrdersSchema)
const Orders = mongoose.model('Order', OrdersSchema)

module.exports = {PendingOrders, Orders}