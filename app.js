const express= require('express');
const cors=require('cors')
const bodyParser= require('body-parser')
const routes= require('./routes/routes')
const path= require('path')
const cookieParser= require('cookie-parser')
const compression= require('compression')
const morgan= require("morgan")
const fs= require('fs');
const dotenv= require('dotenv');
const connectDb= require("./util/database")
const accessLogStream= fs.createWriteStream(path.join(__dirname, 'access.log'), {flags:'a'});

const app=express();
dotenv.config({path:'.env'});
app.use(cookieParser());
app.use(compression());
app.use(morgan('combined', {stream: accessLogStream }))

app.use(cors());
app.use(express.static(__dirname+"/public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))


connectDb();
app.use("/", routes);

app.listen((process.env.PORT || 3000), (req, res)=>{
    console.log("Server Started");
});