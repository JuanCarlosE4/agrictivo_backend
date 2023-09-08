import BrokerModel from '../model/BrokerModel.js' // MODELO DEL BROKER
import mqtt from 'mqtt' // TIPO DE CONEXION MQTT PARA BROKER
import ResponseApi from '../utils/responseapi.js'; // ESTRUCTURA API
import { httpError } from '../utils/handleError.js'; // ERROR PARA EL CATCH

/* METODO PARA LISTAR TODOS LOS ROLES */
export const allBroker = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        // CONSULTAR A LA BD TODOS LOS ROLES
        const brokers = await BrokerModel.findAll({
            attributes: ["url_broker", "clientid_broker", "username_broker", "topic_broker", "fk_finca_id"]
        })
        // SI EXISTE POR LO MENOS UNO
        if (brokers.length > 0) {
            responseapi.setResult(brokers)
            // SI NO EXISTE LA RESPUESTAAPI TOMA LOS VALORES
        } else {
            responseapi.setStatus(404, 'info', 'No existen brokers registrados')
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());
    } catch (error) {
        httpError(res, error)
    }
};

/* METODO PARA CONSULTAR POR ID */
export const getBroker = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        const { id_broker } = req.params
        const broker = await BrokerModel.findOne({
            where: {
                id_broker: id_broker,
            },
        });
        if (broker) {
            responseapi.setResult(broker);
        } else {
            responseapi.setStatus(404, "info", "No existe el broker solicitado");
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());
    } catch (error) {
        httpError(res, error)
    }
};

/* METODO CREATE */
export const createBroker = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        // OBTENER LOS DATOS PROPORCIONADOS
        const { url_broker, username_broker, password_broker, topic_broker, fk_finca_id } = req.body

        const clientid_broker = 'emqx_nodejs_' + Math.random().toString(16).substring(2, 8)

        await BrokerModel.create({
            url_broker, clientid_broker, username_broker, password_broker, topic_broker, fk_finca_id
        })
            .then((succes) => {
                responseapi.setStatus(201, "success", "Broker registrado con exito")
            })
            .catch((error) => {
                console.error("*** Error crear broker ****", error)
                responseapi.setStatus(500, "error", "Error al registrar el broker")
            })
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());
    } catch (error) {
        httpError(res, error)
    }
};

/* METODO UPDATE */
export const updateBroker = async (req, res) => {
    const responseapi = new ResponseApi();

    try {
        const { id_broker } = req.params
        const { url_broker, username_broker, password_broker, topic_broker, fk_finca_id } = req.body

        await BrokerModel.update({
            url_broker, username_broker, password_broker, topic_broker, fk_finca_id
        },
            {
                where: {
                    id_broker: id_broker
                }
            }
        ).then((success) => {
            if (success[0] > 0) {
                responseapi.setStatus(200, "success", "Broker actualizado correctamente")
            } else {
                responseapi.setStatus(404, "info", "No existe el broker solicitado");
            }
        })
            .catch((err) => {
                console.error("*** Error actualizar broker ****", err)
                responseapi.setStatus(500, "error", "Error al actualizar el broker")
            });
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};

/* METODO DELETE */
export const deleteBroker = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        const { id_broker } = req.params
        await BrokerModel.destroy({ where: { id_broker: id_broker } })
            .then((succes) => {
                if (succes > 0) {
                    responseapi.setStatus(200, "success", "Broker eliminado correctamente")
                } else {
                    responseapi.setStatus(404, "info", "No existe el broker solicitado");
                }
            })
            .catch((error) => {
                console.error("*** Error eliminar broker ****", error)
                responseapi.setStatus(500, "error", "Error al eliminar el broker")
            })
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};

/* CONEXION BROKER */
export const subscribeToBrokers = async () => {
    try {
        const brokers = await BrokerModel.findAll();
        brokers.forEach((broker) => {
            const { url_broker, clientid_broker, username_broker, password_broker, topic_broker } = brokers;
            const fk_finca_id = 13; // DEBE LLEGAR POR MEDIO DEL BROKER
            const options = {
                clientId: clientid_broker,
                username: username_broker,
                password: password_broker
            };
            const client = mqtt.connect(url_broker, options);
            // MANEJO DE EVENTOS DE CONEXION MQTT
            client.on('connect', () => {
                console.log(`Conexión MQTT exitosa con la finca ${fk_finca_id}`);
                client.subscribe(topic_broker, (err) => {
                    if (err) {
                        console.error("Error al suscribirse al tema", err);
                    } else {
                        console.log(`Suscrito al tema: ${topic_broker}`);
                    }
                });
            });
            client.on('message', async (topic_broker, message) => {
                console.log(`**** Mensaje recibido de finca **** ${fk_finca_id}: ${message.toString()}****`);

                const data = JSON.parse(message.toString());
                try {
                    await BrokerModel.create({
                        lectura_msensor: data.lectura_msensor,
                        fk_tsensor_id: data.fk_tsensor_id,
                        fk_cultive_id: data.fk_cultive_id
                    }).then((success) => {
                        console.log("Datos guardados en la base de datos");
                    }).catch((error) => {
                        console.error("No se registraron los datos: ", error);
                    });
                } catch (error) {
                    console.error("Algo salio mal con el servidor", error);
                }
            });
            client.on('close', () => {
                console.log('**** Desconexión MQTT ****');
            });
            client.on('error', (err) => {
                console.error('Error MQTT: ', err);
            });
        });
    } catch (error) {
        console.log('Error al obtener los brokers de la base de datos', error);
    }
};