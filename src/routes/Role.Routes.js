// SE IMPORTA EL MODULO ROUTER EL PAQUETE DE EXPRESS
import { Router } from 'express'
import { checkAuth } from '../middlewares/auth.js'
// IMPORTAR LOS CONTROLADORES REALIZADOS PARA CADA RUTA
import { createRole, allRole, getRole, updateRole, deleteRole } from '../controller/RoleController.js'

const router = Router()

// CREAR RUTAS UTILIZANDO EL NOMBRE DE LA CONSTANTE
// QUE SE LE DA AL CONTROLADOR DE LA LOGICA CON BD
router.post('/rol', checkAuth, createRole)
router.get('/roles', checkAuth, allRole)
router.get('/rol/:id_role', checkAuth, getRole)
router.patch('/rol/:id_role', checkAuth, updateRole)
router.delete('/rol/:id_role', checkAuth, deleteRole)

// EXPORTAR LAS RUTAS PARA SER USADAS EN APP.JS
export default router