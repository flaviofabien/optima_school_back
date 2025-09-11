const express = require("express");
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const {getAllCourses,getOneCourse,putCourse,deleteCourse,postCourses,getAllIncludeCourses} = require('../controllers/courses.controller');

router.get('/courses/',authMiddleware,getAllCourses);
router.get('/include-courses/',authMiddleware,getAllIncludeCourses);
router.post('/courses/',authMiddleware,postCourses);
router.get('/course/:id',authMiddleware,getOneCourse);
router.put('/course/:id',authMiddleware,putCourse);
router.delete('/course/:id',authMiddleware,deleteCourse);



module.exports = router;