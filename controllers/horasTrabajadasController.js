const HorasTrabajadas = require('../models/HorasTrabajadas.js');
const Nomina = require('../models/Nomina.js');
const Proyecto = require('../models/Proyecto.js');
const Empleado = require('../models/Empleado');
const express = require('express');
const router = express.Router();


// Crear nuevas horas trabajadas
exports.createHorasTrabajadas = async (req, res) => {
    console.log(req.body)
    try {
        const horasTrabajadas = new HorasTrabajadas(req.body);
        await horasTrabajadas.save();
        res.status(201).json(horasTrabajadas);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener todas las horas trabajadas
exports.getHorasTrabajadas = async (req, res) => {
    try {
        const horasTrabajadas = await HorasTrabajadas.find().populate('idEmpleado idProyecto idSemana');
        res.status(200).json(horasTrabajadas);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener horas trabajadas por ID
exports.getHorasTrabajadasById = async (req, res) => {
    try {
        const horasTrabajadas = await HorasTrabajadas.findById(req.params.id).populate('idEmpleado idProyecto idSemana');
        if (!horasTrabajadas) {
            return res.status(404).json({ error: 'Horas trabajadas no encontradas' });
        }
        res.status(200).json(horasTrabajadas);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Actualizar horas trabajadas por ID
exports.updateHorasTrabajadas = async (req, res) => {
    try {
        const horasTrabajadas = await HorasTrabajadas.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!horasTrabajadas) {
            return res.status(404).json({ error: 'Horas trabajadas no encontradas' });
        }
        res.status(200).json(horasTrabajadas);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar horas trabajadas por ID
exports.deleteHorasTrabajadas = async (req, res) => {
    try {
        const horasTrabajadas = await HorasTrabajadas.findByIdAndDelete(req.params.id);
        if (!horasTrabajadas) {
            return res.status(404).json({ error: 'Horas trabajadas no encontradas' });
        }
        res.status(200).json({ message: 'Horas trabajadas eliminadas' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener todas las horas de x semana

exports.getHorasDeSemanaPorId = async (req, res) => {
    const { idSemana } = req.params;  // Obtenemos el idSemana desde los parámetros de la URL
    console.log(idSemana);
    try {
        // Realizamos la búsqueda en la base de datos donde el idSemana coincida
        const horas = await HorasTrabajadas.find({ idSemana });

        // Verificar si se encontraron resultados
        if (!horas.length) {
            return res.status(404).json({ message: 'No se encontraron horas trabajadas para esta semana' });
        }

        // Devolvemos las horas encontradas
        res.json(horas);
    } catch (error) {
        console.error('Error al obtener las horas trabajadas:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};


exports.getHorasBySemanaAndEmpleado = async (req, res) => {
    try {
        const { idSemana, idEmpleado } = req.params;
        
        // Buscar todas las horas que coincidan con idSemana e idEmpleado
        const horasTrabajadas = await HorasTrabajadas.find({ idSemana, idEmpleado });

        if (horasTrabajadas.length === 0) {
             return res.status(200).json([]);
        }

        res.status(200).json(horasTrabajadas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las horas trabajadas', error });
    }
};

exports.getHorasPorMesYAnio = async (req, res) => {
    const { mes, ano } = req.params;
    const fechaInicio = new Date(Date.UTC(ano, mes - 1, 1));
    const fechaFin = new Date(Date.UTC(ano, mes, 1));
    console.log("Se hizo la peticion");

    try {
        const horas = await HorasTrabajadas.find({
            fecha: { $gte: fechaInicio, $lt: fechaFin }
        });
        res.status(200).json(horas);
    } catch (error) {
        console.error("Error al obtener las horas:", error);
        res.status(500).json({ error: 'Error al obtener las horas trabajadas' });
    }
};



exports.getHorasBySemana = (req, res) => {
    const { idSemana } = req.params;

    HorasTrabajadas.find({ idSemana })
        .then(horas => {
            if (horas.length === 0) {
                return res.status(404).json({ message: 'No se encontraron horas para la semana especificada.' });
            }
            res.status(200).json(horas);
        })
        .catch(error => {
            console.error("Error al obtener las horas:", error);
            res.status(500).json({ error: 'Error al obtener las horas trabajadas' });
        });
};




// NUEVAS FUNCIONES DE NOMINAS
exports.darDeAltaHorasRegularesExtras = async (req, res) => {
    const {
        idSemana,
        idProyecto,
        idEmpleado,
        nombreProyecto,
        nombreEmpleado,
        horasTrabajadas,
        fecha,
        diaSemana,
    } = req.body;

    console.log('Request Body:', req.body);

    try {
        // Convertir referencias a cadenas explícitamente
        const idProyectoStr = idProyecto.toString();
        const idEmpleadoStr = idEmpleado.toString();

        console.log({ idSemana, idEmpleado: idEmpleadoStr }, "Nomina");

        // Busca la nómina del empleado para la semana especificada
        const nomina = await Nomina.findOne({ idSemana, idEmpleado: idEmpleadoStr });

        if (!nomina) {
            return res.status(404).json({ message: 'Nómina no encontrada para el empleado y la semana especificados.' });
        }

        const horasFaltantes = nomina.horasFaltantes;

        if (horasFaltantes > 0) {
            // Caso 1: Las horas trabajadas caben dentro de las horas faltantes
            if (horasTrabajadas <= horasFaltantes) {
                await HorasTrabajadas.create({
                    idSemana,
                    idProyecto: idProyectoStr,
                    idEmpleado: idEmpleadoStr,
                    nombreProyecto,
                    nombreEmpleado,
                    horasTrabajadas,
                    fecha,
                    diaSemana,
                    sonHorasExtra: false,
                });

                // Actualiza las horas faltantes en la nómina
                nomina.horasFaltantes -= horasTrabajadas;
                await nomina.save();
            } else {
                // Caso 2: Las horas trabajadas exceden las horas faltantes
                const horasRegulares = horasFaltantes;
                const horasExtras = horasTrabajadas - horasFaltantes;

                // Alta para las horas regulares
                await HorasTrabajadas.create({
                    idSemana,
                    idProyecto: idProyectoStr,
                    idEmpleado: idEmpleadoStr,
                    nombreProyecto,
                    nombreEmpleado,
                    horasTrabajadas: horasRegulares,
                    fecha,
                    diaSemana,
                    sonHorasExtra: false,
                });

                // Alta para las horas extras
                await HorasTrabajadas.create({
                    idSemana,
                    idProyecto: idProyectoStr,
                    idEmpleado: idEmpleadoStr,
                    nombreProyecto,
                    nombreEmpleado,
                    horasTrabajadas: horasExtras,
                    fecha,
                    diaSemana,
                    sonHorasExtra: true,
                });

                // Actualiza las horas faltantes en la nómina a 0
                nomina.horasFaltantes = 0;
                await nomina.save();
            }
        } else {
            // Caso 3: Si las horas faltantes ya son 0, solo registrar las horas extras
            const horasExtras = horasTrabajadas;

            // Alta para las horas extras
            await HorasTrabajadas.create({
                idSemana,
                idProyecto: idProyectoStr,
                idEmpleado: idEmpleadoStr,
                nombreProyecto,
                nombreEmpleado,
                horasTrabajadas: horasExtras,
                fecha,
                diaSemana,
                sonHorasExtra: true,
            });

            // No se actualizan las horas faltantes porque ya son 0
        }

        res.status(201).json({ message: 'Horas trabajadas registradas correctamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al registrar las horas trabajadas.', error });
    }
};





// Delete horas con validacion de si hay extras o no

exports.deleteHorasValidandoSiHayExtras = async (req, res) => {
    const { id } = req.params; // ID de la hora que se desea eliminar
  
    try {
      // Buscar la hora a eliminar
      const hora = await HorasTrabajadas.findById(id);
      if (!hora) {
        return res.status(404).json({ mensaje: 'Hora no encontrada' });
      }
  
      // Buscar la nómina correspondiente
      const nomina = await Nomina.findOne({
        idSemana: hora.idSemana,
        idEmpleado: hora.idEmpleado
      });
  
      if (!nomina) {
        return res.status(404).json({ mensaje: 'Nómina no encontrada' });
      }
  
      // Verificar si existen horas extras
      const horasExtras = await HorasTrabajadas.find({
        idSemana: hora.idSemana,
        idEmpleado: hora.idEmpleado,
        sonHorasExtra: true
      });
  
      if (horasExtras.length > 0) {
        // Si existen horas extras
        if (!hora.sonHorasExtra) {
          return res.status(400).json({
            mensaje: 'No se puede eliminar una hora regular si existen horas extras registradas.'
          });
        }
      } else {
        // Si no existen horas extras
        nomina.horasFaltantes += hora.horasTrabajadas; // Sumar horas trabajadas de nuevo a horas faltantes
        await nomina.save();
      }
  
      // Si se cumplen las condiciones, eliminar la hora
      await HorasTrabajadas.findByIdAndDelete(id);
      res.status(200).json({ mensaje: 'Hora eliminada correctamente' });
    } catch (error) {
      console.error('Error al eliminar la hora:', error);
      res.status(500).json({ mensaje: 'Error del servidor', error });
    }
  };

  exports.calcularTotalNomina = async (req, res) => {
    const { idSemana, idEmpleado } = req.params;
    console.log(idSemana + " " + idEmpleado, "ID EMPLEADO");
    try {
        // Buscar la nómina
        const nomina = await Nomina.findOne({ idSemana, idEmpleado });
        if (!nomina) {
            return res.status(404).json({ message: 'Nómina no encontrada para esta semana y empleado.' });
        }

        // Obtener las horas trabajadas
        const horasTrabajadas = await HorasTrabajadas.find({ idSemana, idEmpleado });
        console.log(horasTrabajadas,"HORAS ENCONTRADAS");
        // Calcular el total de horas trabajadas
        let totalHoras = 0;
        if (horasTrabajadas.length) {
            horasTrabajadas.forEach(hora => {
                const pagoHora = hora.sonHorasExtra ? nomina.sueldoHora * 2 : nomina.sueldoHora;
                totalHoras += hora.horasTrabajadas * pagoHora;
            });
        }

        // Sumar total de horas trabajadas con finiquito y sobresueldo
        const totalNomina = totalHoras + nomina.finiquito + nomina.sobreSueldo;

        // Calcular lesDoy: totalNomina + prestamo - abonan - pension
        const lesDoy = totalNomina + nomina.prestamo - nomina.abonan - nomina.pension;

        // Calcular dispEfectivo: lesDoy - nominaFiscal
        const dispEfectivo = lesDoy - nomina.nominaFiscal;

        // Actualizar la nómina con los nuevos cálculos
        nomina.totalNomina = totalNomina;
        nomina.lesDoy = lesDoy;
        nomina.dispEfectivo = dispEfectivo;

        await nomina.save();

        return res.status(200).json({
            message: 'Nómina calculada y actualizada correctamente.',
            totalNomina,
            lesDoy,
            dispEfectivo
        });

    } catch (error) {
        console.error('Error al calcular la nómina:', error);
        return res.status(500).json({ message: 'Error al calcular la nómina.', error });
    }
};


exports.obtenerPagoTotalHoras = async (req, res) => {
    const { idSemana, idEmpleado } = req.params;

    try {
        // Obtener la nómina correspondiente
        const nomina = await Nomina.findOne({ idSemana, idEmpleado });
        if (!nomina) {
            return res.status(404).json({ message: 'Nómina no encontrada para esta semana y empleado.' });
        }

        // Obtener las horas trabajadas para la semana y empleado específicos
        const horasTrabajadas = await HorasTrabajadas.find({ idSemana, idEmpleado });
        console.log(horasTrabajadas,"HORAS TRABAJADAS");
        if (!horasTrabajadas.length) {
            return res.status(404).json({ message: 'No se encontraron horas trabajadas.' });
        }

        // Calcular el total del pago por las horas trabajadas
        const pagoTotal = horasTrabajadas.reduce((total, hora) => {
            const pagoHora = hora.sonHorasExtra ? nomina.sueldoHora * 2 : nomina.sueldoHora;
            return total + (hora.horasTrabajadas * pagoHora);
        }, 0);

        return res.status(200).json({
            message: 'Pago total por las horas trabajadas calculado correctamente.',
            pagoTotal
        });

    } catch (error) {
        console.error('Error al calcular el pago total por las horas trabajadas:', error);
        return res.status(500).json({ message: 'Error al calcular el pago total.', error });
    }
};



exports.getHorasTrabajadasByNomina = async (req, res) => {
    try {
        const { idSemana, idEmpleado } = req.params;

        // Buscar todas las horas trabajadas para un empleado en una semana específica
        const horasTrabajadas = await HorasTrabajadas.find({ idSemana, idEmpleado });

        if (horasTrabajadas.length === 0) {
            return res.status(404).json({ message: 'No se encontraron horas trabajadas para la nómina especificada' });
        }

        res.status(200).json({
            message: 'Horas trabajadas encontradas',
            horasTrabajadas
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las horas trabajadas', error });
    }
};
exports.despliegueTotal = async (req, res) => {
    try {
        const { idSemana, idEmpleado } = req.params;

        // Verificar si el empleado tiene horas trabajadas
        const horasTrabajadas = await HorasTrabajadas.find({
            idEmpleado,
            idSemana,
        });

        // Si no hay horas trabajadas
        if (horasTrabajadas.length === 0) {
            // Obtener detalles de nómina
            const obtenerDatosNomina = await obtenerDetallesNomina(idSemana, idEmpleado);

            if (!obtenerDatosNomina) {
                throw new Error('No se encontraron datos de nómina para el empleado.');
            }

            const pension = obtenerDatosNomina.pension || 0;
            const sobreSueldo = obtenerDatosNomina.sobreSueldo || 0;
            const finiquito = obtenerDatosNomina.finiquito || 0;

            const total = finiquito + sobreSueldo - pension;

            // Responder directamente si no hay horas trabajadas
            return res.status(200).json({
                success: true,
                message: 'El empleado no tiene horas trabajadas.',
                desgloses: [
                    {
                        idEmpleado,
                        idSemana,
                        tipo: 'sinHoras',
                        sumaPagoHoras: 0,
                        numeroDiasTrabajados: 0,
                        numeroDiasTrabajadosPorObra: 0,
                        pension,
                        sobreSueldo,
                        finiquito,
                        total,
                    },
                ],
            });
        }

        // Clasifica los proyectos
        const { soloFinDeSemana, mixto } = await clasificarProyectos(idSemana, idEmpleado);

        // Array para almacenar todos los desgloses
        const arrayDesgloseFinal = [];

        // Procesa los proyectos solo de fines de semana
        for (const idProyecto of soloFinDeSemana) {
            const horasPagadasObj = await calcularPagoEmpleado(idEmpleado, idProyecto, idSemana);
            const horasPagadas = horasPagadasObj.totalPago || 0;
            const numeroDias = await obtenerDiasTrabajados(idSemana, idEmpleado);
            const nombreProyecto = await obtenerNombreProyecto(idProyecto);

            const desglose = {
                idProyecto,
                nombreProyecto,
                tipo: 'soloFinDeSemana',
                sumaPagoHoras: horasPagadas,
                numeroDiasTrabajados: numeroDias,
                numeroDiasTrabajadosPorObra: 0,
                pension: 0,
                sobreSueldo: 0,
                finiquito: 0,
                total: horasPagadas,
            };

            arrayDesgloseFinal.push(desglose);
        }

        // Procesa los proyectos mixtos
        for (const idProyecto of mixto) {
            const horasPagadasObj = await calcularPagoEmpleado(idEmpleado, idProyecto, idSemana);
            const horasPagadas = horasPagadasObj.totalPago || 0;
            const numeroDias = await obtenerDiasTrabajados(idSemana, idEmpleado);

            if (numeroDias === 0) continue; // Evitar división por 0

            const workDaysPerSingleProyect = await getWorkDaysForSingleProject(idSemana, idProyecto);
            const obtenerDatosNomina = await obtenerDetallesNomina(idSemana, idEmpleado);
            const nombreProyecto = await obtenerNombreProyecto(idProyecto);

            const pension = (obtenerDatosNomina.pension / numeroDias) * workDaysPerSingleProyect || 0;
            const sobreSueldo = (obtenerDatosNomina.sobreSueldo / numeroDias) * workDaysPerSingleProyect || 0;
            const finiquito = (obtenerDatosNomina.finiquito / numeroDias) * workDaysPerSingleProyect || 0;

            const total = horasPagadas + sobreSueldo - pension;

            const desglose = {
                idProyecto,
                nombreProyecto,
                tipo: 'mixto',
                sumaPagoHoras: horasPagadas,
                numeroDiasTrabajados: numeroDias,
                numeroDiasTrabajadosPorObra: workDaysPerSingleProyect,
                pension,
                sobreSueldo,
                finiquito,
                total,
            };

            arrayDesgloseFinal.push(desglose);
        }

        // Respuesta exitosa
        res.status(200).json({
            success: true,
            message: 'Proyectos procesados exitosamente',
            desgloses: arrayDesgloseFinal,
        });
    } catch (error) {
        console.error('Error en el controlador:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error al procesar los proyectos',
            error: error.message,
        });
    }
};

const obtenerNombreProyecto = async (idProyecto) => {
    const proyecto = await Proyecto.findById(idProyecto).select('nombre').exec();
    return proyecto ? proyecto.nombre : 'Nombre no disponible';
};


async function getWorkDaysPerProject(idSemana) {
    try {
        const diasLaborales = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];

        const diasTrabajadosPorProyecto = await HorasTrabajadas.aggregate([
            {
                $match: {
                    idSemana: idSemana,
                    diaSemana: { $in: diasLaborales } // Filtrar solo los días laborales
                }
            },
            {
                $group: {
                    _id: {
                        idProyecto: "$idProyecto", // Agrupar por proyecto
                        diaSemana: "$diaSemana"    // Y por día
                    }
                }
            },
            {
                $group: {
                    _id: "$_id.idProyecto", // Agrupar nuevamente por proyecto
                    diasUnicos: { $sum: 1 } // Contar días únicos trabajados en cada proyecto
                }
            },
            {
                $project: {
                    _id: 0, // No mostrar el campo _id
                    idProyecto: "$_id", // Renombrar _id como idProyecto
                    diasUnicos: 1 // Mostrar el conteo de días únicos
                }
            }
        ]);

        return diasTrabajadosPorProyecto;
    } catch (error) {
        throw new Error(`Error al calcular días únicos por proyecto: ${error.message}`);
    }
}

async function getUniqueProjectsForWeekdays(idSemana, idEmpleado) {
    try {
        const diasLaborales = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];

        const proyectosUnicos = await HorasTrabajadas.aggregate([
            {
                $match: {
                    idSemana: idSemana, // Filtrar por idSemana
                    idEmpleado: idEmpleado, // Filtrar por idEmpleado
                    diaSemana: { $in: diasLaborales } // Incluir solo días laborales
                }
            },
            {
                $group: {
                    _id: "$idProyecto", // Agrupar por idProyecto
                    count: { $sum: 1 } // Contar cuántos documentos pertenecen a cada proyecto
                }
            }
        ]);

        console.log("Proyectos agrupados:", proyectosUnicos);

        // Contar el número de proyectos únicos
        return proyectosUnicos.length;
    } catch (error) {
        throw new Error(`Error al obtener proyectos únicos: ${error.message}`);
    }
}

async function getWorkDaysForSingleProject(idSemana, idProyecto) {
    try {
        const diasLaborales = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];

        const diasTrabajados = await HorasTrabajadas.aggregate([
            {
                $match: {
                    idSemana: idSemana, // Filtrar por idSemana
                    idProyecto: idProyecto, // Filtrar por idProyecto específico
                    diaSemana: { $in: diasLaborales } // Incluir solo días laborales
                }
            },
            {
                $group: {
                    _id: "$diaSemana", // Agrupar por día único
                }
            },
            {
                $count: "diasUnicos" // Contar los días únicos trabajados
            }
        ]);

        // Si no se encontraron resultados, devolver 0
        return diasTrabajados.length > 0 ? diasTrabajados[0].diasUnicos : 0;
    } catch (error) {
        throw new Error(`Error al calcular días trabajados para un solo proyecto: ${error.message}`);
    }
}






exports.calculoIndividual = async(req,res)=>{
    const {idSemana,idEmpleado} = req.params;
    try{
        const proyectos = await clasificarProyectos(idSemana,idEmpleado);
        console.log(proyectos);
    }
    catch(error){

    }
}





async function calcularPagoEmpleado(idEmpleado, idProyecto, idSemana) {
    try {
        // Obtener todas las horas trabajadas por el empleado en el proyecto durante la semana
        const horasTrabajadas = await HorasTrabajadas.aggregate([
            {
                $match: {
                    idEmpleado: idEmpleado,
                    idProyecto: idProyecto,
                    idSemana: idSemana
                }
            }
        ]);

        // Si no se encontraron horas trabajadas, devolver un total de 0
        if (horasTrabajadas.length === 0) {
            return {
                totalPago: 0
            };
        }

        // Obtener la información del empleado, incluyendo su sueldoHora
        const nomina = await Nomina.findOne({
            idEmpleado: idEmpleado,
            idSemana: idSemana
        });

        // Verificar si se encontró la nómina
        if (!nomina) {
            throw new Error('No se encontró la nómina del empleado para esta semana.');
        }

        const sueldoHora = nomina.sueldoHora;
        let totalPago = 0;

        // Recorrer todas las horas trabajadas y calcular el pago
        horasTrabajadas.forEach(hora => {
            const pago = hora.sonHorasExtra
                ? hora.horasTrabajadas * sueldoHora * 2 // Las horas extras se pagan al doble
                : hora.horasTrabajadas * sueldoHora;  // Las horas regulares se pagan al valor normal

            totalPago += pago;
        });

        return {
            totalPago
        };

    } catch (error) {
        console.error('Error al calcular el pago del empleado:', error);
        throw error;
    }
}






async function obtenerDiasTrabajados(idSemana, idEmpleado) {
    try {
        // Filtrar las horas trabajadas de lunes a viernes para la semana y empleado dados
        const horas = await HorasTrabajadas.find({
            idSemana: idSemana,
            idEmpleado: idEmpleado,
            diaSemana: { $in: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'] } // Días válidos
        });

        if (!horas || horas.length === 0) {
            return 0; // Si no hay registros, retorna 0 días trabajados
        }

        // Contar los días donde las horas trabajadas son al menos 1
        const diasTrabajados = horas.reduce((dias, registro) => {
            if (registro.horasTrabajadas >= 1) {
                dias.add(registro.diaSemana); // Usa un Set para evitar duplicados
            }
            return dias;
        }, new Set());

        return diasTrabajados.size; // Retorna la cantidad de días únicos trabajados
    } catch (error) {
        console.error('Error al obtener días trabajados:', error);
        throw error;
    }
}


async function obtenerDetallesNomina(idSemana, idEmpleado) {
    try {
        // Buscar la nómina del empleado para la semana especificada
        const nomina = await Nomina.findOne({
            idSemana: idSemana,
            idEmpleado: idEmpleado
        });

        if (!nomina) {
            throw new Error('No se encontró una nómina para el empleado y semana especificados.');
        }

        // Extraer los valores de pensión, sobresueldo y finiquito
        const { pension, sobreSueldo, finiquito } = nomina;

        return {
            pension,
            sobreSueldo,
            finiquito
        };
    } catch (error) {
        console.error('Error al obtener los detalles de la nómina:', error.message);
        throw error;
    }
}

async function clasificarProyectos(idSemana, idEmpleado) {
    try {
        // Obtener todas las horas trabajadas del empleado en la semana
        const horasTrabajadas = await HorasTrabajadas.find({ idSemana, idEmpleado });
        
        if (!horasTrabajadas || horasTrabajadas.length === 0) {
            throw new Error('No se encontraron registros de horas trabajadas para el empleado y semana especificados.');
        }

        // Arrays para clasificar los proyectos
        const soloFinDeSemana = [];
        const mixto = [];
        const proyectosDiasLaborables = new Set(); // Para rastrear proyectos trabajados L-V
        const proyectosFinDeSemana = new Set(); // Para rastrear proyectos trabajados S-D

        // Clasificación de días laborables y no laborables
        const diasLaborables = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
        const diasFinDeSemana = ['Viernes anteriror', 'Sabado anterior','Domingo Anterior'];

         // Agrupar proyectos por tipo de día
         horasTrabajadas.forEach((registro) => {
            if (diasLaborables.includes(registro.diaSemana)) {
                proyectosDiasLaborables.add(registro.idProyecto);
            } else if (diasFinDeSemana.includes(registro.diaSemana)) {
                proyectosFinDeSemana.add(registro.idProyecto);
            }
        });

        // Clasificar los proyectos
        const todosLosProyectos = new Set([...proyectosDiasLaborables, ...proyectosFinDeSemana]);

        todosLosProyectos.forEach((idProyecto) => {
            if (proyectosFinDeSemana.has(idProyecto) && !proyectosDiasLaborables.has(idProyecto)) {
                // Proyectos exclusivamente en fin de semana
                soloFinDeSemana.push(idProyecto);
            } else {
                // Proyectos de lunes a viernes o mixtos
                mixto.push(idProyecto);
            }
        });

        return { soloFinDeSemana, mixto };
    } catch (error) {
        console.error('Error al clasificar proyectos:', error.message);
        throw error;
    }
}




exports.despliegueTotalPorProyecto = async (req, res) => {
    try {
        const { idSemana, idEmpleado } = req.params;

        // Clasifica los proyectos
        const { soloFinDeSemana, mixto } = await clasificarProyectos(idSemana, idEmpleado);

        // Array para almacenar todos los desgloses
        const arrayDesgloseFinal = [];

        // Procesa los proyectos solo de fines de semana
        for (const idProyecto of soloFinDeSemana) {
            const horasPagadasObj = await calcularPagoEmpleado(idEmpleado, idProyecto, idSemana);
            const horasPagadas = horasPagadasObj.totalPago || 0; // Extraer totalPago

            // Verifica si hay registros de horas para el empleado y la semana
            const numeroDias = await obtenerDiasTrabajados(idSemana, idEmpleado);
            console.log(numeroDias,"Numero dias");
            if (numeroDias === 0) {
                console.warn(`No se encontraron horas trabajadas para el empleado ${idEmpleado} en la semana ${idSemana} para el proyecto ${idProyecto}. Se registrará como 0.`);
            }

            const nombreProyecto = await obtenerNombreProyecto(idProyecto); // Obtener el nombre del proyecto

            const desglose = {
                idProyecto,
                nombreProyecto, // Agregar el nombre del proyecto
                tipo: 'soloFinDeSemana',
                sumaPagoHoras: horasPagadas,
                numeroDiasTrabajados: numeroDias || 0, // Si no hay horas, usamos 0
                numeroDiasTrabajadosPorObra: 0, // No aplica en fines de semana
                pension: 0,
                sobreSueldo: 0,
                finiquito: 0,
                total: horasPagadas // Total igual a sumaPagoHoras
            };

            console.log(desglose, desglose.nombreProyecto);

            arrayDesgloseFinal.push(desglose);
        }

        // Procesa los proyectos mixtos
        for (const idProyecto of mixto) {
            const horasPagadasObj = await calcularPagoEmpleado(idEmpleado, idProyecto, idSemana);
            const horasPagadas = horasPagadasObj.totalPago || 0; // Extraer totalPago

            // Verifica si hay registros de horas para el empleado y la semana
            const numeroDias = await obtenerDiasTrabajados(idSemana, idEmpleado);
            if (numeroDias === 0) {
                console.warn(`No se encontraron horas trabajadas para el empleado ${idEmpleado} en la semana ${idSemana} para el proyecto ${idProyecto}. Se registrará como 0.`);
                continue; // Salta este ciclo si no hay horas
            }

            const workDaysPerSingleProyect = await getWorkDaysForSingleProject(idSemana, idProyecto);
            const obtenerDatosNomina = await obtenerDetallesNomina(idSemana, idEmpleado);
            const nombreProyecto = await obtenerNombreProyecto(idProyecto); // Obtener el nombre del proyecto

            const pension = (obtenerDatosNomina.pension / numeroDias) * workDaysPerSingleProyect || 0;
            const sobreSueldo = (obtenerDatosNomina.sobreSueldo / numeroDias) * workDaysPerSingleProyect || 0;
            const finiquito = (obtenerDatosNomina.finiquito / numeroDias) * workDaysPerSingleProyect || 0;

            const total = horasPagadas + sobreSueldo - pension;

            const desglose = {
                idProyecto,
                nombreProyecto, // Agregar el nombre del proyecto
                tipo: 'mixto',
                sumaPagoHoras: horasPagadas,
                numeroDiasTrabajados: numeroDias || 0, // Si no hay horas, usamos 0
                numeroDiasTrabajadosPorObra: workDaysPerSingleProyect || 0, // Si no hay días, usamos 0
                pension,
                sobreSueldo,
                finiquito,
                total
            };

            console.log(desglose, desglose.nombreProyecto);

            arrayDesgloseFinal.push(desglose);
        }

        // Respuesta exitosa
        res.status(200).json({
            success: true,
            message: 'Proyectos procesados exitosamente',
            desgloses: arrayDesgloseFinal,
        });
    } catch (error) {
        console.error('Error en el controlador:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error al procesar los proyectos',
            error: error.message,
        });
    }
};


