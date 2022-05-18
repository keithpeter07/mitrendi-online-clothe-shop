const activation_code_email_creator = require('../mailer/activation_code_email');
const {Users} = require('./models')
const email_sender = require('../mailer/mailerfunction')

/* This file contains all sign up functions as listed below
        email verification-code generator
        sign up data validator
        an asynchronous function for sending the activation email
*/




//Generate the email verification code

const gen_activation_code = (res) => {
    //Generating the activation code
    //The numbers part
    let number_list = ''

    for(let x = 0; x < 6; x++){
        let digit = Math.floor(Math.random() * 10).toString()

        number_list += digit
    }

    // //The alphabet part
    // let alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ' //letter O and I are not included, so as not to be confused with number 0 and 1 respectively
    // const letters = '' + alphabet[Math.floor(Math.random()*24)] + alphabet[Math.floor(Math.random()*24)]

    const activation_code = /*letters +*/ number_list //Activation code will only be four digits

    res.locals.user.activation_code = activation_code
}


//Validating sign up data

const validate_signup = (req,res,next) => {
    
    //First check if all required fields are sent by client
    if(req.body.email && req.body.firstname && req.body.lastname && req.body.password && req.body.phonenumber){

        Users.find({email: req.body.email})
            .then((results) => {
                if(results.length === 0){
                    res.locals.user = {firstname: req.body.firstname, email: req.body.email.toLowerCase()}

                    gen_activation_code(res) //generate the activation code and place it in res.locals.user as 'activation_code'
                    next() //proceeds to the next middleware or function
                }
                else{
                    res.sendStatus(409) //Send conflict status code since the email already exists
                    res.end()
                }
            })
            .catch((err) => {
                console.log(err) // Log the error to the console for debugging or reference
                res.sendStatus(500) //Send server error
            })
    }

    else{ //If one of the required parameters is not sent by the client
        res.sendStatus(400) //Send bad request status
    }
}



//Sending the email verification code

const send_activation_email = async (receiver_email, receiver_firstname, activation_code) => {

    return new Promise((resolve, reject) => {

        //get the email html
        const email_html = activation_code_email_creator(receiver_firstname, activation_code)


        //Sending the email
        email_sender(receiver_email, "[MITRENDI] Account Activation", email_html)

        resolve()
        })

}



module.exports = {validate_signup, send_activation_email}