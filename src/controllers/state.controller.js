const Ecole = require('../models/ecole.model');
const Students = require('../models/student.model');
const Teach = require('../models/teacher.model');
const User = require('../models/user.model');
const Note = require('../models/notes.model');
const Student = require('../models/student.model');
const Absence = require('../models/absense.model');


exports.getAllState = async (req, res) => {
  try {
    const userId = req.user.id;

    const ecole = await Ecole.findAll();
    const student = await Students.findAll();
    const teach = await Teach.findAll();
    const user = await User.findAll();
    const note = await Note.findAll(
      {
        include : [{
          model : Student ,
          required : true ,
          include : {
            model : User,
            required : true,
            where: {id: userId },
          }
        }] ,
        require : true ,
      }
    );
    const absence = await Absence.findAll({
      include : [{
        model : Student,
        include : {
          model : User,
          where : {id :userId },
          required : true
        }
      }]
    })

    const notesOnly =  note.map(i => parseInt(i.note) )
    console.log(notesOnly);


    res.json({ message: 'Users retrieved successfully', data: {
        nbEcole : ecole.length,
        nbStudent : student.length,
        nbTeach : teach.length,
        nbUser : user.length,
        nbMax : Math.max(...notesOnly),
        nbMin : Math.min(...notesOnly),
        nbAbsence : absence.length,
    }});

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error retrieving users', error });
  }
};