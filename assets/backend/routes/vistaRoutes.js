const express = require('express');
const router = express.Router();
const { getCastillosDisponibles } = require('../controllers/vistaController');

router.get('/castillos', getCastillosDisponibles); 

module.exports = router;
