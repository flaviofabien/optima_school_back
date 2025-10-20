const Message = require("../models/message.model");
const { Op } = require("sequelize");

exports.getAllMessage = async (req, res) => {
// router.get("/:user1/:user2", async (req, res) => {
  const { user1, user2 } = req.params;

  try {
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { fromUserId: user1, toUserId: user2 },
          { fromUserId: user2, toUserId: user1 },
        ],
      },
      order: [["timestamp", "ASC"]],
    });

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération des messages." });
  }
};