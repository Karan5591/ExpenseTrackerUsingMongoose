const mongoose= require("mongoose")
const dotenv= require("dotenv")
dotenv.config()
const connectDb= async ()=>{
    try{
        const conn= mongoose.connect(process.env.URL)
        console.log("DB connected")
    }
    catch(err)
    {
        console.log(err);
    }
}
module.exports= connectDb;





