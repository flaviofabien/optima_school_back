const jwt = require("jsonwebtoken")
const privateKey = require('./private-key')

module.exports = (req,res,next) => {
    const authHeader = req.headers.authorization

    if(!authHeader){
        const message = "Vous n'avez pas fourni de jeton d'authorisation , ajouter-en un dans l'entete de la requeste "
        return res.status(500).json({message })
    }

    const token = authHeader.split(" ")[1]

    try {
      const decodedToken = jwt.verify(token, privateKey);

      req.user = {
        id: decodedToken.id,
        role: decodedToken.role,
      };
  
      next(); 
    } catch (error) {
        const message = "Utilisateur non autorisé à accéder à cette ressource.";
        return res.status(401).json({ message, error }); // ✅ blocage clair
      }
} 