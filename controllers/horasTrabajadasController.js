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