const mongoose= require("mongoose")
const db= require("../util/database")
 const PremiumUserSchema= mongoose.Schema({
    
    payment_id:{
        type:String,
    },

    orderid:{
        type: String,
        
    },
    status:{
        type: String,
        
    },
    ispremium:{
        type: String, 
       
    }
 
 });
 module.exports= mongoose.model("PremiumUser", PremiumUserSchema) ;
