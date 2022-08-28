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
    console.log("filter",filterType, "filterWord", filterWord, "filterData", filterDate)

    try{

        let dbResponse = ""

        if( filterType !== undefined )
        {
            dbResponse = await Activity.find({ type: filterType})
            return res.json(dbResponse)
        }
        else if( filterWord !== undefined ) 
        {
            dbResponse = await Activity.find()
            
            let filterList = dbResponse.filter(activity => activity.title.toLowerCase() 
            .includes(filterWord.toLowerCase()))
            
            if ( filterList.length == 0 ){
                return res.status(404).json({message:"No match found"})
            }
            return res.json(filterList)
                
        }
        else if( filterDate !== undefined ) 
        {
    
            dbResponse = await Activity.find({data:filterDate})

            if ( dbResponse.length == 0 ){
                return res.status(404).json({message:"No match found"})
            }

            return res.json( dbResponse )
        }
       
    }
    catch(err){
        console.log(err)
    }
}

async function allActivities(req, res){

    try {
        const dbResponse = await Activity.find().sort({createdAt:-1}).limit(4);
        return res.json(dbResponse )
    } catch (error) {
        
    }
    console.log("Entra en allActivities")
} 

async function addComment(req, res){
    console.log(req.body)
    const { comment } = req.body
    const { delActivityId } = req.body

    const filter = { _id: delActivityId }
    const update = { $push: { comment: comment }}

    const dbResponse = await Activity.findByIdAndUpdate( filter, update, { new:true })
    res.json(dbResponse)

}


async function getComment (req, res){
    try {
        const dbResponse = await Activity.find({comment:{$exists: true}}).populate('user').limit(4);
        return res.json(dbResponse )
    } catch (error) {
        
    }
    console.log("Entra en allActivities")
}


module.exports = {
    addActivity,
    type,
    filteredActivity,
    allActivities,
    addComment,
    getComment
}