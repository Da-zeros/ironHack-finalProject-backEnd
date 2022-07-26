const cloudinary = require("cloudinary").v2
require("dotenv").config()

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_APYKEY,
    api_secret: process.env.CLOUDINARY_APISECRET
  });

/*cloudinary.v2.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
    { public_id: "olympic_flag" }, 
    function(error, result) {console.log(result); });*/

module.exports = cloudinary