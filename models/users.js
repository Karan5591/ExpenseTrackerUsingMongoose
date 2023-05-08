const mongoose= require("mongoose");
const db= require("../util/database")
const usersSchema= mongoose.Schema({
    
    name:{
        type: String,
        
    },
    email:{
        type: String,
        
    },
    password:{
        type: String,
       
    },
    ispremium:{
        type: String,
       
    },
    TotalExpense:{
        type: Number
    }
 
 });
 
 //const dbModel= db.model("users", usersSchema) ;
module.exports= mongoose.model("users", usersSchema) ;
 


