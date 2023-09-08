// SE IMPORTA EL MODULO ROUTER EL PAQUETE DE EXPRESS
import { Router } from 'express'
import { checkAuth } from '../middlewares/auth.js'
// IMPORTAR LOS CONTROLADORES REALIZADOS PARA CADA RUTA
import { createVereda, allVereda, getVereda, updateVereda, deleteVereda, selectedMunicipality } from '../controller/VeredaController.js'

const router = Router()

// CREAR RUTAS UTILIZANDO EL NOMBRE DE LA CONSTANTE
// QUE SE LE DA AL CONTROLADOR DE LA LOGICA CON BD
router.post('/vereda', checkAuth, createVereda)
router.get('/veredas', checkAuth, allVereda)
router.get('/vereda/:id_vereda', checkAuth, getVereda)
router.patch('/vereda/:id_vereda', checkAuth, updateVereda)
router.delete('/vereda/:id_vereda', checkAuth, deleteVereda)
router.get('/selectedmunicipality/:id_municipality', checkAuth, selectedMunicipality) // TODOS LOS VEREDAS POR MUNICIPIO

// EXPORTAR LAS RUTAS PARA SER USADAS EN APP.JS
export default router