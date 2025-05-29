// backend/controllers/reservaController.js
const Castillo = require('../models/Castillo');
const Reserva = require('../models/Reserva');

// Obtener castillos disponibles (EXISTENTE)
exports.getDisponibles = async (req, res) => {
  try {
    const castillos = await Castillo.find({ estado: 'disponible' });
    res.json(castillos);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener castillos' });
  }
};

// Listar todas las reservas (NUEVA)
exports.listarReservas = async (req, res) => {
  try {
    const reservas = await Reserva.find().populate('castillo');
    res.json(reservas);
  } catch (err) {
    res.status(500).json({ message: 'Error al listar reservas' });
  }
};

// Crear nueva reserva (EXISTENTE)
exports.crearReserva = async (req, res) => {
  const { castilloId, cliente, telefono, fecha } = req.body;
  try {
    const castillo = await Castillo.findById(castilloId);
    if (!castillo || castillo.estado !== 'disponible') {
      return res.status(400).json({ message: 'Castillo no disponible' });
    }

    const reserva = new Reserva({ castillo: castilloId, cliente, telefono, fecha });
    await reserva.save();

    castillo.estado = 'reservado';
    await castillo.save();

    res.status(201).json({ message: 'Reserva creada con éxito' });
  } catch (err) {
    res.status(500).json({ message: 'Error al crear la reserva' });
  }
};

// Liberar castillo (EXISTENTE)
exports.liberarCastillo = async (req, res) => {
  const { castilloId } = req.body;
  try {
    const castillo = await Castillo.findById(castilloId);
    if (!castillo) return res.status(404).json({ message: 'Castillo no encontrado' });

    const reserva = await Reserva.findOne({ castillo: castilloId, estado: 'activa' });
    if (reserva) {
      await Reserva.deleteOne({ _id: reserva._id });
    }

    castillo.estado = 'disponible';
    await castillo.save();

    res.json({ message: 'Castillo liberado y reserva eliminada' });
  } catch (err) {
    res.status(500).json({ message: 'Error al liberar castillo' });
  }
};

// Crear nuevo castillo (NUEVA)
exports.crearCastillo = async (req, res) => {
  const { nombre, categoria, imagen } = req.body;
  try {
    const castillo = new Castillo({ nombre, categoria, imagen });
    await castillo.save();
    res.status(201).json({ message: 'Castillo creado con éxito', castillo });
  } catch (err) {
    res.status(500).json({ message: 'Error al crear castillo' });
  }
};