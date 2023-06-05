const db = require('../utils/db')
const dayjs = require('dayjs')

// Obtener todos los parqueaderos
const obtenerTodos = async () => {
    let query = `SELECT id_parqueadero, nombre, direccion, telefono, nombre_ciudad 
    FROM "Parqueadero" P
    JOIN "Ciudad" C ON P.id_ciudad = C.id_ciudad 
    `
    return res = await db.client.query(query,[])
}

// Obtener un parqueadero
const obtenerParqueadero = async (id) => {
    let query = `SELECT id_parqueadero, nombre, direccion, telefono, nombre_ciudad  
    FROM "Parqueadero" P
    JOIN "Ciudad" C ON P.id_ciudad = C.id_ciudad 
    WHERE id_parqueadero = $1`
    return res = await db.client.query(query,[id])
}

// Obtener Ciudades
const obtenerCiudades = async () => {
    let query = `SELECT nombre_ciudad 
    FROM "Ciudad"`
    return res = await db.client.query(query,[])
}

// Obtener Caracteristicas
const obtenerCaract = async () => {
    let query = `SELECT nombre_caracteristica 
    FROM "Caracteristica"`
    return res = await db.client.query(query,[])
}

// Obtener Lugares
const obtenerLugares = async () => {
    let query = `SELECT nombre 
    FROM "Punto_interes"`
    return res = await db.client.query(query,[])
}

// Obtener tipos
const obtenerTipos = async () => {
    let query = `SELECT tipo_tarifa 
    FROM "Tarifa"`
    return res = await db.client.query(query,[])
}

// Agregar espacio segun tipo de espacio
const obtenerEspacio = async (idPark, tipo) => {
    let query = `SELECT id_espacio 
    FROM "Espacio" 
    WHERE id_parqueadero = $1 AND tipo_espacio = $2`
    return res = await db.client.query(query, [idPark, tipo])
}

// Realizar reserva 
const agregarReserva = async (reserva) => {
    try {
        const { id_parqueadero, id_usuario, fecha_reserva, fecha_inicio, placa, marca, color, tipo} = reserva
        let now = dayjs()
        let inicio = dayjs(fecha_reserva + " " + fecha_inicio);
        await db.transaccion();
        if (!(await existe(placa))){
            let vehiculo = `INSERT INTO "Vehiculo"  
            VALUES ($1,$2,$3,$4)`
            await db.client.query(vehiculo, [placa, marca, color, tipo])
        }
        
        let reserv = `INSERT INTO "Reserva" (id_parqueadero, id_espacio, fecha_reserva, fecha_inicio, id_usuario, placa_vehiculo)  
        VALUES ($1,$2,$3,$4,$5,$6)`
        await db.client.query(reserv, [id_parqueadero, 1, now.format('YYYY-MM-DD'), inicio.format('YYYY-MM-DD HH:mm'),id_usuario, placa])
        await db.commit()
    } catch (error) {
        await db.rollback()
        console.log(error)
        throw error
    }
}

// Verificar si existe vehiculo
const existe = async (placa) => {
    let query = 'SELECT placa FROM "Vehiculo" WHERE placa = $1'
    const result = await db.client.query(query, [placa]);
    return result.rows.length !== 0;
}

module.exports = {
    obtenerTodos,
    obtenerCaract,
    obtenerCiudades,
    obtenerLugares,
    obtenerTipos,
    obtenerEspacio,
    agregarReserva,
    obtenerParqueadero
}