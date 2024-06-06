console.clear()

// 1. instalar jsonwebtoken npm i jsonwebtoken

const express = require('express')
const path = require('path')
const app = express()
const cors = require('cors')
const multer = require('multer')
const fs = require('fs')
const jwt = require('jsonwebtoken') // 2. instanciamos constante jsonwebtoken

const mibdu = require('./public/db/usuarios.json')
const mibdp = require('./public/db/productos.json')

const puerto = 3000

app.use(express.static('public'))
app.use(express.json())
app.use(express.text())
app.use(cors())
app.use(express.urlencoded({extended: true}))

app.get('/app/productos', (req, res)=>{

    const productos = mibdp
    if(!productos) return res.status(404)
    return res.send(productos)
    //res.send('Hola desde el servidor')
})


app.post('/app/login', verificaruser,(req, res)=>{
    const credenciales = {
        nombreus : req.body.nombreus,
        contraus : req.body.contraus
    }
    // 4. creamos el token
    jwt.sign({usuario:credenciales},'cualquiercosa',(error, token)=>{
        //res.json(token)
        let nombreus = credenciales.nombreus
        const rutahtml = '/views/regproducto.html'
        res.json({token, nombreus, rutahtml})
        //res.sendFile(path.join(__dirname,'public/views','restringido.html'))
        //const rutahtml = '/views/restringido.html'
        //res.json({rutahtml})
    })
    //res.send(`Estas en el endpoint de login para ${credenciales.nombreus}`)
    // 5. comentamos para mostrar solo el token
    //res.sendFile(path.join(__dirname, 'public/views', 'restringido.html'))
})

// 3. Endpoint para verificar login y token
app.post('/app/restringido', verificarToken, (req, res)=>{

    jwt.verify(req.token, 'cualquiercosa', (error, datos)=>{
        if(error){
            //res.sendStatus(403)
            res.sendFile(path.join(__dirname,'public/views','noauth.html'))
        }else{
            //res.send('Ruta restringida, token válido, Bienvenido')
            res.sendFile(path.join(__dirname,'public/views','regproducto.html'))
        }
    })
})
//middleware para verificar usuario en archivo usuarios.json
function verificaruser(req, res, next){
    const credenciales = {
        nombreus : req.body.nombreus,
        contraus : req.body.contraus
    }
    if(!credenciales.nombreus || !credenciales.contraus) return res.sendStatus(400)
    let user = mibdu.find(user => user.username === credenciales.nombreus)
    if(!user) return res.send('Nombre de usuario no valido')//res.sendStatus(401)
    if(user.password != credenciales.contraus) res.send('Contraseña no valida')//res.sendStatus(401)
    next()
}

// 6. Creamos la funcion middleware para verificar el token
function verificarToken(req, res, next){
    const portadora = req.headers['authorization']
    if(portadora){
        const tokenportadora = portadora.split(' ')[1]
        req.token = tokenportadora
        next()
    }else{
        res.status(403)
    }
    
}


//middleware para multer
let almacenamiento = multer.diskStorage({
    destination:(req, file, destino)=>{
        destino(null, 'public/img')
    },
    filename:(req, file, nombre)=>{
        let extension = file.mimetype.split('/')[1]
        nombre(null, `${file.originalname.split('.')[0]}.${extension}`)
    }
})
const subirArchivo = multer({storage: almacenamiento})

//endpoint para registro de productos
app.post('/app/productos', subirArchivo.single('imagenp'),(req, res, next)=>{
    //res.locals.nombreprod = req.body.nombrep
        const idp = req.body.idp,
            nombrep = req.body.nombrep,
            descripcionp = req.body.descripcionp,
            preciop = req.body.preciop,
            cantidadp = req.body.cantidadp,
            imagenp = req.file
    
    const datos = {
        id: idp,
        nombre: nombrep,
        descripcion: descripcionp,
        precio: preciop,
        cantidad: cantidadp,
        imagen: imagenp.path
    }
    
    mibdp.push(datos)

    let datosjson = JSON.stringify(mibdp)
    try{
        fs.writeFileSync('./public/db/productos.json', datosjson)
    }catch(error){
        console.log(error)
    }
    return res.send(mibdp)
    
})


app.listen( puerto, ()=>{
    console.log(`Servidor listo en el puerto ${puerto}`)
})
