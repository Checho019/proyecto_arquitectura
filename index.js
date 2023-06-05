const express = require('express');
const path = require('path')
const bodyParser = require('body-parser');

// Puertos 
const port = process.env.PORT || 3000
const app = express()

// Llamar servicios
const usuario = require('./services/UsuarioService');
const parqueadero = require('./services/ParqueaderoService')
const { render } = require('ejs');

// Configuraciones
app.use(express.json())
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('auth', false)
app.set('email',"placeholder")
app.use(bodyParser.urlencoded({ extended: false }));

// Login
app.get('/login', (req,res) => {
    if (app.get('auth')){
        res.redirect('/')
    } else {
        res.render('login')
    }
})

// Endpoint registro
app.get('/registro', (req,res) => {
    res.render('register')
})

// Registro
app.post('/registro', async (req, res) => {
    try {
        await usuario.registrar(req.body)
        return res.redirect('/login')
    } catch (error) {
        console.log(error)
        res.sendStatus(400)
    }
})

// Cambiar contraseña
app.post('/pass', async (req,res) => {
    try {
        await usuario.actualizarContraseña(app.get('email'), req.body.password)
        app.set('auth', true)
        return res.redirect('/')
    } catch (error) {
        console.log(error)
        res.sendStatus(400)
    }
})

// Middleware de autenticacion
app.use(async (req, res, next) => {
    if (!app.get('auth')) {
        if (req.method === 'POST') {
            if(!req.body.password){
                return res.render('login')
            }
            const user = await usuario.autorizar(req.body.email, req.body.password)
            if (user) {
                app.set('email',req.body.email)
                if (req.body.password.length > 8){
                    return res.render('cambioContraseña')
                }
                app.set('auth', true)
                return res.redirect('/')
            } else {
                return res.render('login')
            }
        } else {
            return res.render('login')
        }
    }
    return next()
})

// Desloguear
app.get('/logout', (req, res) => {
    app.set('auth', false)
    res.redirect('/login')
})

// Inicio
app.get('/', (req, res) => {
    res.render('index',{email:app.get('email')})
})

app.get('/park', async (req,res) => {
    res.json(await parqueadero.obtenerTodos())
})

app.get('/park/:id', async (req,res) => {
    res.json(await parqueadero.obtenerParqueadero(req.params.id))
})

app.get('/reserva/:id', (req,res) => {
    res.render('reserva',{id:req.params.id})
})

app.post('/reserva', async (req, res) => {
    let reserva = {...req.body, ...(await usuario.buscarUsuario(app.get('email')))}
    await parqueadero.generarReserva(reserva)
    res.redirect('/')
})

app.get('/ciudades', async (req, res) => {
    res.json(await parqueadero.obtenerCiudades())
})

app.get('/caracteristicas', async (req, res) => {
    res.json(await parqueadero.obtenerCacacteristicas())
})

app.get('/puntos', async (req, res) => {
    res.json(await parqueadero.obtenerPuntos())
})

// Servidor
app.listen(port, (err) => {
    if (err) {
        console.log('Error al arrancar el servidor' + err)
    } else {
        console.log(`Server on port ${port}`)
    }
})