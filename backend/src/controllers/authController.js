const User = require('../models/User');
const { generateToken } = require('../config/jwt');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is inactive' });
    }

    const token = generateToken(user.id, user.role);
    await user.update({ lastLogin: new Date() });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const logout = (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};

const refresh = (req, res) => {
  res.json({ success: true, message: 'Token refreshed' });
};

module.exports = { login, logout, refresh };
