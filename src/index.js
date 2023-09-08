import httpServer from './app.js';
import { PORT } from './config.js';
httpServer.listen(PORT);
console.log('Running server on port: ' + PORT);