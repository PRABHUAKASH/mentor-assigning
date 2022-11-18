const express = require ("express");
const mentorModule = require ("../module/mentorModule");

const router = express.Router();

router.post("/createMentor",mentorModule.createMentor);
router.post("/createStudent",mentorModule.createStudent);
router.put("/changeStudentMentor",mentorModule.changestudentmento);
router.put("/assignStudentMentor",mentorModule.assignStudentMentor);
router.get("/listMentorStudents",mentorModule.listmentorstudents);





module.exports = router ;