const Express = require('express')
const {PendingOrders, Orders} = require('./models')
const {Items} = require('../shop/models')
const {Users} = require('../authenticator/models')
const {getAPIAccess, getTotalPrice, push_STK} = require('./mpesa_payment/middlewares')
const {authenticate} = require('../authenticator/middlewares')
const res = require('express/lib/response')
const {addLastUsedMPESANumber, updateUserData, sendOrderEmail, updateItemData} = require('./orderFunctions')
const ObjectId = require('mongodb').ObjectId

const io = require('socket.io')(9091, {cors : {origin: ['http://localhost:3000']}})



const router = Express.Router()






//This route checks whether the item to be bought is still available (Especially items placed in the cart a while ago)
router.post('/isAvailable', (req,res) => {
    
    //creates a list of IDs of type ObjectId
    let IDs = req.body.itemIDs.map(idString => new ObjectId(idString))

    //Fetches all items with ids in the IDs list
    Items.find({_id: {$in: IDs}, enabled: true})
        .then((results) => {
            res.status(200).send(results.map(item => item._id)) // returns the list of available item ids to the frontend to compare with the cart items
            res.end()
        })
        .catch((err) => {
            console.log(err)
            res.send(err)
        })
})


//This route adds a pending order (One that is yet to be paid for)
//This route also calls all necessary middleware functions to execute the STK push process

router.post('/addPendingOrder', [authenticate, getAPIAccess, getTotalPrice, push_STK], (req,res) => {

    addLastUsedMPESANumber(res.locals.user._id,req.body.MPESA_phonenumber)

    const updateOrderdItems = (id_list) => { //This function updates all the orderd items to NOT enabled (They are therefore no longer shown on the shop list)
        return new Promise((resolve, reject) => {
            id_list.forEach(id => {
                Items.findOneAndUpdate({_id: id}, {enabled: false})
                    .catch((err) => console.log(err))
            })
            resolve()
        })
    }
    

    const pending_order = new PendingOrders({
        owner_id : res.locals.user._id,
        owner_name : res.locals.user.firstname + ' ' + res.locals.user.lastname,
        owner_phonenumber : res.locals.user.phonenumber,
        item_id_array : req.body.item_id_array,
        item_name_array : req.body.item_name_array,
        amount_to_be_paid : req.body.amount_to_be_paid,
        pickup_area: req.body.pickup_area,
        pickup_location: req.body.pickup_location,
        pickup_note: req.body.pickup_note,
        MerchantRequestID: res.locals.body.MerchantRequestID,
        CheckoutRequestID: res.locals.body.CheckoutRequestID
    })



    pending_order.save()
        .then((results) => {
            updateOrderdItems(results.item_id_array)
            res.status(200).send(res.locals.body)
            res.end()
        })
        .catch((err) => {
            console.log(err)
            res.sendStatus(500)
        })
})









router.get('/STK_pushed', (req,res) => { //called by safaricom after the transaction is complete


    const findReceiptNumber = () => {
        let MpesaReceiptNumber = ''
        req.body.stkCallback.CallbackMetadata.Item.forEach(item => {if(item.Name === "MpesaReceiptNumber"){MpesaReceiptNumber = item.Value}})
        
        return MpesaReceiptNumber
    }

    if(req.body.stkCallback.ResultCode === 0 || req.body.stkCallback.ResultCode === '0'){
        
        //Fetched the pending order using the unique MerchantRequestID
        PendingOrders.find({MerchantRequestID: req.body.stkCallback.MerchantRequestID})
        .then((results) => {
            const thisPendingOrder = results[0]

            //Initializes the new order
            const order = new Orders({
                owner_id: thisPendingOrder.owner_id,
                owner_name: thisPendingOrder.owner_name,
                owner_phonenumber: thisPendingOrder.owner_phonenumber,
                item_name_array: thisPendingOrder.item_name_array,
                item_id_array: thisPendingOrder.item_id_array,
                amount_paid: thisPendingOrder.amount_to_be_paid,
                pickup_area: thisPendingOrder.pickup_area,
                pickup_location: thisPendingOrder.pickup_location,
                pickup_note: thisPendingOrder.pickup_note,
                MerchantRequestID: thisPendingOrder.MerchantRequestID,
                CheckoutRequestID: thisPendingOrder.CheckoutRequestID,
                MpesaReceiptNumber: findReceiptNumber()
            })

            order.save()
                .then((results) => {
                    //respond to the client with a 200 status code after successfully saving the order
                    res.sendStatus(200)
                    res.end()

                    updateUserData(results)
                    sendOrderEmail(results)
                    updateItemData(results.item_id_array)

                    io.emit('Recieved-Payment', thisPendingOrder.MerchantRequestID)


                    //Delete the record in the Pending Orders collection
                    PendingOrders.findOneAndDelete({MerchantRequestID: req.body.MerchantRequestID})
                        .then(() => (console.log("PENDING ORDER DELETED")))
                        .catch((err) => {
                            console.log(err)
                        })
                })
                .catch((err) => {
                    console.log(err)
                    res.sendStatus(400)
                    res.end()
                })
        })
        .catch((err) => {
            console.log(err)
            res.sendStatus(400)
            res.end()
        })
    }     
})




router.get('/myOrders', authenticate, (req,res) => {
    Orders.find({owner_id : res.locals.user._id.toString()})
        .then((results) => {
            res.send(results)
        })
        .catch((err) => {
            res.status(500).send(err)
            console.log(err)
        })
})




module.exports = {order_router : router}