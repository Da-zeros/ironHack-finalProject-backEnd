const { json } = require('body-parser')
const { find } = require('../models/User.model')
const User = require('../models/User.model')
const Activity = require ('../models/activity.model');


async function activities(req, res){
    
    try {
        const actResponse = await User.find()
        if(actResponse)res.json(actResponse)
    } catch (err) {
        res.json(err)
    }
}

async function addActivity(req, res, next){

    const { _id } = req.payload
    const { activityId } = req.params
   
    try {
        const ownActivity = await Activity.find( { _id: activityId, user: _id, })
     
        if(ownActivity.length === 0){
            
            const duplicatedActivity =  await User.find( { activities: { $in: [ activityId ]}})
           
            if( duplicatedActivity.length !== 0 ){
                res.status(400).json({message: "Already exists this activity in your activityList"})
            }else{
                
                const filter = { _id: _id }
                const update = { $push: { activities: activityId }}

                const dbResponse = await User.findByIdAndUpdate( filter, update, { new:true })
                res.json(dbResponse)
            }   
        }
        else{
            res.status(400).json( { message: "you are trying to enroll in your activity" } )
        }
        
        
        
        

    } catch (err) {
        console.log(err)
        next(err)
    }
}

module.exports = {
    activities,
    addActivity
    
}