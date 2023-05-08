const mongoose= require("mongoose")
const db= require("../util/database")
const userDb= require("../models/users")
const forgetPasswordSchema= mongoose.Schema({
    uuid:{
        type:String,
        
    },
    user_id:{
        type: mongoose.Schema.ObjectId,
        require: true,
        
    }, 

    isactive:{
        type: String,
        
    },
    
 
 });
 module.exports= mongoose.model("forgetPassword", forgetPasswordSchema) ;

 


