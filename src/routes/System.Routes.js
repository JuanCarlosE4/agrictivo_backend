// SE IMPORTA EL MODULO ROUTER EL PAQUETE DE EXPRESS
import { Router } from 'express'
// IMPORTAR LOS CONTROLADORES REALIZADOS PARA CADA RUTA
import { createSystem, allSystem, getSystem, updateSystem, deleteSystem } from '../controller/SystemController.js'
// VALIDAR EL TOKEN DE SESION
import { checkAuth } from '../middlewares/auth.js';

const router = Router()

// CREAR RUTAS UTILIZANDO EL NOMBRE DE LA CONSTANTE
// QUE SE LE DA AL CONTROLADOR DE LA LOGICA CON BD
router.post('/sistema', checkAuth, createSystem)
router.get('/sistemas', checkAuth, allSystem)
router.get('/sistema/:id_system', checkAuth, getSystem)
router.patch('/sistema/:id_system', checkAuth, updateSystem)
router.delete('/sistema/:id_system', checkAuth, deleteSystem)

// EXPORTAR LAS RUTAS PARA SER USADAS EN APP.JS
export default router