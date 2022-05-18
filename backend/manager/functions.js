const CronJob = require('cron').CronJob
const {Users} = require('../authenticator/models')
const {Items} = require('../shop/models')
const fs = require('fs')



const userManager = new CronJob('0 */12 * * *', ()=>{
    
    Users.find({account_active: false})
        .then((results) => {
            results.forEach(user => {
                const now = Date.now()
                const createdAt = user.createdAt.getTime()

                if((now-createdAt) > (1000*3600*24)){
                    Users.findByIdAndDelete(user._id)
                }
            })
        })
})



const itemManager = new CronJob('0 * * * *', () => {
    
    Items.find({enabled : false, sold : false})
        .then((results) => {
            results.forEach(item => {
                const updatedAt = item.updatedAt.getTime()
                const now = Date.now()

                if((now-updatedAt) > (1000*3600*1)){
                    Items.findOneAndUpdate({_id:item._id}, {enabled:true})                
                }
            })
        })
})



const itemClearer = new CronJob('0 6 * * 0', () => {
    console.log('Start')
    Items.find({main : true})
        .then((results) => {
            results.forEach(item => {
                const now = Date.now()
                const updatedAt = item.updatedAt.getTime()

                if((now-updatedAt) > (1000*3600*24*7)){
                    try{
                        fs.unlinkSync('../backend/uploads/itemImages' +  item.image1)
                        fs.unlinkSync('../backend/uploads/itemImages' + item.image2)
                    }catch(err){
                        console.log(err)
                        //pass
                    }

                    Items.findOneAndDelete({_id : item._id})
                    
                }
            })
        })
})










module.exports = { userManager, itemManager, itemClearer }