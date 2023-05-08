const expenses= require('../models/expenses');
const users=require('../models/users');
const mongoose= require("mongoose")
const AWS= require('aws-sdk')
const dotenv= require('dotenv')
const { startSession } = require('mongoose')

dotenv.config();


exports.GetAllData= (async (req, res)=>{

    try
    {   
       let pageNo=req.query.page;
       let size= req.query.size;
      
       if(pageNo=='0')
       {
        pageNo+=1;
       }
       let limitPage= (pageNo-1)*4;
       
       const expenseData= await expenses
       .find({user_id:req.id})
       .populate('user_id','ispremium')
       .select('_id amount description category')
        console.log(expenseData)
        res.send(expenseData);

    }
    catch (err)
    {
        console.log(err);
    }
})


//================Insert Data in DB==========================

exports.insertData= (async (req, res)=>{
    const amount=req.body.amount;
    const description= req.body.description;
    const category= req.body.category;
    const userid= new mongoose.Types.ObjectId(req.id);
    const session= await startSession();

    try{

    
    
    session.startTransaction();

    const totalexpense= await users.findOne({_id: userid},null, {session})
    let totalExpense=totalexpense.TotalExpense;
    const newExpense= parseInt(totalExpense)+ parseInt(amount);
        console.log(newExpense)
    await expenses.create([{amount: amount, description:description, category: category, user_id: userid}],null, {session})
         await users.findOneAndUpdate({_id: userid},{TotalExpense: newExpense}, {session})
         await session.commitTransaction()
        res.send("Data Added Successfully")
        
        }


    catch(err){
        await session.abortTransaction()
        session.endSession()
        console.log(err)
        res.send('Error')
}
})


//==============================Delete Data================


exports.deleteData= (async (req, res)=>{
    const id= req.params.id
      
      const session1= await startSession();

      try
      {
        session1.startTransaction();
        const row = await expenses
    .findOne({_id:id})
    .populate("user_id", "TotalExpense")
    .select("amount")
       await expenses.deleteOne({_id: id}, {session1})
       
                const deleteAmount= row.user_id.TotalExpense;
                const updatedAmount= parseInt(deleteAmount)-parseInt(row.amount);
                console.log(deleteAmount);
                console.log(updatedAmount);
               await  users.updateOne({_id:row.user_id._id},{TotalExpense: updatedAmount}, {session1})
           
               await session1.commitTransaction() 
                res.send("Data Deleted");
      }
      catch(err){
        await session1.abortTransaction()
        session1.endSession()
        console.log(err)
      }
    
})



exports.updateData= (async (req, res)=>{
    const amount=req.body.amount;
    const description= req.body.description;
    const category= req.body.category;
    const productid=req.body.productid;
    const newValue= req.body.nwValue;

    try
    {   
        await expenses.findOneAndUpdate({_id: productid} , {amount: amount, description:description, category: category})
        const newData=await expenses
        .findOne({_id:productid})
        .populate("user_id", "TotalExpense")
        const updatedExpense= parseInt(newData.user_id.TotalExpense)+ parseInt (newValue)
        await users.findOneAndUpdate({_id:newData.user_id._id}, {TotalExpense:updatedExpense})
        res.send("Data Updated")
    }
    catch (err)
    {
        console.log(err);
    }
})

function uploadToS3(data, filename)
{
    let s3bckt= new AWS.S3({
        accessKeyId: process.env.IAM_USER_KEY,
        secretAccessKey: process.env.IAM_USER_SECRET,
       
    })
    
        var params={
            Bucket: process.env.BUCKET_NAME,
            Key: filename,
            Body: data,
            ACL: 'public-read'

        }
        return new Promise((resolve, reject)=>
        {

        
        s3bckt.upload(params, (err, data)=>{
            if(err){
                console.log("Something wrong")
                reject ("Something Went Wrong");
            }
            else{
                console.log("success", data);
                resolve (data.Location);
            }
        })
    })
    
}

exports.downloadExpenseData= (async(req, res)=>{
    try
    {
        
    const expenseData= await expenses
    .find({user_id:req.id})
    .select( 'amount', 'description', 'category')
      

const stringfied= JSON.stringify(expenseData);
const userID= req.id;
const filename=`Expense${userID}/${new Date()}.txt`;
const getURL= await uploadToS3(stringfied, filename);
res.status(200).json({getURL, success: true})
}  

catch(err)
{
    res.status(500).json({getURL:'', Success: false, err:err});
}
})