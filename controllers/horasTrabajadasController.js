const HorasTrabajadas = require('../models/HorasTrabajadas.js');
const Nomina = require('../models/Nomina.js')
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
        const { idSemana,idEmpleado,idProyecto} = req.params;

        // Llama al servicio
        const horasPagadas = await calcularPagoEmpleado(idEmpleado, idProyecto, idSemana);
        const numeroDias = await obtenerDiasTrabajados(idSemana,idEmpleado);
        const workDaysPerSingleProyect= await getWorkDaysForSingleProject(idSemana, idProyecto);
        const obtenerDatosNomina = await obtenerDetallesNomina(idSemana,idEmpleado);
        var yarbis = {
           pension: (obtenerDatosNomina.pension / numeroDias) * workDaysPerSingleProyect,
           sobreSueldo: (obtenerDatosNomina.sobreSueldo / numeroDias) * workDaysPerSingleProyect,
           finiquito:( obtenerDatosNomina.finiquito / numeroDias) * workDaysPerSingleProyect,
        }
       
        // console.log(numeroProyectos,"Numero de proyectos");
        // console.log(workDaysPerProject,"Dias trabajados pro proyecto");
        res.status(200).json({
            success: true,
            message: 'Proyectos únicos obtenidos exitosamente',
            horasPagadas,
            numeroDias,//Se divide entre el numero DE PROYECTOS O ENTRE 5?????
            workDaysPerSingleProyect,
            yarbis
        });
    } catch (error) {
        console.error('Error en el controlador:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener proyectos únicos',
            error: error.message,
        });
    }
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







exports.calculoIndividual = async (req, res) => {


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

        // Verificar si se encontraron horas trabajadas
        if (horasTrabajadas.length === 0) {
            throw new Error('No se encontraron horas trabajadas para el empleado en el proyecto durante esta semana.');
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

