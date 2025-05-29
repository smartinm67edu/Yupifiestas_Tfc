// backend/routes/reservaRoutes.js
const express = require('express');
const router = express.Router();
const {
  getDisponibles,
  crearReserva,
  liberarCastillo,
  listarReservas,
  crearCastillo
} = require('../controllers/reservaController');

// Rutas
router.get('/castillos', getDisponibles);          // GET /api/reservas/castillos
router.get('/reservas', listarReservas);          // GET /api/reservas/reservas
router.post('/reservar', crearReserva);           // POST /api/reservas/reservar
router.post('/liberar', liberarCastillo);         // POST /api/reservas/liberar
router.post('/crear-castillo', crearCastillo);    

module.exports = router;