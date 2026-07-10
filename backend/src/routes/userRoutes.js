const express = require('express');
const { getProfile, updateProfile, listUsers, createUser } = require('../controllers/userController');
const { authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/', authorize(['admin']), listUsers);
router.post('/', authorize(['admin']), createUser);

module.exports = router;
