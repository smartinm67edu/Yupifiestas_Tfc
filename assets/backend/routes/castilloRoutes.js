// backend/routes/castilloRoutes.js
const express = require('express');
const router = express.Router();
const { getCastillosDisponibles } = require('../controllers/castilloController');

router.get('/api/castillos', getCastillosDisponibles);

module.exports = router;