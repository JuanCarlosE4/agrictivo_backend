// SE IMPORTA EL MODULO ROUTER EL PAQUETE DE EXPRESS
import { Router } from 'express'
import { checkAuth } from '../middlewares/auth.js'
// IMPORTAR LOS CONTROLADORES REALIZADOS PARA CADA RUTA
import { createBroker, allBroker, getBroker, updateBroker, deleteBroker } from '../controller/BrokerController.js'

const router = Router()

// CREAR RUTAS UTILIZANDO EL NOMBRE DE LA CONSTANTE
// QUE SE LE DA AL CONTROLADOR DE LA LOGICA CON BD
router.post('/broker', checkAuth, createBroker) // CREATE
router.get('/brokers', checkAuth, allBroker) // GET ALL
router.get('/broker/:id_broker', checkAuth, getBroker) // GET ID
router.patch('/broker/:id_broker', checkAuth, updateBroker) // UPDATE
router.delete('/broker/:id_broker', checkAuth, deleteBroker) // DELETE

export default router // EXPORTAR LAS RUTAS PARA SER USADAS EN APP.JS