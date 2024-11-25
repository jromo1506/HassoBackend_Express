const Semana = require('../models/Semana');
const Nomina = require('../models/Nomina'); // Asegúrate de tener este modelo
const HorasTrabajadas = require('../models/HorasTrabajadas');
const express = require('express');
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



exports.obtenerNominasDeUnaSemanaJuntoConSusHoras = async (req, res) => {
    const { idSemana } = req.params; // Recibe el ID de la semana como parámetro

    try {
        // Encuentra la semana por ID
        const semana = await Semana.findById(idSemana).populate('idHorasTrabajadas');

        if (!semana) {
            return res.status(404).json({ message: 'Semana no encontrada' });
        }

        // Encuentra todas las nóminas relacionadas con esta semana
        const nominas = await Nomina.find({ idSemana: semana._id });

        // Agrega las horas trabajadas correspondientes a cada nómina
        const result = await Promise.all(
            nominas.map(async (nomina) => {
                const horasTrabajadas = semana.idHorasTrabajadas.filter(
                    (hora) => hora.idEmpleado.toString() === nomina.idEmpleado
                );
                return {
                    ...nomina.toObject(),
                    horasTrabajadas,
                };
            })
        );

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener nóminas de la semana', error });
    }
};