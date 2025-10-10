const Ecole = require('../models/ecole.model');
const Students = require('../models/student.model');
const Teach = require('../models/teacher.model');
const User = require('../models/user.model');


exports.getAllState = async (req, res) => {
  try {
    const ecole = await Ecole.findAll();
    const student = await Students.findAll();
    const teach = await Teach.findAll();
    const user = await User.findAll();

    res.json({ message: 'Users retrieved successfully', data: {
        nbEcole : ecole.length,
        nbStudent : student.length,
        nbTeach : teach.length,
        nbUser : user.length,
    } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error retrieving users', error });
  }
};