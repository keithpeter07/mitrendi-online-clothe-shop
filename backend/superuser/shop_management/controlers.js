const Express = require('express')
const { authenticate_superuser } = require('../../authenticator/middlewares')
const { Items } = require('../../shop/models')
const multer = require('multer')


const router = Express.Router()

//File storage for images of items
const fileStorage = multer.diskStorage({ //initialises multer file storage
    destination: (req, file, cb) => { //the file destination
        cb(null, 'uploads/itemImages')
    },
    filename: (req, file, cb) => { //file naming 
        const randomNum = Math.floor(((Math.random() * 9998) + 1).toString().padStart(4, '0'))
        const uniqueValue = Date.now().toString() + randomNum + '.jpg'
        cb(null, uniqueValue)
    }
})


const fileFilter = (req, file, cb) => { //filters the uploaded files
    if(['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype)){
        cb(null, true)
    }
    else{
        cb(new Error('invalid file type - '+ file.mimetype))
    }
}



//--------------------ADDING---------------------
router.post('/addItem', authenticate_superuser, (req,res) => {
    
    multer({storage: fileStorage, fileFilter}).any()(req,res, (err) => {
        if(err){
            console.log(err)
            res.status(400).json(err)
        }
        else{
            const item = new Items({
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                bp: req.body.bp,
                size: req.body.size,
                category: req.body.category,
                male: req.body.male,
                female: req.body.female,
                keywords: req.body.keywords,
                image1: req.files[0].filename,
                image2: req.files[1].filename
            })

            item.save()
                .then((results) => {
                    res.sendStatus(201)
                })
                .catch((err) => {
                    console.log(err)
                    res.status(500).send(err)
                })
        }
    })
})



//--------------------FETCHING---------------------
router.get('/items', authenticate_superuser, (req,res) => {
    Items.find()
        .then((results) => {
            res.send(results)
        })
        .catch((err) => {
            res.status(500).send(err)
            console.log(err)
        })
})




//--------------------UPDATING---------------------
router.post('/updateItem', authenticate_superuser, (req,res) => {
    
    Items.findOneAndUpdate({_id: req.body._id}, req.body.update)
        .then((results) => {
            res.sendStatus(201)
        })
        .catch((err) => {
            res.send(err)
            console.log(err)
        })
})







//--------------------DELETING---------------------
router.post('/deleteItem', authenticate_superuser, (req,res) => {
    Items.findOneAndDelete({_id : req.body._id})
        .then((results) => {
            res.sendStatus(201)
        })
        .catch((err) => {
            res.send(err)
            console.log(err)
        })
})




module.exports = {super_shop_management_router : router}




