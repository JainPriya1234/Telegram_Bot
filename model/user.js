const mongoose = require("mongoose")
const user  = new mongoose.Schema({
    name:{
        type: String,
        require:[true, "Name is required"]
    },
    chatId:{
        type:Number
    },
    city: {
        type: String
    },
    country:{
        type:String
    },
    isActive:{
        type:Boolean,
        default:true
    }
});

module.exports =  mongoose.model("user", user, "user");