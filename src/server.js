const app = require('./app');
const sequelize = require("./config/db");
const User = require('./models/user.model');

const port = process.env.ADMIN_PORT ? parseInt(process.env.ADMIN_PORT) : 4000;

sequelize.sync({ force: false })
  .then( async () => {
    console.log("✅ Base de données synchronisée");

    const adminExists = await User.findOne({ where: { email: process.env.ADMIN_EMAIL } });
    if (!adminExists) {
        const hashedPassword = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD, 10);
        await User.create({
            nom: "Fabien",
            prenom: "Flavio",
            email: process.env.SUPER_ADMIN_EMAIL,
            password: hashedPassword,
            role: "superAdmin",
        });
        console.log('Utilisateur administrateur créé ✅');
    } else {
        console.log('L\'utilisateur administrateur existe déjà ✅');
    }

    app.listen(port, () => {
        console.log(`Server is running at http://${process.env.ADMIN_MYSQL_HOST}:${port}`);
    });
  })

  .catch((err) => console.error("Erreur DB ❌", err));