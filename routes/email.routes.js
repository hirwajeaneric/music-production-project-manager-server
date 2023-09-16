const express = require('express');
const router = express.Router();
const { newEmail } = require('../controllers/email.controller');

router.post('/', newEmail);

module.exports = router;