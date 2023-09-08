/* UTILIZAR LA FORMA DE IMPORT PAQUETES CON ES MODULES */
import express, { application } from 'express';
import bodyParser from 'body-parser';

import db from './config/dbconnection.js';
import { subscribeToBrokers } from './controller/BrokerController.js';

db.authenticate()
    .then(() => {
        console.log(`Connection successfully database . ${db.config.database}`);
        return db.sync(); // Sincroniza los modelos con la base de datos
    })
    .then(() => {
        subscribeToBrokers();
    })
    .catch((error) => {
        console.error('Database connection failed :', error);
    });
import { Server as WebSocketServer } from 'socket.io'; /* IMPORTAR SOCKET.IO */
import http from 'http'; // LLAMAR A HTTP DE NODE

/* IMPORTAR RUTAS */
import Permission from './routes/Permission.Routes.js'; // RUTAS DE LOS PERMISOS
import Role from './routes/Role.Routes.js'; // RUTAS DE LOS ROLES
import HPermission from './routes/HPermission.Routes.js'; // RUTAS DE LOS PERMISOS ASIGNADOS
import User from './routes/User.Routes.js'; // RUTAS DE USUARIOS
import Department from './routes/Department.Routes.js'; // RUTAS DE DEPARTAMENTOS
import Municipality from './routes/Municipality.Routes.js'; // RUTAS DE MUNICIPIOS
import Vereda from './routes/Vereda.Routes.js'; // RUTAS DE VEREDAS
import Finca from './routes/Finca.Routes.js'; // RUTAS DE FINCAS
import System from './routes/System.Routes.js'; // RUTAS DE LOS SISTEMAS
import Category from './routes/Category.Routes.js'; // RUTAS DE LAS CATEGORIAS
import Subcategory from './routes/Subcategory.Routes.js'; // RUTAS DE SUB-CATEGORIAS
import Cultive from './routes/Cultive.Routes.js'; // RUTAS DE LOS CULTIVOS
import Medicion from './routes/Medicion.Routes.js'; // RUTAS DE MEDICION
import Auth from './routes/Auth.Routes.js'; // RUTAS AUTH
import Broker from './routes/Brocker.Routes.js'; // RUTAS BROKER
import TSensor from './routes/TSensor.Routes.js'; // RUTAS TIPOS DE SENSORES
import MSensor from './routes/MSensores.Routes.js'; // RUTAS MEDICION SENSORES
import Wunit from './routes/WUnit.Routes.js'; // RUTAS UNIDAD DE PESO
import Tunit from './routes/TUnit.Routes.js'; // RUTAS UNIDAD DE TIEMPO
import Munit from './routes/MUnit.Routes.js'; // RUTAS UNIDAD DE MEDIDA
import { Graph1, Graph2, Graph3, Graph4 } from './controller/GraphicsController.js'

/* MULTER */
import { dirname, join } from 'path';
import { fileURLToPath } from "url";

const app = express(); // CREAR CONSTANTE APP PARA UTILIZAR EXPRESS

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));

/* RUTAS PARA IMAGENES SERVIR LAS IMG*/
app.use('/api/imgcategory', express.static(join(CURRENT_DIR, './public/app/category/')));
app.use('/api/imgsubcategory', express.static(join(CURRENT_DIR, './public/app/subcategory/')));
app.use('/api/imgmediciones', express.static(join(CURRENT_DIR, './public/user/medicion/')));

// DESARROLLO
import cors from "cors";
app.use(cors());

// PRODUCCION
// Configurar las opciones para CORS
// const corsOptions = {
//     origin: 'https://agriptivo.up.railway.app' // Ruta desde donde se permiten las solicitudes
// };
// app.use(cors(corsOptions)
// );


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true })); // Procesar las solicitudes HTTP entrantes.

/* EXPONER LAS RUTAS */
app.use('/api', Role)
app.use('/api', Permission)
app.use('/api', HPermission)
app.use('/auth', Auth)
app.use('/api', User)
app.use('/api', Department)
app.use('/api', Municipality)
app.use('/api', Vereda)
app.use('/api', Finca)
app.use('/api', System)
app.use('/api', Category)
app.use('/api', Subcategory)
app.use('/api', Cultive)
app.use('/api', Medicion)
app.use('/api', Broker)
app.use('/api', TSensor)
app.use('/api', MSensor)
app.use('/api', Wunit)
app.use('/api', Tunit)
app.use('/api', Munit)

/* WEBSOCKET */
const httpServer = http.createServer(app);
export const io = new WebSocketServer(httpServer, {
    cors: {
        origin: "*",
        methods: ['GET', "POST"]
    }
});
const activeIntervals = {};

io.on('connection', (socket) => {
    console.log('**** Nueva conexión ****', socket.id)

    socket.on('grafica1', (data) => { // GRAFICA 1
        Graph1(socket, data)
    });
    socket.on('grafica2', (data) => { // GRAFICA 2
        Graph2(socket, data)
    });
    socket.on('grafica3', (data) => { // GRAFICA 3
        Graph3(socket, data)
    });
    socket.on('grafica4', (data) => { // GRAFICA 4
        Graph4(socket, data)
    });
    // Manejar la desconexión de un usuario
    socket.on('disconnect', () => {
        // Detener todos los intervalos asociados con el usuario que se desconecta
        if (activeIntervals[socket.id]) {
            Object.values(activeIntervals[socket.id]).forEach(intervalId => clearInterval(intervalId));
            delete activeIntervals[socket.id];
            console.log('**** Intervalos detenidos para el usuario:', socket.id, '****');
        }
        console.log('********** Un usuario se ha desconectado Base **********');
    });
});
export { activeIntervals }

/* SI LA RUTA SOLICITADA NO EXISTE */
app.use((req, res, next) => {
    res.status(404).json({
        message: 'La ruta solicitada no existe en el aplicativo'
    })
});

export default httpServer; // EXPORTAR EL APP PARA SER UTILIZADA EN INDEX.JS