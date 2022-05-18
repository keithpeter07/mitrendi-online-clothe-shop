const Express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {Users} = require('./models')
const {authenticate, check_account_activation, authenticate_superuser} = require('./middlewares')
const {validate_signup, send_activation_email} = require('./signup_functions')
const email_sender = require('../mailer/mailerfunction')
const reset_pass_email_gen = require('../mailer/reset_pass_email')
require('dotenv').config()

const router = Express.Router()



//Creating a new user (Sign up)

router.post('/signup', validate_signup, async (req,res) => {

    const user = new Users({
        firstname : req.body.firstname.toUpperCase(),
        lastname : req.body.lastname.toUpperCase(),
        phonenumber : req.body.phonenumber,
        email : req.body.email.toLowerCase(),
        gender : req.body.gender,
        password : bcrypt.hashSync(req.body.password, 8), // hash the password
        activation_code : res.locals.user.activation_code
    })

    user.save()
        .then((results) => { //We then login the user

            send_activation_email(results.email, results.firstname, results.activation_code) //This is async


            res.status(201).json({email : results.email})
            res.end()
            //Now the user will be promted to confirm the email address by entering the verification code


            /*
            THE USER SHOULD BE LOGGED IN AFTER ACCOUNT ACTIVATION

            //generate an access_token
            const access_token = jwt.sign({_id : results._id, email: results.email}, process.env.ACCESS_SECRET)

            //send the access_token to the user
            res.status(201).json({access_token}) // The client side should save this access_token
            res.end()*/
        })
        .catch((err) => {
            console.log(err)
            res.sendStatus(501) //Status code for not implemented
        })
})


//Resend activation code -- Incase the user did not recieve

router.post('/resend_activation_code', (req,res) => {
    Users.find({email: req.body.email, account_active: false})
        .then((results) => {
            if(results.length > 0){//If the email exists
                send_activation_email(results[0].email, results[0].firstname, results[0].activation_code)
                res.sendStatus(200)
            }
            else{//if account does not exist
                res.sendStatus(404)
            }
        })
        .catch((err) => { //server error
            console.log(err)
            res.sendStatus(500)
        })
})


//Activating the new user's account

router.post('/activate_account', (req,res) => {

    Users.find({email: req.body.email}) //Fetch the users with that email address (should be 1 since email is a unique field)
        .then((results) => {
            if(results.length > 0){ //if an account with that email exists, then proceed

                if(results[0].activation_code === req.body.activation_code){ //Confirm that the activation codes match

                    //Activate the user
                    Users.findOneAndUpdate({_id : results[0]._id}, {account_active : true}) 
                        .then((user_data) => {
                            //Now log in the user

                            //Initialize user data
                            const user = {
                                firstname: user_data.firstname,
                                lastname: user_data.lastname,
                                MPESA_phonenumber: user_data.MPESA_phonenumber,
                                auth: true
                            }

                            //generate an access_token
                            const access_token = jwt.sign({_id : user_data._id, email: user_data.email}, process.env.ACCESS_SECRET)

                            //send the access_token to the user
                            res.status(201).json({access_token, user}) // The client side should save this access_token on a cookie
                            res.end()
                        })
                        .catch((err) => {
                            console.log(err)
                            res.sendStatus(500)
                        })
                }

                else{ //If the activation code does not match the one stored, return forbidden status
                    res.sendStatus(403)
                    res.end()
                }
            }

            else{ //If the account is not found, return not found status

                //This should not happen on a normal occassion as the user should have already signed up to get to this point
                //NOTE: The email is sent programatically from the frontend and not keyed in by the user
                res.sendStatus(404)
                res.end()
            }
        })

        .catch((err) => {
            console.log(err)
            res.sendStatus(500)
            res.end()
        })
})



//Login a user
router.post('/login', check_account_activation, (req,res) => {
    Users.find({email : req.body.email})
        .then((results) => {
            if(results.length > 0){
                if(bcrypt.compareSync(req.body.password, results[0].password)){

                    if(res.locals.account_activated){
                        const user = {
                            firstname: results[0].firstname,
                            lastname: results[0].lastname,
                            MPESA_phonenumber: results[0].MPESA_phonenumber,
                            auth: true
                        }
                        //Now log in the user

                        //generate an access_token
                        const access_token = jwt.sign({_id : results[0]._id, email: results[0].email}, process.env.ACCESS_SECRET)

                        //send the access_token to the user
                        res.status(200).json({access_token, user}) // The client side should save this access_token on a cookie
                        res.end()
                    }
                    else{
                        res.sendStatus(401)
                        res.end()
                    }
                }

                else{ //if the passwords dont match, send forbidden error 
                    res.sendStatus(403)
                    res.end()
                }
            }
            else{ //If the user does not exist
                res.sendStatus(404)
                res.end()
            }
        })
        .catch((err) => {
            console.log(err)
            res.sendStatus(500)
        })
})



// check if user is authenticated

router.get('/authenticate', authenticate, (req,res) => {
    res.status(200)
})

router.get('/authenticate_superuser', authenticate_superuser, (req,res) => {
    res.status(200)
})


//Fetch user data

router.get('/fetch_user', authenticate, (req,res) => {
    const data = {
        firstname : res.locals.user.firstname,
        lastname : res.locals.user.lastname,
        MPESA_phonenumber : res.locals.user.MPESA_phonenumber,
        auth : true
    }

    res.status(200).json(data)
})



router.post('/reset_password', (req,res) => {
    Users.find({email : req.body.email})
        .then((results) => {
            if(results.length > 0){
                const modify_tk = jwt.sign({_id : results[0]._id, email : results[0].email}, process.env.SECRET, {expiresIn: 1200})

                const email_html = reset_pass_email_gen(results[0].firstname, modify_tk)

                Users.findOneAndUpdate({email: req.body.email}, {modify_token : modify_tk})
                    .then(() => {
                        email_sender(results[0].email, '[MITRENDI] Change Password', email_html)
                        res.sendStatus(200)
                        res.end()
                    })
                    .catch((err) => {
                        console.log(err)
                        res.sendStatus(500)
                        res.end()
                    })
            }
            else{
                res.sendStatus(404)
                res.end()
            }
        })
})

router.post('/change_password', (req,res) => {

    try{
    
        const jwt_data = jwt.verify(req.headers.modify_token, process.env.SECRET)
        const new_pass = bcrypt.hashSync(req.body.password, 8)

        Users.findOneAndUpdate({_id : jwt_data._id, modify_token: req.headers.modify_token}, {password: new_pass, modify: false, modify_token: ''})
            .then((results) => {
                if(results == null){
                    res.sendStatus(400)
                    res.end()
                }
                else{res.sendStatus(200); res.end()}
            })
            .catch((err) => {res.sendStatus(500)})
    }catch{
        res.sendStatus(401)
        res.end()
    }
    
})





module.exports = {auth_router : router}


