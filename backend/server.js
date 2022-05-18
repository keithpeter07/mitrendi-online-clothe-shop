const Express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors')

const { userManager, itemManager, itemClearer } = require('./manager/functions')

const {shop_router} = require('./shop/controlers')
const {auth_router} = require('./authenticator/controlers')
const {order_router} = require('./orders/controlers')
const {extra_router} = require('./extras/controlers')
const {super_shop_management_router} = require('./superuser/shop_management/controlers')
const {super_order_management_router} = require('./superuser/order_management/controlers')
const {super_user_management_router} = require('./superuser/user_management/controlers')
const {super_router} = require('./superuser/super')


require('dotenv').config()

const port = 9090
const app = Express()

const mongoURL = `mongodb+srv://mitrendiAdmin:${process.env.databasePassword}@mitrendi.t5mtk.mongodb.net/Mitrendi?retryWrites=true&w=majority`


//Database Connection
mongoose.connect(mongoURL, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => {
            app.listen(port)
            console.log("Listening on port : " + port)
        })
        .then(() => {
            userManager.start()
            itemManager.start()
            itemClearer.start()
            console.log("Jobs started")
        })
        .catch((err) => {
            console.log(err)
            console.log("Could not connect to database")
        })


//Setting res Headers
app.use((req,res,next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, content-type");
    res.setHeader("Access-Control-Allow-Credentials", true)

    next()
})



app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors({origin: 'http://localhost:3000'}))




app.use('/api/shop', shop_router)
app.use('/api/auth', auth_router)
app.use('/api/order', order_router)
app.use('/api/extras', extra_router)


app.use('/api/super/shop', super_shop_management_router)
app.use('/api/super/order', super_order_management_router)
app.use('/api/super/user', super_user_management_router)
app.use('/api/super/auth', super_router)



app.use(Express.static(__dirname + '/uploads'))


