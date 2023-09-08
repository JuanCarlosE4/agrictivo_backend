/* MODELOS */
import MSensorModel from "../model/Medicion_SensorModel.js";
import CultiveModel from "../model/CultiveModel.js";
import TSensorModel from "../model/Type_SensorModel.js";
import FincaModel from "../model/FincaModel.js"
// ESTRUCTUA PARA LA RESPUESTA DE LA API
import ResponseApi from '../utils/responseapi.js';
// ERROR PARA EL CATCH
import { httpError } from '../utils/handleError.js';

export const medicionSensor = async (req, res)=>{
    const responseapi = new ResponseApi();
    try{
        const {lectura_msensor, fk_tsensor_id, fk_cultive_id} = req.body
    // GUARDAR LOS DATOS
        await MSensorModel.create({
            lectura_msensor,fk_tsensor_id,fk_cultive_id
})
    .then((succes) => {
        console.log("Datos guardados")
        responseapi.setStatus(201, "success", "Datos guardados")
    })
    .catch((error) => {
        console.error("*** Error eliminar asignación de permiso ****", error)
        console.log("Datos no guardados", error)
        responseapi.setStatus(200, "error", "Datos no guardados")
    })
    res.json(responseapi.toResponse())

    }catch(error){
        httpError(res, error)
    }
};

/* CONSULTAR LOS DATOS PARA EXPORTARLOS */
export const exportCsv = async (req, res) => {
    const responseapi = new ResponseApi();
    try{
         const mediciones = await MSensorModel.findAll({
            attributes: ["lectura_msensor", "created_at_msensor"],
            include: [
                {
                    model: TSensorModel,
                    attributes: ["name_tsensor"],
                },
                {
                    model: CultiveModel,
                    attributes: ["name_cultive"],
                    include: [{
                        model: FincaModel,
                        attributes: ['name_finca']
                    }
                    ]
                },
            ],
         })
         if(mediciones.length > 0) {
              const resultado = mediciones.map(objeto => {
                const lectura = objeto.dataValues.lectura_msensor;
                const fecha_lectura = objeto.dataValues.created_at_msensor;
                const tipo_sensor = objeto.TSensorModel.name_tsensor;
                const nombre_cultivo = objeto.CultiveModel.name_cultive;
                const finca = objeto.CultiveModel.FincaModel.name_finca;
                return { lectura, tipo_sensor, nombre_cultivo, finca, fecha_lectura };
              });
            responseapi.setResult(resultado)
         }else{
            responseapi.setStatus(404, 'info', 'No existen mediciones registradas')
        }
        res.json(responseapi.toResponse())
    }catch(error){
        httpError(res, error)
    }
};