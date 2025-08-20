const jwt = require("jsonwebtoken")
const privateKey = require('./private-key')

module.exports = (req,res,next) => {
    const authHeader = req.headers.authorization

    if(!authHeader){
        const message = "Vous n'avez pas fourni de jeton d'authorisation , ajouter-en un dans l'entete de la requeste "
        res.status(500).json({message })
    }

    const token = authHeader.split(" ")[1]
    const decodedToken = jwt.verify(token,privateKey,( error , decodedToken)=>{
        if(error){
            const message = "Utilisateur n'est pas autorisé à acceder a cette ressource"
            return res.status(401).json({message , data:error})
        }
        const userId = decodedToken.userId
        if(req.body.userId && req.body.userId !== userId ){
            const message = "identifiant de l'utilisateur est invalide."
            res.status(401).json({message})
        }else{
            next()
        }
    })
} 