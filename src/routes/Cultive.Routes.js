// SE IMPORTA EL MODULO ROUTER EL PAQUETE DE EXPRESS
import { Router } from 'express'
import { checkAuth } from '../middlewares/auth.js'; //VERIFICAR LA VERACIDAD DEL TOKEN
// IMPORTAR LOS CONTROLADORES REALIZADOS PARA CADA RUTA
import { createCultive, allCultive, getCultive, updateCultive, deleteCultive, alertFinished } from '../controller/CultiveController.js'

const router = Router()

// CREAR RUTAS UTILIZANDO EL NOMBRE DE LA CONSTANTE
// QUE SE LE DA AL CONTROLADOR DE LA LOGICA CON BD
router.post('/cultivo', checkAuth, createCultive) // CREAR
router.get('/cultivos/:id_finca', checkAuth, allCultive) // TODOS CULTIVOS POR FINCA
router.get('/cultivo/:id_cultive', checkAuth, getCultive) // GET CULTIVO
router.patch('/cultivo/:id_cultive', checkAuth, updateCultive) // ACTUALIZAR
router.delete('/cultivo/:id_cultive', checkAuth, deleteCultive) // ELIMINAR
router.get('/alertcultive', checkAuth, alertFinished) // ALERTA

// EXPORTAR LAS RUTAS PARA SER USADAS EN APP.JS
export default router