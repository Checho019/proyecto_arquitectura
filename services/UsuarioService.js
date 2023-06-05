const usuarioDTO = require('../dtos/Usuariodto')
const crypto = require('crypto')
const emailService = require('./MailService')

// consultar existencia de usuario
const consultarExistencia = async (email) => {
    return await usuarioDTO.existe(email)
}

// Autorizar usuarios
const autorizar = async (email, contraseña) => {
    return await usuarioDTO.validar(email, cifrarContrasenaMD5(contraseña))
}

// crear usuario
const registrar = async (user) => {
    try {
        let p = generarContrasena() + ""
        let pass = cifrarContrasenaMD5(p)
        const obj = {...user, pass}
        await usuarioDTO.agregarUsuario(obj)
        emailService.emailContraseña(user.email, p)
    } catch (error) {
        throw error
    }
}

// Generar contraseña aleatoria
const generarContrasena = () => {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let contrasena = '';
    for (let i = 0; i < 20; i++) {
        const indice = Math.floor(Math.random() * caracteres.length);
        contrasena += caracteres.charAt(indice);
    }
    return contrasena;
}

// Cifrar contraseña
const cifrarContrasenaMD5 = (contrasena) => {
    const hash = crypto.createHash('md5');
    hash.update(contrasena);
    return hash.digest('hex');
}

// Actualizar contraseña
const actualizarContraseña = async (email, pass) => {
    try {
        await usuarioDTO.actualizarPass(email, cifrarContrasenaMD5(pass))
    } catch (error) {
        throw error
    }
}

// Buscar usuario
const buscarUsuario = async (email) => {
    return await usuarioDTO.buscarPorEmail(email);
}

// Obtener totalidad del usuario
const usaurio = async (email) => {
    return await usuarioDTO.buscarCompletoPorEmail(email);
}
module.exports = {
    consultarExistencia,
    autorizar,
    registrar,
    actualizarContraseña,
    buscarUsuario
}