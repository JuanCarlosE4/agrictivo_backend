// SE IMPORTA EL MODULO ROUTER EL PAQUETE DE EXPRESS
import { Router } from 'express'
import { checkAuth } from '../middlewares/auth.js'
// IMPORTAR LOS CONTROLADORES REALIZADOS PARA CADA RUTA
import { createTUnit, allTUnit, getTUnit, updateTUnit, deleteTUnit } from '../controller/TUnitController.js'

const router = Router()

// CREAR RUTAS UTILIZANDO EL NOMBRE DE LA CONSTANTE
// QUE SE LE DA AL CONTROLADOR DE LA LOGICA CON BD
router.post('/tunit', checkAuth, createTUnit)
router.get('/tunits', checkAuth, allTUnit)
router.get('/tunit/:id_tunit', checkAuth, getTUnit)
router.patch('/tunit/:id_tunit', checkAuth, updateTUnit)
router.delete('/tunit/:id_tunit', checkAuth, deleteTUnit)

// EXPORTAR LAS RUTAS PARA SER USADAS EN APP.JS
export default router