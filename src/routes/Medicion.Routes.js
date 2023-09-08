// SE IMPORTA EL MODULO ROUTER EL PAQUETE DE EXPRESS
import { Router } from 'express'
import { checkAuth } from '../middlewares/auth.js'
// IMPORTAR LOS CONTROLADORES REALIZADOS PARA CADA RUTA
import { createMedicion, allMedicion, getMedicion, updateMedicion, deleteMedicion, uploadMedicion, exportMedicciones } from '../controller/MedicionController.js'

const router = Router()

/* CREAR RUTAS UTILIZANDO EL NOMBRE DE LA CONSTANTE
QUE SE LE DA AL CONTROLADOR DE LA LOGICA CON BD */
router.post('/medicion', checkAuth, uploadMedicion, createMedicion)
router.get('/mediciones/:id_cultivo', checkAuth, allMedicion)
router.get('/medicion/:id_medicion', checkAuth, getMedicion)
router.patch('/medicion/:id_medicion', checkAuth, uploadMedicion, updateMedicion)
router.delete('/medicion/:id_medicion', checkAuth, deleteMedicion)
router.get('/exportmediciones', checkAuth, exportMedicciones)

// EXPORTAR LAS RUTAS PARA SER USADAS EN APP.JS
export default router