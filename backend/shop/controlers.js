const Express = require('express')
const router = Express.Router()
const {Items} = require('./models')
const { authenticate } = require('../authenticator/middlewares')


router.get('/items', (req,res) => {
    Items.find({enabled: true})
        .then((results) => {
            res.status(200).send(results)
        })
        .catch((err) => {
            console.log(err)
            res.sendStatus(500) //Sends a server error
        })
})

router.get('/item/:id', (req,res) => {
    const id = req.params.id
    Items.find({_id: id,enabled: true})
        .then((results) => {
            if(results.length > 0){
                res.status(200).send(results[0])//Sends the first result on the list (Probably the only result)
            }
            else{
                res.sendStatus(400)//Sends NOT FOUND error if results are of length 0
            }
        })
        .catch((err) => {
            console.log(err)
            res.sendStatus(500)//Sends a server error
        })
})




module.exports = {shop_router: router}