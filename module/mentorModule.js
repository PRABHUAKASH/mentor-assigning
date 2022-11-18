const { ObjectID } = require("bson");
const  mongo  = require("../connect.js");
const { ObjectId } = require("mongodb");


// Student Creation ==============================================================================================
module.exports.createStudent = async (req,res,next) => {
    try{
        const insertedResponse = await mongo.selectedDB.collection("students").insertOne(req.body);
        res.send(insertedResponse);
        console.log(insertedResponse);

    }catch(err){
        console.error(err);
        res.status(500).send(err);
    }
}

//Mentor Creation =================================================================================================
module.exports.createMentor = async (req,res,next) => {
    try{
        const insertedResponse = await mongo.selectedDB.collection("mentors").insertOne(req.body);
        res.send(insertedResponse);
        console.log(insertedResponse);

    }catch(err){
        console.error(err);
        res.status(500).send(err);
    }
}
//assiging students===================================================================================================

module.exports.assignStudentMentor=async(req,res,next)=>{
    try{
        const studentArrayId = req.body.studentId; let studExists=[]; let studSuccess=[];
     
        for (let stud = 0; stud < studentArrayId.length; stud++) {
              var studentIds = studentArrayId[stud];
              const checkStudentExists = await mongo.selectedDB.collection("mentor_students").findOne({ studentId:studentIds });
              console.log(checkStudentExists);
              if(checkStudentExists){
                studExists.push(studentIds);
              //  console.log('exists'+student_ids);
              }else{
                req.body.studentId = studentIds; studSuccess.push(studentIds);
                //console.log('success'+student_ids);
                responseInserted = await mongo.selectedDB.collection("mentor_students").insertOne({...req.body});
                req.body.studentId='';
               }  
            }
              
           if(studExists.length === studentArrayId.length){
                 res.status(400).send({"msg":"The students are already under mentor"});
           }
           else if(studExists.length>0){
                res.send({"msg":studExists+" students are already under mentor but the students "+studSuccess+" are assigned to mentor successfully"});  
           }else{
                 res.send({"msg":"All students are assigned to mentor successfully"});  
           }

    }catch(error){
        console.error(error);
        res.status(500).send(error);    
    }
};

//=========================================================================================================
module.exports.changestudentmentor=async(req,res,next)=>{

    try{
      const studentId=req.params.id; const mentorId=req.body.mentorId;
      const updatedData= await mongo.selectedDB.collection("mentor_students").findOneAndUpdate(
      { studentId: studentId },
      { $set: { 'mentorId':mentorId } },
      { returnDocument: "after" },   
      );
      res.send({"msg":"Updated successfully"});
      }  catch(error){
          res.status(500).send(error);
      } 
  };

//===========================================================================================================

module.exports.listmentorstudents= async(req,res,next)=>{
    console.log(req.body.mentorId);
      try{
  
         const  listMentorstudents = await mongo.selectedDB.collection("mentor_students").aggregate([
            { "$match": { "mentorId": req.body.mentorId } },
    
            { "$lookup": {
              "let": { "userObjId": { "$toObjectId": "$studentId" } },
              "from": "students",
              "pipeline": [
                { "$match": { "$expr": { "$eq": [ "$_id", "$$userObjId" ] } } }
              ],
              "as": "userDetails"
            }},
            { $unwind : "$userDetails" }, 
            {
              $project: {
                  _id:0,
                  "userDetails.name":1
              }    
              }
          ]).toArray();
          res.send(listMentorstudents);
         }catch(error){ 
             res.status(500).send(error);
         }
         
        };