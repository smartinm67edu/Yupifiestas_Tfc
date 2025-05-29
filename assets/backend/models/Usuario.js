const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // cifrada con bcrypt
  role: { type: String, enum: ['admin', 'user'], default: 'user' }
});

module.exports = mongoose.model('Usuario', usuarioSchema);
