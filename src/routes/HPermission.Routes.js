import { Router } from "express";
import { checkAuth } from "../middlewares/auth.js";
import { allHPermission, getHPermission, createHPermission, updateHPermission, deleteHPermission } from '../controller/hasPermissionController.js'

const router = Router();

router.get('/hpermisos', checkAuth, allHPermission) // VER TODOS LOS PERMISOS ASIGNADOS
router.get('/hpermiso/:id_hpermission', checkAuth, getHPermission) // TRAER UNA ASIGNACION DE PERMISO ID
router.post('/hpermiso', checkAuth, createHPermission) // CREAR UNA NUEVA ASIGNACION DE PERMISO
router.patch('/hpermiso/:id_hpermission', checkAuth, updateHPermission) // ACTUALIZAR LA ASIGNACION DE PERMISO
router.delete('/hpermiso/:id_hpermission', checkAuth, deleteHPermission) // ELIMINAR UNA ASIGNACION DE PERMISO

export default router