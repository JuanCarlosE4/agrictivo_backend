import { Router } from "express";
import { checkAuth } from "../middlewares/auth.js";
import { allPermission, getPermission, createPermission, updatePermission, deletePermission } from '../controller/PermissionController.js'

const router = Router()

router.get('/permisos', checkAuth, allPermission); // TODOS LOS PERMISOS
router.get('/permiso/:id_permission', checkAuth, getPermission); // GET POR ID
router.post('/permiso', checkAuth, createPermission); // CRAR REGISTRO
router.patch('/permiso/:id_permission', checkAuth, updatePermission); // ACTUALIZAR REGISTRO
router.delete('/permiso/:id_permission', checkAuth, deletePermission) // ELIMINAR REGISTRO
export default router