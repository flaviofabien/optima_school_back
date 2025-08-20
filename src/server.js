const app = require('./app');
const sequelize = require("./config/db");

const port = process.env.ADMIN_PORT ? parseInt(process.env.ADMIN_PORT) : 4000;

sequelize.sync({ force: false })
  .then( async () => {
    console.log("✅ Base de données synchronisée");

    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
  })

  .catch((err) => console.error("Erreur DB ❌", err));