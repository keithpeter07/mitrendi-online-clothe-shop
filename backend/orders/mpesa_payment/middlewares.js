const {Items} = require('../../shop/models')
const {PendingOrders, Orders} = require('../models')
const request = require('request')
const ObjectId = require('mongodb').ObjectId

require('dotenv').config()

const areaPrices = [100, 180, 200] // These is a list of area prices as of 2022 - It is for NairoiCBD, Nairobi Metropolitan and Other Counties respectively



/* This file contains the middlewares to be used in the M-Pesa payment process

    The middleware functions are as listed
        getTimestamp - To get the timestamp used in the payment request
        getAPIaccess - To get the access token for the Daraja API
        getTotalPrice - To get the total price to be paid (It compares it to the one sent by the frontend just to be sure)
        getTotalPriceForRepay - To get the total price if the first payment process failed
        push_STK - This executes the STK push to prompt the user to enter their MPESA pin number

*/




const getTimestamp = () => { //Simply gets the current timestamp
    const date = new Date()
    const timestamp = date.getFullYear().toString() + (('0' + ((date.getMonth() + 1).toString())).slice(-2)) + (('0' + (date.getDate().toString())).slice(-2)) + (('0' + (date.getHours().toString())).slice(-2)) + (('0' + (date.getMinutes().toString())).slice(-2)) + (('0' + (date.getSeconds().toString())).slice(-2))
    return timestamp
}


const getAPIAccess = (req,res,next) => { //Gets the API access token

    //The endpoint from which the access token is fetched
    const endpoint = process.env.SAF_ACCESS_TK_ENDPOINT

    //The public key to be used
    const auth = 'Basic ' + process.env.SAF_AUTH

    request({
        url : endpoint,
        method : 'GET',
        headers : {
            "Authorization" : auth
        }
        },
        (err, resp, body) => {
            
            if(err){
                console.log(err)
                res.sendStatus(400)
            }
            else{
                try{
                    res.locals.API_access_token = JSON.parse(body).access_token //Places the access token in res.locals - This will be used by the next middlewares
                    next()
                }catch{
                    res.sendStatus(596)//MPESA error
                    res.end()
                }
            }
        }
    )
}





const getTotalPrice = async (req,res,next) => { //This gets the total price to be paid
    const id_list = req.body.item_id_array.map((item_id) => new ObjectId(item_id)) //maps the id list to a new list of type ObjectId ids

    const itemList = await Items.find({_id: {$in : id_list}}) //awaits the async function to fetch all the items in the list and places them in the Item List variable

    var TotalPrice = 0 //initalizes total price to zero(0)

    itemList.map(item => TotalPrice += item.price) //Loops over item list and adds every item price to the total price


    //Checks the pick up area and adds the respective price to the total price
    if(req.body.pickup_area === 'NAIROBI CBD'){
        TotalPrice += areaPrices[0]
    }
    else if(req.body.pickup_area === 'NAIROBI'){
        TotalPrice += areaPrices[1]
    }
    else{
        TotalPrice += areaPrices[2]
    }



    //compares the total price found to the one sent my the client
    //the frontend could be modified and therefore this function will get the price for all items in the list appropriately

    if((TotalPrice === req.body.amount_to_be_paid) || (TotalPrice !== req.body.amount_to_be_paid && typeof(TotalPrice) === 'number')){
        res.locals.amount_to_be_paid = TotalPrice //prioritizes the one found, even if it does not match with the one sent
    }
    else if(TotalPrice !== req.body.amount_to_be_paid && typeof(TotalPrice) !== 'number'){
        res.locals.amount_to_be_paid = req.body.amount_to_be_paid //if the total found is not a number then the one sent is used
    }
    else{
        res.locals.amount_to_be_paid = 'NaN' //Least possible case - Would simply create errors in the transaction, hence it wouldn't go through
    }

    next()
}





//This function gets the total price of a pending order if it wasn't paid for on the first go
const getTotalPriceForRepay = (req,res,next) => {
    PendingOrders.find({_id: req.body._id}) //Fetches the price directly from the database
        .then((results) => {
            if(results.length > 0){
                res.locals.amount_to_be_paid = results[0].amount
                next()
            }
            else{
                res.status(404).end()
            }
        })
        .catch((err) => {
            console.log(err)
            res.status(500).end()
        })
}






const push_STK = (req,res,next) => { //Executes the STK push - Should be the last middleware in the payment route list of middlewares
    
    const endpoint = process.env.SAF_STK_PUSH_ENDPOINT //The endpoint to send the STK push request
    const timestamp = getTimestamp() //gets the timestamp
    const auth = 'Bearer ' + res.locals.API_access_token //initializes the auth token that was fetched earlier
    const pass = new Buffer.from(process.env.SAF_SHORT_CODE + process.env.SAF_PASSKEY + timestamp).toString('base64') //Creates a pass from the shortcode, passkey and timestamp

    //sends the request
    request({
        url : endpoint,
        method : 'POST',
        headers : {
            'Content-Type': 'application/json',
            'Authorization': auth
        },
        json : {
            "BusinessShortCode": process.env.SAF_SHORT_CODE, //The business short code
            "Password": pass, //The pass generated above
            "Timestamp": timestamp, //The timestamp generated above
            "TransactionType": "CustomerBuyGoodsOnline", //The transaction type
            "Amount": res.locals.amount_to_be_paid, //The amount found by the previous function
            "PartyA": req.body.MPESA_phonenumber, //The MPESA phone number receiving the STK push (Where the payment is done)
            "PartyB": process.env.SAF_TILL_NUMBER, //The business short code (Where the payment is received)
            "PhoneNumber": req.body.MPESA_phonenumber, //The MPESA phone number making the payment (12 digits, +254)
            "CallBackURL": "https://mydomain.com/path", //The callback, what MPESA calls with the results of the transaction
            "AccountReference": "MITRENDI WARDROBE",
            "TransactionDesc": `payment of ksh ${res.locals.amount_to_be_paid} by ${res.locals.user._id} - ${res.locals.user.firstname} ${res.locals.user.lastname}` //The description of the transaction
        }
    },
        (err, resp, body) => {
            if(err){
                console.log(err)
                res.send(err)
                res.end()
            }
            else{
                res.locals.body = body
                if(body.errorMessage){
                    res.send({error: {errorMessage: body.errorMessage, errorCode: body.errorCode}})
                }
                else{
                    next()
                }
            }
        })
}







module.exports = {getAPIAccess, getTotalPrice, getTotalPriceForRepay, push_STK}