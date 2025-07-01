const mongoose = require('mongoose');

const server = process.env.MONGO_SERVER || 'localhost:27017';
const database = process.env.MONGO_DB || 'db';

const conectarDB = async () => {
  try {
    await mongoose.connect(`mongodb://${server}/${database}`);

    console.log('MongoDB conectado!!');
  } catch (err) {
    console.log('Fallo al conectar a MongoDB', err);
  }
};

module.exports = conectarDB;
