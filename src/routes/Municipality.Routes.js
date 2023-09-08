// SE IMPORTA EL MODULO ROUTER EL PAQUETE DE EXPRESS
import { Router } from 'express'
import { checkAuth } from '../middlewares/auth.js'
// IMPORTAR LOS CONTROLADORES REALIZADOS PARA CADA RUTA
import {
    createMunicipality,
    allMunicipality,
    getMunicipality,
    updateMunicipality,
    deleteMunicipality,
    selectedDepartment
} from '../controller/MunicipalityController.js'

const router = Router()

// CREAR RUTAS UTILIZANDO EL NOMBRE DE LA CONSTANTE
// QUE SE LE DA AL CONTROLADOR DE LA LOGICA CON BD
router.post('/municipality', checkAuth, createMunicipality)
router.get('/municipalities', checkAuth, allMunicipality)
router.get('/municipality/:id_municipality', checkAuth, getMunicipality)
router.patch('/municipality/:id_municipality', checkAuth, updateMunicipality)
router.delete('/municipality/:id_municipality', checkAuth, deleteMunicipality)
router.get('/selecteddepartment/:id_department', checkAuth, selectedDepartment) // TODOS LOS MUNICIPIOS POR DEPARTAMENTO

// EXPORTAR LAS RUTAS PARA SER USADAS EN APP.JS
export default router