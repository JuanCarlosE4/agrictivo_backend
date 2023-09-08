// SE IMPORTA EL MODULO ROUTER EL PAQUETE DE EXPRESS
import { Router } from "express";
import { checkAuth } from "../middlewares/auth.js";
import { checkPermissionAuth } from "../middlewares/permissionAuth.js";
// IMPORTAR LOS CONTROLADORES REALIZADOS PARA CADA RUTA
import { createFinca, allFinca, allFincaUser, getFinca, updateFinca, deleteFinca, } from "../controller/FincaController.js";

const router = Router();

// CREAR RUTAS UTILIZANDO EL NOMBRE DE LA CONSTANTE
// QUE SE LE DA AL CONTROLADOR DE LA LOGICA CON BD
router.post("/finca", checkAuth, createFinca);
router.get("/allfincas", checkAuth, checkPermissionAuth("verFincas"), allFinca);
router.get("/fincas", checkAuth, allFincaUser);
router.get("/finca/:id_finca", checkAuth, getFinca);
router.patch("/finca/:id_finca", checkAuth, updateFinca);
router.delete("/finca/:id_finca", checkAuth, deleteFinca);

// EXPORTAR LAS RUTAS PARA SER USADAS EN APP.JS
export default router;
