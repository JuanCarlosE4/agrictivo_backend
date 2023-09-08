// SE IMPORTA EL MODULO ROUTER EL PAQUETE DE EXPRESS
import { Router } from 'express'
// IMPORTAR LOS CONTROLADORES REALIZADOS PARA CADA RUTA
import { createUser, loginUser, forgotPasswort, resetPassword } from '../controller/AuthController.js'

const router = Router()

// CREAR RUTAS UTILIZANDO EL NOMBRE DE LA CONSTANTE
// QUE SE LE DA AL CONTROLADOR DE LA LOGICA CON BD
router.post('/register', createUser)
router.post('/login', loginUser)
router.post('/forgotpassword', forgotPasswort)
router.patch('/resetpassword', resetPassword)

// EXPORTAR LAS RUTAS PARA SER USADAS EN APP.JS
export default router