const express = require('express');
const router = express.Router();

const { login, register } = require('../controllers/auth');
const authorize = require('../middleware/authorization');

router.post('/register', register);
router.post('/login', login);
router.get('/', authorize, async (req, res) => {
  const admin_id = req.user;
  if (admin_id) return res.status(200).send(true);

  res.send(false);
});

module.exports = router;
