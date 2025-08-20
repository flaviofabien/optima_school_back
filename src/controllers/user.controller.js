const User = require('../models/user.model');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();

    res.json({ message: 'Users retrieved successfully', data: users });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users', error });
  }
};

exports.getOneUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json({ message: 'User retrieved successfully', data: user });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user', error });
  }
};

exports.putUser = async (req, res) => {
  try {
    const { username, email, role } = req.body;

    const [updated] = await User.update({ username, email, role }, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ message: 'User not found' });

    const updatedUser = await User.findByPk(req.params.id);

    res.json({ message: 'User updated successfully', data: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};