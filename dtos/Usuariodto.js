const db = require('../utils/db')

db.connectDB()

// Validar si existe el usuario
const existe = async (email) => {
    let query = 'SELECT nombre FROM "Usuario" WHERE email = $1'
    const result = await db.client.query(query, [email]);
    return result.rows.length !== 0;
}

// Obtener usuario por email
const buscarCompletoPorEmail = async (email) => {
    let query = 'SELECT id_usuario, nombre, apellido, edad, email, estado FROM "Usuario" WHERE email = $1'
    const result = await db.client.query(query, [email]);
    return result;
}

// Validar si existe el usuario
const buscarPorEmail = async (email) => {
    let query = 'SELECT id_usuario FROM "Usuario" WHERE email = $1'
    const result = await db.client.query(query, [email]);
    return result.rows[0];
}

// Validar correo y contraseña
const validar = async (email, contraseña) => {
    let query = 'SELECT nombre FROM "Usuario" WHERE email = $1 AND contraseña = $2'
    const result = await db.client.query(query, [email, contraseña]);
    return result.rows.length !== 0 ? true : null;
}

// Registrar usuario
const agregarUsuario = async (user) => {
    try {
        console.log(user)
        const { id, nombre, apellido, edad, pass, email, numTarjeta, tipoTarjeta } = user
        let usuario = `INSERT INTO "Usuario"  
    VALUES ($1,$2,$3,$4,$5,$6,$7)`
        let tarjeta = `INSERT INTO "Tarjeta" (id_usuario, numero, estado, tipo) 
    VALUES ($1,$2,$3,$4)`
        await db.transaccion();
        await db.client.query(usuario, [id, nombre, apellido, edad, pass, email, 1])
        await db.client.query(tarjeta, [id, numTarjeta, true, tipoTarjeta])

        await db.commit()
    } catch (error) {
        await db.rollback()
        throw error
    }
}

// Actualizar contraseña
const actualizarPass = async (email, pass) => {
    try {
        let query = `UPDATE "Usuario" 
        SET contraseña = $1
        WHERE email = $2`
        await db.client.query(query,[pass, email])
        await db.commit()
    } catch (error) {
        await db.rollback()
        throw error
    }
}


module.exports = {
    existe,
    validar,
    agregarUsuario,
    actualizarPass,
    buscarPorEmail,
    buscarCompletoPorEmail
}