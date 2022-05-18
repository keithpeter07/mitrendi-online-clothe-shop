const {Users, Superusers} = require('./models')
const activation_code_email_creator = require('../mailer/activation_code_email')
const email_sender = require('../mailer/mailerfunction')
const jwt = require('jsonwebtoken')

require('dotenv').config()


const authenticate = (req,res,next) => {
    
    
    //A function to check if user is authenticated and places the user data in res.locals

    
    if(req.headers.access_token !== null){
        

        //verify the token with jwt
        try{
            const access_token = req.headers.access_token //get the access token from the request cookie
            const data_from_token = jwt.verify(access_token, process.env.ACCESS_SECRET)
        
    
            Users.find({_id : data_from_token._id, email : data_from_token.email})
                .then((results) => {
                    if(results.length > 0){
                        res.locals.user = results[0]
                        

                        next()
                    }
                    else{
                        res.sendStatus(403)
                        res.end()
                    }
                })
                .catch((err) => {
                    console.log(err)
                    res.sendStatus(500)
                    res.end()
                })  


        }catch{
            res.sendStatus(403)
            res.end()
        } 
    }

    else{ //If the request does not have an access token
        res.sendStatus(403)
        res.end()
    }
}



const authenticate_superuser = (req,res,next) => {

    Superusers.find({username : req.headers.username, token : req.headers.access_token})
        .then((results) => {
            if(results.length > 0){
                next()
            }
            else{
                res.sendStatus(403)
            }
        })
        .catch((err) => {
            res.sendStatus(500)
        })
    

}




//This should check for email confirmation during login
const check_account_activation = (req,res,next) => {
    Users.find({email : req.body.email})
        .then((results) => {
            if(results.length > 0){
                if(!results[0].account_active){ // If the email was not confirmed it puts it in locals
                    res.locals.account_activated = false
                    next()
                }
                else{
                    res.locals.account_activated = true
                    next() //If email is confirmed it is proceeded to the next middleware or function
                }
            }
            else{ //if the account does not exist
                res.sendStatus(404)
                res.end()
            }
        })
        .catch((err) => {
            console.log(err)
            res.sendStatus(500)
            res.end()
        })
}



module.exports = {authenticate, authenticate_superuser, check_account_activation}