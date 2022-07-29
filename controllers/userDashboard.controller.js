const { json } = require('body-parser')
const { find } = require('../models/User.model')
const User = require('../models/User.model')
const Activity = require ('../models/activity.model');

/*
async function activities(req, res){
    
    try {
        const actResponse = await User.find()
        if(actResponse)res.json(actResponse)
    } catch (err) {
        res.json(err)
    }
}*/

async function usrEnrolledActivities(req, res, next){
   
    const { _id } = req.payload

    try {
        const dbResponse = await User.findById(_id).populate('activities')
        res.json(dbResponse)

    } catch (err) {
        
        console.log(err)
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

async function desEnrolActivity (req, res){ 
    
    const { delId } = req.params
    const { _id } = req.payload
    
    try {
        const filter =  {_id:_id}
        const update =  { $pull: { activities: delId } }
        const act = await User.findOneAndUpdate ( filter, update, { new: true })
        console.log(act)
        return res.status(200).json({ success: true, act });
    } catch (error) {
        return res.status(500).json({ success: false, error: error })
    }
}

module.exports = {
    //activities,
    addActivity,
    usrEnrolledActivities, 
    desEnrolActivity
    
}