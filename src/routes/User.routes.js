// SE IMPORTA EL MODULO ROUTER EL PAQUETE DE EXPRESS
import { Router } from 'express';
import { checkAuth } from '../middlewares/auth.js';
// import { checkPermissionAuth } from '../middlewares/permissionAuth.js';

// IMPORTAR LOS CONTROLADORES REALIZADOS PARA CADA RUTA
import { allUser, getUser, updateUser, deleteUser } from '../controller/UserController.js'

const router = Router()

// CREAR RUTAS UTILIZANDO EL NOMBRE DE LA CONSTANTE
// QUE SE LE DA AL CONTROLADOR DE LA LOGICA CON BD

router.get('/usuarios', checkAuth, allUser)
router.get('/usuario/:id_user', checkAuth, getUser)
router.patch('/usuario/:id_user', checkAuth, updateUser)
router.delete('/usuario/:id_user', checkAuth, deleteUser)

// EXPORTAR LAS RUTAS PARA SER USADAS EN APP.JS
export default router