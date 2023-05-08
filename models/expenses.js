// const sequelize = require("../util/database");

 const mongoose= require("mongoose");
 const db= require("../util/database")
 const usersDb= require("../models/users")
 const expensesSchema= new mongoose.Schema({
    productid:{
        type: Number,
        
    },
    amount:{
        type: Number,
        
    },
    category:{
        type: String
    },
    description:{
        type: String
    },
    user_id:{
        type:mongoose.Types.ObjectId,
        ref: usersDb,
        require: true
        
    }, 
    createdAt:
    {
        type: Date,
        default: Date.now
    }


 
 });
 module.exports= mongoose.model("expenses", expensesSchema);

