// SE IMPORTA EL MODULO ROUTER EL PAQUETE DE EXPRESS
import { Router } from 'express'
import { checkAuth } from '../middlewares/auth.js'
// IMPORTAR LOS CONTROLADORES REALIZADOS PARA CADA RUTA
import { createSubcategory, allSubcategory, userSubcategory, getSubcategory, updateSubcategory, deleteSubcategory, uploadSubcategory } from '../controller/SubcategoryController.js'

const router = Router()

// CREAR RUTAS UTILIZANDO EL NOMBRE DE LA CONSTANTE
// QUE SE LE DA AL CONTROLADOR DE LA LOGICA CON BD
router.post('/subcategoria', checkAuth, uploadSubcategory, createSubcategory)
router.get('/subcategorias', checkAuth, allSubcategory)
router.get('/selectedcategory/:id_category', checkAuth, userSubcategory)
router.get('/subcategoria/:id_subcategory', checkAuth, getSubcategory)
router.patch('/subcategoria/:id_subcategory', checkAuth, uploadSubcategory, updateSubcategory)
router.delete('/subcategoria/:id_subcategory', checkAuth, deleteSubcategory)

// EXPORTAR LAS RUTAS PARA SER USADAS EN APP.JS
export default router