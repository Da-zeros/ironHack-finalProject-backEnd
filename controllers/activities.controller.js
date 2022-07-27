const cloudinary = require ('../config/cloudinary')
const validator = require('validator');
const ActivityType = require ('../models/activityType.model')
const Activity = require ('../models/activity.model');
const { find } = require('../models/activityType.model');

async function type(req, res, next){

    try {

        const dbResponse = await ActivityType.find()
        res.json(dbResponse[0].type)

    } catch (err) {
        console.log(err)
        next(err)
    }
} 

async function addActivity(req, res, nex){
    
    const user = req.payload._id
    const { image } = req.body
    const { time, title, activityType, location, description, date, notes} = req.body.values
    
    const titleTolower = title.toLowerCase() 
    const locationTolower = location.toLowerCase()

    try {
        if( validator.isEmpty(title) || 
            validator.isEmpty(activityType) || 
            validator.isEmpty(location) || 
            validator.isEmpty(description) || 
            validator.isEmpty(date) ||
            validator.isEmpty(time))
            {
        return res
            .status(400)
            .json({ message: 'All fields are mandatory. '});
        }
        const uploadedImage = await cloudinary.uploader.upload( image ,
        { 
            upload_preset: 'unsigned',
            alllowed_formats : ['png', 'jpg', 'jpeg', 'svg', 'ico', 'jfif', 'webp']
        },)
        
            if(uploadedImage){
        
                const duplicatedAct = await Activity.findOne({$and:[{ user:user },{ title:titleTolower }]})
                
                if(duplicatedAct){
                    res.json({ message:" Already exists an activity with this title in your account"})
                }
                else
                {
                    const imgUrl = uploadedImage.public_id
                
                    const response = await Activity.create({

                    user: user,
                    title: titleTolower,
                    type: activityType,
                    location:locationTolower,
                    description: description,
                    data:date,
                    notes: notes,
                    file: imgUrl,
                })
                res.json(response)}
            }

    } catch (err) {
        console.log(err)
    }
}

async function filteredActivity(req, res, next){
    
    const { filterType, filterWord, filterDate} = req.query
    
    try{

        if( filterType !== undefined )
        {
            let dbResponse = await ActivityType.find({ type: { $in: filterType}})
        }
        else if( filterWord !== undefined ) 
        {
    
        }
        else if( filterDate !== undefined ) 
        {
    
        }
    }
    catch(err){
        console.log(err)
    }
   

}

module.exports = {
    addActivity,
    type,
    filteredActivity
}