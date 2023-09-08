// SE IMPORTA EL MODULO ROUTER EL PAQUETE DE EXPRESS
import { Router } from 'express'
import { checkAuth } from '../middlewares/auth.js'
// IMPORTAR LOS CONTROLADORES REALIZADOS PARA CADA RUTA
import { createWUnit, allWUnit, getWUnit, updateWUnit, deleteWUnit } from '../controller/WUnitController.js'

const router = Router()

// CREAR RUTAS UTILIZANDO EL NOMBRE DE LA CONSTANTE
// QUE SE LE DA AL CONTROLADOR DE LA LOGICA CON BD
router.post('/wunit', checkAuth, createWUnit) // CREATE
router.get('/wunits', checkAuth, allWUnit) // GET ALL
router.get('/wunit/:id_wunit', checkAuth, getWUnit) // GET ID
router.patch('/wunit/:id_wunit', checkAuth, updateWUnit) // UPDATE
router.delete('/wunit/:id_wunit', checkAuth, deleteWUnit) // DELETE

export default router // EXPORTAR LAS RUTAS PARA SER USADAS EN APP.JS