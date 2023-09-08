// SE IMPORTA EL MODULO ROUTER EL PAQUETE DE EXPRESS
import { Router } from 'express'
import { checkAuth } from '../middlewares/auth.js'
// IMPORTAR LOS CONTROLADORES REALIZADOS PARA CADA RUTA
import { createMUnit, allMUnit, getMUnit, updateMUnit, deleteMUnit } from '../controller/MUnitController.js'

const router = Router()

// CREAR RUTAS UTILIZANDO EL NOMBRE DE LA CONSTANTE
// QUE SE LE DA AL CONTROLADOR DE LA LOGICA CON BD
router.post('/munit', checkAuth, createMUnit) // CREATE
router.get('/munits', checkAuth, allMUnit) // GET ALL
router.get('/munit/:id_munit', checkAuth, getMUnit) // GET ID
router.patch('/munit/:id_munit', checkAuth, updateMUnit) // UPDATE
router.delete('/munit/:id_munit', checkAuth, deleteMUnit) // DELETE

export default router // EXPORTAR LAS RUTAS PARA SER USADAS EN APP.JS