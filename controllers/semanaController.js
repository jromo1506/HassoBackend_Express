const Semana = require('../models/Semana');
const Nomina = require('../models/Nomina'); // Asegúrate de tener este modelo
const Empleado = require('../models/Empleado');
const Proyecto = require('../models/Proyecto');
const HorasTrabajadas = require('../models/HorasTrabajadas');
const express = require('express');
const moment = require('moment');
const { format, subDays, nextFriday } = require('date-fns');

const router = express.Router();



// Crear una nueva semana
exports.createSemana = async (req, res) => {
    try {
        const { fechaInicio } = req.body;

        // Verificar si ya existe una semana con la misma fecha de inicio
        const existingSemana = await Semana.findOne({ fechaInicio });
        if (existingSemana) {
            return res.status(400).json({ error: 'La fecha de inicio ya existe.' });
        }

        const semana = new Semana(req.body);
        await semana.save();
        res.status(201).json(semana);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};




// Crear una nueva semana
exports.createSemanaDebug = async (req, res) => {
    try {
        const { fechaInicio } = req.body;
    
        const semana = new Semana(req.body);
        await semana.save();
        res.status(201).json(semana);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener todas las semanas
exports.getSemanas = async (req, res) => {
    try {
        const semanas = await Semana.find().populate('idHorasTrabajadas');
        res.status(200).json(semanas);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener una semana por ID
exports.getSemanaById = async (req, res) => {
    try {
        const semana = await Semana.findById(req.params.id).populate('idHorasTrabajadas');
        if (!semana) {
            return res.status(404).json({ error: 'Semana no encontrada' });
        }
        res.status(200).json(semana);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Actualizar una semana por ID
exports.updateSemana = async (req, res) => {
    try {
        const semana = await Semana.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!semana) {
            return res.status(404).json({ error: 'Semana no encontrada' });
        }
        res.status(200).json(semana);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar una semana por ID
exports.deleteSemana = async (req, res) => {
    try {
        const semana = await Semana.findByIdAndDelete(req.params.id);
        if (!semana) {
            return res.status(404).json({ error: 'Semana no encontrada' });
        }
        res.status(200).json({ message: 'Semana eliminada' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.buscarSemana = async (req, res) => {
    try {
        const { fechaInicio } = req.body; // Suponiendo que envías la fechaInicio desde el body de la solicitud
        
        // Convertir la fecha enviada a un objeto Date
        const fechaInicioObj = new Date(fechaInicio);
        
        // Buscar si existe una semana con la misma fecha de inicio
        const semanaExistente = await Semana.findOne({ fechaInicio: fechaInicioObj });
        
        if (semanaExistente) {
            res.status(200).json({ message: 'La fecha de inicio ya existe.', semana: semanaExistente });
        } else {
            res.status(404).json({ message: 'La fecha de inicio no existe.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al verificar la fecha de inicio.' });
    }
};  

exports.getSemanasByUsuario = async (req, res) => {
    try {
        const { idUsuario } = req.params; // Obtener el idUsuario desde los parámetros de la solicitud

        // Buscar las semanas donde idUsuario coincida
        const semanas = await Semana.find({ idUsuario })
            .populate('idUsuario') // Popula los detalles del usuario
            .populate('idHorasTrabajadas'); // Popula los detalles de las horas trabajadas

        if (!semanas.length) {
            return res.status(404).json({ message: 'No se encontraron semanas para este usuario' });
        }

        // Responder con las semanas encontradas
        res.status(200).json(semanas);
    } catch (error) {
        console.error('Error al obtener semanas:', error);
        res.status(500).json({ message: 'Error al obtener las semanas' });
    }
};



exports.eliminarNominasHorasYSemana = async (req, res) => {
    const { idSemana } = req.params;

    try {
        // Eliminar todas las HorasTrabajadas con el idSemana proporcionado
        const horasResult = await HorasTrabajadas.deleteMany({ idSemana });
        
        // Eliminar todas las Nominas con el idSemana proporcionado
        const nominasResult = await Nomina.deleteMany({ idSemana });
        
        // Eliminar la Semana con el idSemana proporcionado
        const semanaResult = await Semana.deleteOne({ _id: idSemana });
        console.log( `Se eliminaron ${horasResult.deletedCount} horas trabajadas, ${nominasResult.deletedCount} nóminas, y la semana con el id: ${idSemana}`);
        return res.status(200).json({
            message: `Se eliminaron ${horasResult.deletedCount} horas trabajadas, ${nominasResult.deletedCount} nóminas, y la semana con el id: ${idSemana}`
        });
    } catch (error) {
        console.error('Error al eliminar nominas, horas trabajadas y semana:', error);
        res.status(500).json({
            message: 'Error al eliminar nominas, horas trabajadas y semana',
            error
        });
    }
};

// REGRESA EL ARRAY DE NOMINAS CON SUS HORAS
exports.obtenerNominasDeUnaSemanaJuntoConSusHoras = async (req, res) => {
    const { idSemana } = req.params; // Recibe el ID de la semana como parámetro

    try {
        // Encuentra todas las nóminas relacionadas con esta semana
        const nominas = await Nomina.find({ idSemana });

        if (!nominas.length) {
            return res.status(404).json({ message: 'No se encontraron nóminas para esta semana.' });
        }

        // Obtén las horas trabajadas de la semana filtrando por `idSemana`
       
        const horasTrabajadas = await HorasTrabajadas.find({ idSemana }).lean();
        console.log(horasTrabajadas,"aaaaa");
        // Vincula las horas trabajadas correspondientes a cada nómina
        const result = nominas.map((nomina) => {
        //    console.log(nomina.idEmpleado);
            const horasEmpleado = horasTrabajadas.filter(
                (hora) => hora.idEmpleado === nomina.idEmpleado
            );
            return {
                ...nomina.toObject(),
                horasTrabajadas: horasEmpleado,
            };
        });

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener nóminas de la semana', error });
    }
};


// REGRESA EL ARRAY DE NOMINAS CON SUS HORAS DIVIDIDO POR DIAS
exports.obtenerNominasDeUnaSemanaConHorasPorDia = async (req, res) => {
    const { idSemana } = req.params;

    try {
        // Encuentra todas las nóminas para la semana especificada
        const nominas = await Nomina.find({ idSemana });

        if (!nominas.length) {
            return res.status(404).json({ message: 'No se encontraron nóminas para esta semana.' });
        }

        // Encuentra todas las horas trabajadas de la semana
        const horasTrabajadas = await HorasTrabajadas.find({ idSemana }).lean();

        // Agrupar las horas por día para cada nómina, dejando vacío si no hay horas
        const result = nominas.map((nomina) => {
            // Filtra las horas trabajadas del empleado
            const horasEmpleado = horasTrabajadas.filter(
                (hora) => hora.idEmpleado.toString() === nomina.idEmpleado
            );

            // Agrupar las horas por `diaSemana`
            const horasPorDia = horasEmpleado.reduce((acc, hora) => {
                if (!acc[hora.diaSemana]) {
                    acc[hora.diaSemana] = [];
                }
                acc[hora.diaSemana].push(hora);
                return acc;
            }, {});

            return {
                ...nomina.toObject(),
                horasTrabajadas: horasPorDia, // Horas agrupadas por día o vacío si no hay horas
            };
        });

        res.status(200).json(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener nóminas con horas por día', error });
    }
};



// REGRESA EL ARRAY DE NOMINAS CON SUS HORAS DIVIDIDO POR DIAS Y PROYECTO
exports.obtenerNominasDeUnaSemanaConHorasPorDiaYProyecto = async (req, res) => {
    const { idSemana } = req.params;

    try {
        // Encuentra todas las nóminas para la semana especificada
        const nominas = await Nomina.find({ idSemana });

        if (!nominas.length) {
            return res.status(404).json({ message: 'No se encontraron nóminas para esta semana.' });
        }

        // Encuentra todas las horas trabajadas de la semana
        const horasTrabajadas = await HorasTrabajadas.find({ idSemana }).lean();

        // Verificar si las horas se han encontrado correctamente
        if (!horasTrabajadas.length) {
            return res.status(404).json({ message: 'No se encontraron horas trabajadas para esta semana.' });
        }

        // Agrupar las horas por día y por proyecto
        const result = nominas.map((nomina) => {
            // Filtra las horas trabajadas del empleado
            const horasEmpleado = horasTrabajadas.filter(
                (hora) => hora.idEmpleado.toString() === nomina.idEmpleado
            );

            // Agrupar las horas por `diaSemana` y luego por `idProyecto`
            const horasPorDiaYProyecto = horasEmpleado.reduce((acc, hora) => {
                // Si no existe el día, inicializarlo
                if (!acc[hora.diaSemana]) {
                    acc[hora.diaSemana] = {};
                }

                // Si no existe el proyecto dentro del día, inicializarlo
                if (!acc[hora.diaSemana][hora.idProyecto]) {
                    acc[hora.diaSemana][hora.idProyecto] = {
                        nombreProyecto: hora.nombreProyecto,
                        horas: [],
                    };
                }

                // Agregar la hora al proyecto correspondiente dentro del día
                acc[hora.diaSemana][hora.idProyecto].horas.push(hora);

                return acc;
            }, {});

            return {
                ...nomina.toObject(),
                horasTrabajadas: horasPorDiaYProyecto, // Horas agrupadas por día y proyecto con nombre del proyecto
            };
        });

        res.status(200).json(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener nóminas con horas por día y proyecto', error });
    }
};


// Crea las semanas
// Crea las nominas por empleados
// Evita empleados despedidos
// Realiza la suma de deudas abunos y sumaDeudas para guardarla en caa nomina
exports.crearSemanaYNominas = async (req, res) => {
    console.log("info");
    try {
        // Calcular fechas
        const fechaInicio = moment().day(-2).format('YYYY-MM-DD'); // Viernes pasado
        const fechaTermino = moment().day(5).format('YYYY-MM-DD');  // Viernes de esta semana

        // Verificar si ya existe una semana con las mismas fechas
        const semanaExistente = await Semana.findOne({ fechaInicio, fechaTermino });
        if (semanaExistente) {
            return res.status(400).json({ message: 'Ya existe una semana con estas fechas.' });
        }

        // Crear nueva semana
        const nuevaSemana = new Semana({
            fechaInicio,
            fechaTermino,
            idHorasTrabajadas: [], // Inicialmente vacío
        });

        await nuevaSemana.save();

        // Obtener todos los empleados que no están despedidos
        const empleados = await Empleado.find({ despedido: false });

        // Crear nómina y horas trabajadas para cada empleado
        const nominas = empleados.map(async (empleado) => {
            // Calculamos la deuda como sumaDeuda - abono
            const deuda = (empleado.sumaDeuda || 0) - (empleado.abono || 0);

            // Crear la nueva nómina
            const nuevaNomina = new Nomina({
                idSemana: nuevaSemana._id,
                idEmpleado: empleado._id,
                idEmp: empleado.idEmp,
                nombreEmpleado: `${empleado.nombre} ${empleado.apePat} ${empleado.apeMat}`,
                sueldoHora: empleado.pago,
                banco: empleado.banco,
                cuenta: empleado.cuenta,
                tarjeta: empleado.tarjeta,
                deben: deuda, // Guardar la deuda calculada
            });

            // Guardar la nómina en la base de datos
            await nuevaNomina.save();

            // Si tiene horas extra para el viernes pasado, registrarlas
            if (empleado.horasExtraViernes > 0 && empleado.horasExtraViernesProyecto) {
                // Obtener el nombre del proyecto para horas extra
                const proyecto = await Proyecto.findById(empleado.horasExtraViernesProyecto);
                if (proyecto) {
                    // Crear registro de horas trabajadas
                    const nuevasHorasTrabajadas = new HorasTrabajadas({
                        idSemana: nuevaSemana._id,
                        idProyecto: empleado.horasExtraViernesProyecto,
                        idEmpleado: empleado._id,
                        nombreProyecto: proyecto.nombre,
                        nombreEmpleado: `${empleado.nombre} ${empleado.apePat}`,
                        horasTrabajadas: empleado.horasExtraViernes,
                        diaSemana: 'Viernes anterior',
                        fecha: fechaInicio, // Fecha del viernes pasado
                        sonHorasExtra: false, // Indicar que son horas extra
                    });

                    await nuevasHorasTrabajadas.save();

                    // Añadir las horas trabajadas a la semana
                    nuevaSemana.idHorasTrabajadas.push(nuevasHorasTrabajadas._id);
                }

                // Restablecer los campos `horasExtraViernes` y `horasExtraViernesProyecto` a 0
                await Empleado.findByIdAndUpdate(
                    empleado._id,
                    { horasExtraViernes: 0, horasExtraViernesProyecto: 0 },
                    { new: true }
                );
            }

            // Actualizar la deuda en el empleado
            await Empleado.findByIdAndUpdate(
                empleado._id,
                { deuda: deuda }, // Sustituimos la deuda del empleado con la deuda calculada
                { new: true }
            );
        });

        await Promise.all(nominas); // Espera que todas las nóminas sean creadas.
        await nuevaSemana.save(); // Guardar la semana con las horas trabajadas asociadas

        return res.status(201).json({ message: 'Semana y nóminas creadas con éxito.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al crear semana y nóminas.', error });
    }
};