const express = require('express');
const bodyParser = require("body-parser")
const morgan = require('morgan')
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const studentRoutes = require('./routes/student.routes');
const teachRoutes = require('./routes/teacher.routes');

const anneeScolaireRoutes = require('./routes/anneeScolaire.routes');
const niveauRoutes = require('./routes/niveau.routes');
const ecoleRoutes = require('./routes/ecole.routes');
const classesRoutes = require('./routes/classes.routes');
const salleRoutes = require('./routes/salle.routes');
const courseRoutes = require('./routes/course.routes');
const matiereRoutes = require('./routes/matiere.route');
const categorieRoutes = require('./routes/categorie.routes');
const partionSalleRoutes = require('./routes/partition-salle.route');
const examenRoutes = require('./routes/examen.routes');
const notesRoutes = require('./routes/notes.routes');
const absenceRoutes = require('./routes/absence.routes');
const payementRoutes = require('./routes/payement.route');
const messageRoutes = require('./routes/message.route');


const StateRoutes = require('./routes/state.routes');
const path = require('path');

const app = express();

app
  .use(morgan("dev"))
  .use(bodyParser.json())
  .use('/uploads', express.static(path.join(__dirname,'..','uploads')))
  .use(cors()); 

/* etablissement */

app.use("/api", payementRoutes);
app.use("/api", niveauRoutes);
app.use("/api", anneeScolaireRoutes);
app.use("/api", ecoleRoutes);
app.use("/api", classesRoutes);
app.use("/api", salleRoutes);
app.use("/api", courseRoutes);
app.use("/api", matiereRoutes);
app.use("/api", categorieRoutes);
app.use("/api", partionSalleRoutes);
app.use("/api", examenRoutes);
app.use("/api", notesRoutes);
app.use("/api", absenceRoutes);
app.use("/api", messageRoutes);

  /* acteur */
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", studentRoutes);
app.use("/api", teachRoutes);

/* */
app.use("/api", StateRoutes);

app
  .use((req,res) => {
    const message = "Impossible de trouver le ressource demandé , Vous pouvez essayer un autre URL 🚫."
    res.status(404).json({message})
  })

module.exports = app;