// SE IMPORTA EL MODULO ROUTER EL PAQUETE DE EXPRESS
import { Router } from 'express';
// IMPORTAR LOS CONTROLADORES REALIZADOS PARA CADA RUTA
import { createCategory, allCategory, getCategory, userCategory, updateCategory, deleteCategory, uploadCategory } from '../controller/CategoryController.js';
// VALIDAR EL TOKEN DE SESION
import { checkAuth } from '../middlewares/auth.js';
// VALIDAR EL ROL
// import { checkRoleAuth } from '../middlewares/roleAuth.js';

const router = Router();

// CREAR RUTAS UTILIZANDO EL NOMBRE DE LA CONSTANTE
// QUE SE LE DA AL CONTROLADOR DE LA LOGICA CON BD
router.post('/categoria', checkAuth, uploadCategory, createCategory) // CREAR
router.get('/categorias', checkAuth, allCategory) // TODAS CATEGORIAS
router.get('/categoria/:id_category', checkAuth, getCategory) // GET ID
router.get('/selectedsystem/:id_system', checkAuth, userCategory) // SELECTOR POR SISTEMA
router.patch('/categoria/:id_category', checkAuth, uploadCategory, updateCategory) // ACTUALIZAR
router.delete('/categoria/:id_category', checkAuth, deleteCategory) // ELIMINAR

// EXPORTAR LAS RUTAS PARA SER USADAS EN APP.JS
export default router