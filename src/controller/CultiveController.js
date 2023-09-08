/* MODELS */
import CultiveModel from '../model/CultiveModel.js';
import FincaModel from '../model/FincaModel.js';
import SubcategoryModel from '../model/SubcategoryModel.js';
import TUnitModel from '../model/TUnitModel.js';

import { format, parse, addDays, addMonths, addYears } from 'date-fns'
import { date } from '../utils/generateDate.js'; // GENERAR LA FECHA Y HORA ACTUAL
import ResponseApi from '../utils/responseapi.js'; // ESTRUCTURA API
import { httpError } from '../utils/handleError.js'; // ERROR PARA EL CATCH
import { Sequelize } from 'sequelize';

// METODO PARA LISTAR TODAS LOS CULTIVOS
export const allCultive = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        const { id_finca } = req.params
        // CONSULTAR A LA BD TODOS LOS ROLES
        const cultives = await CultiveModel.findAll({ where: { fk_finca_id: id_finca } })
        // SI EXISTE POR LO MENOS UNO
        if (cultives.length > 0) {
            responseapi.setResult(cultives);
            // SI NO EXISTE LA RESPUESTAAPI TOMA LOS VALORES
        } else {
            responseapi.setStatus(404, 'info', 'No existen cultivos registrados');
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};

// METODO PARA CONSULTAR POR ID
export const getCultive = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        const { id_cultive } = req.params
        const cultive = await CultiveModel.findOne({
            where: {
                id_cultive: id_cultive,
            },
        })
        if (cultive) {
            responseapi.setResult(cultive);
        } else {
            responseapi.setStatus(404, "info", "No existe el cultivo solicitado");
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};

// METODO CREATE
export const createCultive = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        // OBTENER LOS DATOS PROPORCIONADOS
        const { name_cultive, capacidad_cultive, fk_finca_id, fk_subcategory_id } = req.body

        const subcategory = await SubcategoryModel.findOne({
            attributes: ['duration_subcategory', 'fk_tunit_id'],
            where: { id_subcategory: fk_subcategory_id },
            include: [
                {
                    model: TUnitModel,
                    attributes: ['name_tunit']
                }
            ]
        });

        const todaydate = await date();
        // Convertir fechaHoraFormateada nuevamente a un objeto Date
        const fechaObjeto = parse(todaydate, "yyyy-MM-dd HH:mm:ss", new Date());
        // Formatear los resultados si es necesario
        const formatoFecha = "yyyy-MM-dd HH:mm:ss";

        let aggregate_date = null
        if (subcategory.TUnitModel.name_tunit === 'Días') {
            aggregate_date = addDays(fechaObjeto, subcategory.duration_subcategory);
        } else if (subcategory.TUnitModel.name_tunit === 'Meses') {
            aggregate_date = addMonths(fechaObjeto, subcategory.duration_subcategory);
        } else if (subcategory.TUnitModel.name_tunit === 'Años') {
            aggregate_date = addYears(fechaObjeto, subcategory.duration_subcategory);
        }
        const end_date = format(aggregate_date, formatoFecha);

        const total_cultive = capacidad_cultive;
        await CultiveModel.create({ name_cultive, capacidad_cultive, total_cultive, fk_finca_id, fk_subcategory_id, end_date }).then((succes) => {
            responseapi.setStatus(201, "success", "Nuevo cultivo registrado correctamente")
        }).catch((error) => {
            console.error("*** Error crear cultivo ****", error)
            responseapi.setStatus(500, "error", "Error al registrar el cultivo")
        });
        res.json(responseapi.toResponse()); // ENVIAR LA RESPUESTA OBTENIDA

    } catch (error) {
        httpError(res, error)
    }
};

/* METODO UPDATE */
export const updateCultive = async (req, res) => {
    const responseapi = new ResponseApi();

    try {
        const { id_cultive } = req.params
        const { name_cultive, capacidad_cultive, total_cultive, fk_finca_id, fk_subcategory_id } = req.body

        await CultiveModel.update({
            name_cultive, capacidad_cultive, total_cultive, fk_finca_id, fk_subcategory_id
        },
            {
                where: {
                    id_cultive: id_cultive
                }
            }).then((success) => {
                if (success[0] > 0) {
                    responseapi.setStatus(200, "success", "Cultivo actualizado correctamente")
                } else {
                    responseapi.setStatus(404, "info", "No existe el cultivo solicitado");
                }
            }).catch((err) => {
                console.error("*** Error actualizar cultivo ****", err)
                responseapi.setStatus(500, "error", "Error al actualizar el cultivo")
            });
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};

/* METODO DELETE */
export const deleteCultive = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        const { id_cultive } = req.params
        await CultiveModel.destroy({ where: { id_cultive: id_cultive } })
            .then((succes) => {
                if (succes > 0) {
                    responseapi.setStatus(200, "success", "Cultivo eliminado correctamente")
                } else {
                    responseapi.setStatus(404, "info", "No existe el cultivo solicitado");
                }
            })
            .catch((error) => {
                console.error("*** Error eliminar cultivo ****", error)
                responseapi.setStatus(500, "error", "Error al eliminar el cultivo")
            })
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};

/* GENERATE ALERT END */
export const alertFinished = async (req, res) => {
    const responseapi = new ResponseApi()
    try {
        const id_user = req.userId;
        const today_date = await date();

        const alert = await CultiveModel.findOne({
            attributes: ['id_cultive', 'name_cultive', 'end_date'],
            include: [{
                model: FincaModel,
                attributes: ['name_finca'],
                where: { fk_user_id: id_user }
            }],
            where: { end_date: { [Sequelize.Op.lte]: today_date } }
        });

        if (!alert) {
            responseapi.setStatus(200, 'info', 'Todo normal')
        } else {
            responseapi.setResult(alert); // RESPONSE
        }


        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error);
    }
};