const dto = require('../dtos/ParqueaderoDto')

// Obtener todos los parqueaderos
const obtenerTodos = async () => {
    return await dto.obtenerTodos()
}

// Obtener un parqueadero
const obtenerParqueadero = async (id) => {
    return await dto.obtenerParqueadero(id)
}

const generarReserva = async (reserva) => {
    await dto.agregarReserva(reserva)
}

const obtenerCiudades = async () => {
    return await dto.obtenerCiudades();
}

const obtenerCacacteristicas = async () => {
    return await dto.obtenerCaract();
}

const obtenerPuntos = async  () => {
    return await dto.obtenerLugares();
}

module.exports = {
    obtenerTodos,
    obtenerParqueadero,
    generarReserva,
    obtenerCiudades,
    obtenerCacacteristicas,
    obtenerPuntos
}