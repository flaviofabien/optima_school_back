const User = require('../models/user.model');
const bcrypt = require("bcrypt")
const privateKey = require('../middlewares/private-key')
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer");
const crypto = require('crypto');
const { Op } = require("sequelize"); 
require('../constant/global');

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({where : {email : req.body.email } })
    if (!user) return res.status(404).json({message:"L'email n'existe pas"});

    const passwordIsValid = await bcrypt.compare(req.body.password , user.password);
    if (!passwordIsValid) return res.status(404).json({message:"Le mot de passe n'existe pas"});

    const token = jwt.sign(
      {
        id: user.id,       
        role: user.role      
      },
      privateKey,
      { expiresIn: "24h" }
    );


    res.json({
        message: "Utilisateur connecté avec succès ✅",
        token: token,
        user : user
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error login user', error });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const user = await User.findOne({where : {email : req.body.email } })
    
    if (!user) return res.json({ message: "Si l’email existe, un lien a été envoyé ✅" });
    console.log(user,req.body.email );

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; 
    await user.save();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: { 
        user: process.env.ADMIN_MAILER_EMAIL, 
        pass: process.env.ADMIN_MAILER_PASSWORD 
      }
    });

    const link = `http://localhost:5173/update-password/${token}`;

    await transporter.sendMail({
      from: '"Gestion Hotel" <' + process.env.ADMIN_MAILER_EMAIL + '>',
      to: user.email,
      subject: "Réinitialisation du mot de passe",
      html: `  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5;">
                <h2 style="color: #007bff;">Réinitialisation du mot de passe</h2>
                <p>Bonjour ${user.name || ''},</p>
                <p>Vous avez demandé à réinitialiser votre mot de passe pour votre compte Gestion Hôtel.</p>
                <p>
                  <a href="${link}" 
                    style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
                    Réinitialiser mon mot de passe
                  </a>
                </p>
                <p>Si vous n'avez pas demandé ce changement, vous pouvez ignorer cet email.</p>
                <hr style="border: none; border-top: 1px solid #eee;" />
                <p style="font-size: 12px; color: #999;">Gestion Hôtel &copy; 2025</p>
              </div> `
    });

    res.json({ message: "Si cet email existe, un lien a été envoyé ✅" });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error login user', error });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { token, newPassword , confimationPassword } = req.body;

    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: Date.now() } 
      }
    });


    if (!REGEX.test(newPassword)) {
      return res.status(400).json({
        message: "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial."
      });
    }

    if (newPassword !== confimationPassword) {
      return res.status(400).json({ message: "les nouveaux mot de passe ne sont pas identique "});
    }

    if (!user) {
      return res.status(400).json({ message: "Lien invalide ou expiré ❌" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: "Mot de passe mis à jour avec succès ✅" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};