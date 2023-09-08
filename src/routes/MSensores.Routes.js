// SE IMPORTA EL MODULO ROUTER EL PAQUETE DE EXPRESS
import { Router } from 'express';
// IMPORTAR LOS CONTROLADORES REALIZADOS PARA CADA RUTA
import { medicionSensor, exportCsv } from '../controller/MSensorController.js';

const router = Router();

// CREAR RUTAS UTILIZANDO EL NOMBRE DE LA CONSTANTE
// QUE SE LE DA AL CONTROLADOR DE LA LOGICA CON BD
router.post('/msensor', medicionSensor)
router.get('/exportsensores', exportCsv)

// EXPORTAR LAS RUTAS PARA SER USADAS EN APP.JS
export default router