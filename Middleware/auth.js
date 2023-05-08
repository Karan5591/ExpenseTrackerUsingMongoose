const jwt= require("jsonwebtoken")
const dotenv= require("dotenv")




dotenv.config();

const TokenCheck= ((req, res, next)=>{
        const token= req.cookies.jwtoken;
        if(!token)
        {
            return res.status(403).send("Token required for verification")
        }
        try
        {
            if (token.startsWith('Bearer ')) {
                // Remove Bearer from string
                token = token.slice(7, token.length);
              }
             
            const decoded= jwt.verify(token, process.env.JWT_SECRET)
            req.id= decoded.user_id;
           
        }
        catch(err)
        {
            console.log(err)
        }
        return next();

});
module.exports = TokenCheck;