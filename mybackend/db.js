const mongoose = require('mongoose');


const server = 'localhost:27017';
const database = 'db';

const conectarDB = async () => {
try {
    await mongoose.connect(`mongodb://${server}/${database}`)

    console.log('MongoDB conectado!!');
    } catch (err) {
    console.log('Fallo al conectar a MongoDB', err);
}
};

module.exports = conectarDB; 


