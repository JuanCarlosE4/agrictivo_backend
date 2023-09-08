// SE IMPORTA EL MODULO ROUTER EL PAQUETE DE EXPRESS
import { Router } from 'express'
import { checkAuth } from '../middlewares/auth.js';
// IMPORTAR LOS CONTROLADORES REALIZADOS PARA CADA RUTA
import { allTSensor, getTSensor, createTSensor, updateTSensor, deleteTSensor } from '../controller/Type_SensorController.js'

const router = Router()

// CREAR RUTAS UTILIZANDO EL NOMBRE DE LA CONSTANTE
// QUE SE LE DA AL CONTROLADOR DE LA LOGICA CON BD
router.post('/tsensor', checkAuth, createTSensor)
router.get('/tsensores', checkAuth, allTSensor)
router.get('/tsensor/:id_tsensor', checkAuth, getTSensor)
router.patch('/tsensor/:id_tsensor', checkAuth, updateTSensor)
router.delete('/tsensor/:id_tsensor', checkAuth, deleteTSensor)

// EXPORTAR LAS RUTAS PARA SER USADAS EN APP.JS
export default router