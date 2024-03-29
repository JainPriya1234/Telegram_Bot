const mongoose = require("mongoose")
const user  = new mongoose.Schema({
    name:{
        type: String,
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
        type:Boolean
    }
});

module.exports =  mongoose.model("user", user, "user");