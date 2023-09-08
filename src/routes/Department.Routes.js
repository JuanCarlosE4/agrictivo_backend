// SE IMPORTA EL MODULO ROUTER EL PAQUETE DE EXPRESS
import { Router } from 'express'
import { checkAuth } from '../middlewares/auth.js'
// IMPORTAR LOS CONTROLADORES REALIZADOS PARA CADA RUTA
import { createDepartment, allDepartment, getDepartment, updateDepartment, deleteDepartment } from '../controller/DepartmentController.js'

const router = Router()

// CREAR RUTAS UTILIZANDO EL NOMBRE DE LA CONSTANTE
// QUE SE LE DA AL CONTROLADOR DE LA LOGICA CON BD
router.post('/department', checkAuth, createDepartment)
router.get('/departments', checkAuth, allDepartment)
router.get('/department/:id_department', checkAuth, getDepartment)
router.patch('/department/:id_department', checkAuth, updateDepartment)
router.delete('/department/:id_department', checkAuth, deleteDepartment)

// EXPORTAR LAS RUTAS PARA SER USADAS EN APP.JS
export default router