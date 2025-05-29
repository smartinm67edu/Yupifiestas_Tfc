const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existing = await Usuario.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Usuario ya existe' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = new Usuario({ email, password: hashedPassword });
    await nuevoUsuario.save();

    res.status(201).json({ message: 'Usuario creado correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(400).json({ message: 'Usuario no encontrado' });

    const valido = await bcrypt.compare(password, usuario.password);
    if (!valido) return res.status(401).json({ message: 'Contraseña incorrecta' });

    res.json({
      user: {
        email: usuario.email,
        role: usuario.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error en login' });
  }
};
