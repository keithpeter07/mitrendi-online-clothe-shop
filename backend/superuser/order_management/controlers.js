const Express = require('express');
const { authenticate, authenticate_superuser } = require('../../authenticator/middlewares')
const { Orders } = require('../../orders/models')
const { Items } = require('../../shop/models')
const ObjectId = require('mongodb').ObjectId


const router = Express.Router()

//The superuser cannot add an order (Requires payment)

//--------------------FETCHING---------------------
router.get('/getOrders', authenticate_superuser, (req,res) => {
    Orders.find()
        .then((results) => {
            res.status(200).send(results)
        })
        .catch((err) => {
            res.send(err)
            console.log(err)
        })
})


//Changin Item State
const sellItem = (id_list) => {

    
    return new Promise((resolve) => {
        Items.findOneAndUpdate({_id : {$in : id_list}}, {sold : true})
            .then((res) => {
                resolve()
            })
    })
}

//--------------------UPDATING---------------------
router.post('/dispatchOrder', authenticate_superuser, (req,res) => { //Sets order to dispatched, after the staff pack it for shipping

    
    let IDs = req.body.item_id_array.map(ID => new ObjectId(ID))
    sellItem(IDs)

    Orders.findOneAndUpdate({_id: req.body._id}, {dispatched: true})
        .then((results) => {
            res.sendStatus(201)
            res.end()
        })
        .catch((err) => {
            console.log(err)
            res.status(500).send(err)
            res.end()
        })
})

router.post('/updateOrder', authenticate_superuser, (req,res) => { //Updates order details
    Orders.findOneAndUpdate(req.body.filter, req.body.update)
        .then((results) => {
            res.sendStatus(201)
        })
        .catch((err) => {
            res.send(err)
            console.log(err)
        })
})






//--------------------DELETING---------------------
router.post('/deleteOrder', authenticate_superuser, (req,res) => {
    Orders.findOneAndDelete({_id : req.body._id})
        .then((results) => {
            res.sendStatus(201)
        })
        .catch((err) => {
            res.send(err)
            console.log(err)
        })
})







module.exports = {super_order_management_router : router}

