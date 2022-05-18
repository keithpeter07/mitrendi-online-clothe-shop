const { Users } = require("../authenticator/models")
const { Items } = require("../shop/models")
const order_confirmation_email_creator = require('../mailer/order_confirmation_email')
const email_sender = require('../mailer/mailerfunction')


//Adds last used MPESA phonenumber
const addLastUsedMPESANumber = (id, MPESA_phonenumber) => {
    return new Promise(resolve => {
        Users.findOneAndUpdate({_id : id}, {MPESA_phonenumber : MPESA_phonenumber})
            .then((res) => {
                resolve()
            })
    })
}


//updates user data for amount spent and purchases made
const updateUserData = (order) => {
    
    
    return new Promise(async (resolve) => {
        const user_data = await Users.find({_id : order.owner_id})

        


        const initial_spent = user_data[0].spent
        const initial_purchases = user_data[0].purchases

        const new_spent = initial_spent + order.amount_paid
        const new_purchases = initial_purchases + order.item_id_array.length

        

        Users.findOneAndUpdate({_id : order.owner_id}, {spent : new_spent, purchases : new_purchases})
        .then((results) => {/*pass*/})
        .catch((err) => {console.log(err)})

        resolve()
            
    })
}


//send order email
const sendOrderEmail = (order) => {
    return new Promise( async (resolve) => {

        const user_data = await Users.find({_id: order.owner_id})


        const email_html = order_confirmation_email_creator(user_data[0].firstname, user_data[0]._id, order.item_name_array, order.pickup_area, order.pickup_location)

        email_sender(user_data[0].email, '[MITRENDI] Order Confirmation', email_html)

        resolve()

        
    })
}



//update Items
const updateItemData = id_list => {
    return new Promise(resolve => {
        id_list.forEach(id => {
            Items.findOneAndUpdate({_id: id}, {sold: true})
                .catch((err) => console.log(err))
        })
        resolve()
    })
}


module.exports = {addLastUsedMPESANumber, updateUserData, sendOrderEmail, updateItemData}