const mongoose = require('mongoose');
const Evento = require('../models/evento');

const mongoURI = 'mongodb+srv://smartinm67:U1IEy4r21jsjqiSx@cluster0.6wzykog.mongodb.net/Yupifiestas';

async function seedEventos() {
    try {
        await mongoose.connect(mongoURI);
        console.log('📡 Conectado a MongoDB Atlas');

        // IDs de ejemplo de los castillos convertidos a ObjectId
        const castilloIds = {
            patrullaCanina: new mongoose.Types.ObjectId(),
            princesas: new mongoose.Types.ObjectId(),
            superheroes: new mongoose.Types.ObjectId(),
            acuatico: new mongoose.Types.ObjectId(),
            medieval: new mongoose.Types.ObjectId()
        };

        const eventos = [
            {
                castillos: [castilloIds.patrullaCanina, castilloIds.acuatico],
                pack: null,
                precio: 450.00,
                descripcion: "Despedidas de Soltero/a Inolvidables - Vive una experiencia única con castillos hinchables XXL para adultos"
            },
            {
                castillos: [castilloIds.princesas, castilloIds.medieval],
                pack: null,
                precio: 500.00,
                descripcion: "Comuniones Mágicas - Celebración especial con castillos temáticos y decoración elegante"
            },
            {
                castillos: [castilloIds.superheroes, castilloIds.acuatico],
                pack: null,
                precio: 600.00,
                descripcion: "Fiestas del Agua - La mejor opción para los días de calor con toboganes y juegos acuáticos"
            },
            {
                castillos: [castilloIds.medieval, castilloIds.patrullaCanina],
                pack: null,
                precio: 550.00,
                descripcion: "Eventos Corporativos - Team building diferente y divertido para empresas"
            },
            {
                castillos: [
                    castilloIds.princesas,
                    castilloIds.superheroes,
                    castilloIds.acuatico
                ],
                pack: null,
                precio: 750.00,
                descripcion: "Gran Fiesta Infantil - Combinación perfecta de castillos para una celebración inolvidable"
            }
        ];

        // Limpiar colección existente
        await Evento.deleteMany({});
        console.log('🧹 Base de datos limpiada');

        // Insertar nuevos eventos
        const eventosCreados = await Evento.insertMany(eventos);
        console.log(`✅ ${eventosCreados.length} eventos creados exitosamente`);

        // Mostrar eventos creados con sus IDs de castillos
        eventosCreados.forEach((evento, index) => {
            console.log(`\nEvento ${index + 1}:`);
            console.log(`ID: ${evento._id}`);
            console.log(`Castillos: ${evento.castillos.join(', ')}`);
            console.log(`Descripción: ${evento.descripcion}`);
            console.log(`Precio: ${evento.precio}€`);
            console.log('-------------------------');
        });

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Conexión cerrada');
    }
}

seedEventos();