const User = require('../models/User');

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: { exclude: ['password'] }
    });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    await User.update(
      { name, phone, address },
      { where: { id: req.user.userId } }
    );
    const user = await User.findByPk(req.user.userId, {
      attributes: { exclude: ['password'] }
    });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const listUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await User.create({ name, email, password, role });
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getProfile, updateProfile, listUsers, createUser };
