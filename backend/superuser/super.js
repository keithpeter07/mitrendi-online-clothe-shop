const Express = require('express')
const { Superusers } = require('../authenticator/models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()


const router = Express.Router()


router.post('/superlogin', (req,res) => {
    Superusers.find({username: req.body.username})
        .then((results) => {
            if(results.length > 0){
                const authed = bcrypt.compareSync(req.body.password, results[0].password)

                if(authed){
                    
                    res.sendStatus(200)
                    res.end()

                }

                else{
                    res.sendStatus(403)
                }
            }
            else{
                res.sendStatus(404)
            }
        })
        .catch((err) => {
            console.log(err)
            res.sendStatus(500)
        })
})



router.get('/superlogout', (req,res) => {
    Superusers.findOneAndUpdate({username : req.headers.username}, {token : null})
        .then((results) => {
            res.sendStatus(200)
        })
        .catch((err) => {
            console.log(err)
            res.sendStatus(500)
        })
})




router.post('/findaccess', (req,res) => {

    
    Superusers.find({username: req.body.username})
        .then((results) => {
            if(results.length > 0){
                if(bcrypt.compareSync(req.body.pin, results[0].pin)){

                    const token = jwt.sign({_id : results[0]._id, username : results[0].username}, process.env.SUPER_SECRET)

                    Superusers.findOneAndUpdate({_id : results[0]._id}, {token : token})
                        .then((ures) => {res.status(200).json({access_token : token, username: ures.username})})
                        .catch((err) => {console.log(err)})

                }
                else{
                    res.sendStatus(403)
                    res.end()
                }
            }
            else{
                res.sendStatus(404)
            }
        })
        .catch((err) => {
            console.log(err)
            res.status(500).send(err)
        })
})








module.exports = {super_router : router}




