const express = require('express');
const bodyParser = require("body-parser")
const morgan = require('morgan')
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const studentRoutes = require('./routes/student.routes');

const app = express();

app
  .use(morgan("dev"))
  .use(bodyParser.json())
  .use(cors()); 

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", studentRoutes);

app
  .use((req,res) => {
    const message = "Impossible de trouver le ressource demandé , Vous pouvez essayer un autre URL 🚫."
    res.status(404).json({message})
  })

module.exports = app;