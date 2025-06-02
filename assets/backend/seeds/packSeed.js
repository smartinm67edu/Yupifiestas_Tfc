const mongoose = require('mongoose');
const Pack = require('../models/pack');

const mongoURI = 'mongodb+srv://smartinm67:U1IEy4r21jsjqiSx@cluster0.6wzykog.mongodb.net/Yupifiestas?retryWrites=true&w=majority';

async function seedPacks() {
    try {
        await mongoose.connect(mongoURI);
        console.log('📡 Conectado a MongoDB Atlas');

        // IDs de ejemplo de los castillos - Corregido el uso de ObjectId
        const castilloIds = {
            patrullaCanina: new mongoose.Types.ObjectId(),
            princesas: new mongoose.Types.ObjectId(),
            superheroes: new mongoose.Types.ObjectId(),
            acuatico: new mongoose.Types.ObjectId(),
            medieval: new mongoose.Types.ObjectId(),
            deportivo: new mongoose.Types.ObjectId()
        };

        const packs = [
            {
                nombre: "Pack Aventura Total",
                descripcion: "Combinación perfecta de castillos para aventureros: Patrulla Canina, Superhéroes y Medieval",
                precio: 800,
                descuento: 15,
                castillos: [castilloIds.patrullaCanina, castilloIds.superheroes, castilloIds.medieval]
            },
            {
                nombre: "Pack Diversión Acuática",
                descripcion: "La mejor opción para días de calor: Castillo Acuático, Deportivo y Patrulla Canina",
                precio: 850,
                descuento: 20,
                castillos: [castilloIds.acuatico, castilloIds.deportivo, castilloIds.patrullaCanina]
            },
            {
                nombre: "Pack Princesas Mágico",
                descripcion: "El pack perfecto para princesas: Castillo de Princesas, Medieval y Superhéroes",
                precio: 750,
                descuento: 10,
                castillos: [castilloIds.princesas, castilloIds.medieval, castilloIds.superheroes]
            },
            {
                nombre: "Pack Fiesta Completa",
                descripcion: "Todo lo necesario para una gran fiesta: Castillo Acuático, Princesas y Deportivo",
                precio: 900,
                descuento: 25,
                castillos: [castilloIds.acuatico, castilloIds.princesas, castilloIds.deportivo]
            },
            {
                nombre: "Pack Súper Aventuras",
                descripcion: "La combinación más emocionante: Superhéroes, Patrulla Canina y Deportivo",
                precio: 825,
                descuento: 18,
                castillos: [castilloIds.superheroes, castilloIds.patrullaCanina, castilloIds.deportivo]
            }
        ];

        // Limpiar colección existente
        await Pack.deleteMany({});
        console.log('🧹 Base de datos limpiada');

        // Insertar nuevos packs
        const packsCreados = await Pack.insertMany(packs);
        console.log(`✅ ${packsCreados.length} packs creados exitosamente`);

        // Mostrar packs creados
        packsCreados.forEach((pack, index) => {
            console.log(`\nPack ${index + 1}:`);
            console.log(`ID: ${pack._id}`);
            console.log(`Nombre: ${pack.nombre}`);
            console.log(`Precio: ${pack.precio}€`);
            console.log(`Descuento: ${pack.descuento}%`);
            console.log('Castillos:', pack.castillos);
            console.log('-------------------------');
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Conexión cerrada');
    }
}

// Ejecutar el script
seedPacks().catch(console.error);