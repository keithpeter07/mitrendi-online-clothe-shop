const Express = require('express')
const { authenticate_superuser } = require('../../authenticator/middlewares')
const { Users } = require('../../authenticator/models')



const router = Express.Router()


//Users cannot be add by a superuser directly, they need to create an account

//--------------------FETCHING---------------------
router.get('/getUsers', authenticate_superuser, (req, res) => {
    Users.find()
        .then((results) => {
            res.send(results)
        })
        .catch((err) => {
            res.send(err)
            console.log(err)
        })
})





//--------------------UPDATING---------------------
router.post('/updateUser', authenticate_superuser, (req,res) => {
    Users.findOneAndUpdate(req.body.filter, req.body.update)
        .then((results) => {
            res.sendStatus(201)
        })
        .catch((err) => {
            res.send(err)
            console.log(err)
        })
})




//--------------------DELETING---------------------
router.post('/deleteUser', authenticate_superuser, (req,res) => {
    Users.findOneAndDelete({_id : req.body._id})
        .then((results) => {
            res.sendStatus(201)
        })
        .catch((err) => {
            res.send(err)
            console.log(err)
        })
})






module.exports = {super_user_management_router : router}
