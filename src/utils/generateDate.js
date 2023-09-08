
import { format, } from 'date-fns';

export const date = async (req, res) => {
    try {
        const fechaActual = new Date(); // Obtener la fecha y hora actual en UTC
        const zonaHorariaGTM5 = 'GMT-5'; // Zona horaria
        const formatoFecha = "yyyy-MM-dd HH:mm:ss"; // Formatear la fecha y hora en el formato deseado (GMT-5)

        return format(fechaActual, formatoFecha, { timeZone: zonaHorariaGTM5 });
    } catch (error) {
        httpError(res, error);
    }
};