const mongoose = require('mongoose');
const Castillo = require('../models/Castillo');

const mongoURI = 'mongodb+srv://smartinm67:U1IEy4r21jsjqiSx@cluster0.6wzykog.mongodb.net/Yupifiestas';

async function seedCastillos() {
    try {
        await mongoose.connect(mongoURI);
        console.log('📡 Conectado a MongoDB Atlas');

        const castillos = [
            {
                nombre: "Castillo Patrulla Canina",
                descripcion: "Divertido castillo temático con los personajes de Patrulla Canina, perfecto para fans de la serie.",
                imagen: "../img/castillos/patrulla.jpg",
                capacidad: 8,
                dimensiones: "4m x 4m x 3m",
                disponible: true
            },
            {
                nombre: "Castillo Princesas Disney",
                descripcion: "Mágico castillo rosa con decoración de princesas Disney, ideal para pequeñas princesas.",
                imagen: "../img/castillos/princesas.jpg",
                capacidad: 6,
                dimensiones: "4m x 4m x 3.5m",
                disponible: true
            },
            {
                nombre: "Castillo Superhéroes",
                descripcion: "Castillo temático con los superhéroes más populares, perfecto para pequeños aventureros.",
                imagen: "../img/castillos/superheroes.jpg",
                capacidad: 8,
                dimensiones: "5m x 4m x 3m",
                disponible: true
            },
            {
                nombre: "Castillo Acuático",
                descripcion: "Castillo con tobogán y piscina, ideal para días calurosos y diversión refrescante.",
                imagen: "../img/castillos/acuatico.jpg",
                capacidad: 10,
                dimensiones: "6m x 5m x 4m",
                disponible: true
            },
            {
                nombre: "Castillo Medieval",
                descripcion: "Castillo con diseño medieval y torres, perfecto para recrear aventuras de caballeros.",
                imagen: "../img/castillos/medieval.jpg",
                capacidad: 8,
                dimensiones: "5m x 5m x 4m",
                disponible: true
            },
            {
                nombre: "Castillo Multiactividades",
                descripcion: "Castillo con obstáculos, tobogán y zona de salto, para máxima diversión.",
                imagen: "../img/castillos/multi.jpg",
                capacidad: 12,
                dimensiones: "6m x 6m x 4m",
                disponible: true
            },
            {
                nombre: "Castillo Deportivo",
                descripcion: "Castillo con temática deportiva y diferentes juegos de habilidad.",
                imagen: "../img/castillos/deportivo.jpg",
                capacidad: 10,
                dimensiones: "5m x 5m x 3.5m",
                disponible: true
            }
        ];

        // Limpiar colección existente
        await Castillo.deleteMany({});
        console.log('🧹 Base de datos limpiada');

        // Insertar nuevos castillos
        const castillosCreados = await Castillo.insertMany(castillos);
        console.log(`✅ ${castillosCreados.length} castillos creados exitosamente`);

        // Mostrar IDs generados
        castillosCreados.forEach((castillo, index) => {
            console.log(`${castillo.nombre} - ID: ${castillo._id}`);
        });

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Conexión cerrada');
    }
}

seedCastillos();