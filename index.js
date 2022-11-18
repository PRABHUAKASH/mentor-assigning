const express = require ("express");
const mentorRouter = require("./router/mentorRouter");

const dotenv = require ("dotenv");
const mongo = require('./connect');

dotenv.config();
mongo.connect();

const app = express();

app.use(express.json());

app.use('/',(req,res,next)=>{
    var auth={ authorised:true };

    if(auth.authorised){
     next(); 
     console.log("authorised");
    }else{
     res.send([
        {
            'msg':'not authorised'
        }

     ]);
     console.log("Not Authorised");
   }
}); 

app.use("/assigningMentor",mentorRouter);

app.listen(process.env.PORT);