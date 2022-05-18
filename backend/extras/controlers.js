const Express = require('express')

const router = Express.Router()



router.get('/toc', (req,res) => {
    res.sendFile(__dirname+'/TOC.html')
})


router.get('/returnpolicy', (req,res) => {
    res.sendFile(__dirname+'/returnPolicy.html')
})


router.get('/returnprocess', (req,res) => {
    res.sendFile(__dirname + '/returnProcess.html')
})




module.exports = { extra_router : router }