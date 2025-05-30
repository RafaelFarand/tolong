const express = require('express');
const router = express.Router();
const RefreshTokenController = require('../controllers/RefreshTokenController');

// Endpoint untuk mendapatkan access token baru
router.post('/token', RefreshTokenController.refreshToken);

// Endpoint untuk logout (menghapus refresh token)
router.post('/logout', RefreshTokenController.logout);

module.exports = router;
