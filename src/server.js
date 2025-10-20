const app = require('./app');
const cors = require('cors');
const sequelize = require("./config/db");
const User = require('./models/user.model');
const bcrypt = require("bcrypt");
const {Server} = require("socket.io")
const http = require("http")


const port = process.env.ADMIN_PORT ? parseInt(process.env.ADMIN_PORT) : 4000;
const server = http.createServer(app)

sequelize.sync({ force: false })
  .then( async () => {
    console.log("✅ Base de données synchronisée");

    const SuperAdminExists = await User.findOne({ where: { email: process.env.SUPER_ADMIN_EMAIL } });
    
    if (!SuperAdminExists ) {
        const hashedPasswordSuper = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD, 10);
        await User.create({
            nom: "ANRIANANDRASANA ",
            prenom: "Flavio Fabien Maminiaina",
            img: "/uploads/img.png",
            email: process.env.SUPER_ADMIN_EMAIL,
            password: hashedPasswordSuper,
            role: "superAdmin",
        });
        console.log('Utilisateur super administrateur créé ✅');
    }
    else {
        console.log('L\'utilisateur administrateur existe déjà ✅');
    }

    const io = new Server(server,{
        cors : {
            origin : `${process.env.IP_FRONT}`,
            methods : ["GET","POST"],
        }
    })
        
    const userSockets = new Map();

    io.on("connection", (socket) => {

        socket.on("register", ({ userId }) => {
            userSockets.set(userId, socket.id); 
        });

        socket.on("send_message", ({ toUserId, message }) => {
            const targetSocketId = userSockets.get(toUserId); 
            
            if (targetSocketId) {
                io.to(targetSocketId).emit("private_message", { message });
            }
        });
    });

    server.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
  })

  .catch((err) => console.error("Erreur DB ❌", err));