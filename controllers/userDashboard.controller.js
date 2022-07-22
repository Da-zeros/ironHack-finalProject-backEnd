const User = require('../models/User.model')


async function activities(req, res){
    
    try {
        const actResponse = await User.find()
        if(actResponse)res.json(actResponse)
    } catch (err) {
        res.json(err)
    }
}

module.exports = {
    activities
    
}