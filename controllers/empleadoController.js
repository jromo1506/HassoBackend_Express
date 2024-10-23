const express = require('express');
const router = express.Router();
const Empleado = require('../models/Empleado');

// Crear un nuevo empleado
exports.createEmpleado = async (req, res) => {
    try {
        console.log(req.body);
        
        const empleado = new Empleado(req.body);
        await empleado.save();
        res.status(201).json(empleado);
    } catch (error) {
        console.log(error.message);
        
        res.status(400).json({ error: error.message });
    }
};

// Obtener todos los empleados
exports.getEmpleados = async (req, res) => {
    try {
        const empleados = await Empleado.find();
        res.status(200).json(empleados);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener un empleado por ID
exports.getEmpleadoById = async (req, res) => {
    try {
        const empleado = await Empleado.findById(req.params.id);
        if (!empleado) {
            return res.status(404).json({ error: 'Empleado no encontrado' });
        }
        res.status(200).json(empleado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Actualizar un empleado por ID
exports.updateEmpleado = async (req, res) => {
    try {
        const empleado = await Empleado.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!empleado) {
            return res.status(404).json({ error: 'Empleado no encontrado' });
        }
        res.status(200).json(empleado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar un empleado por ID
exports.deleteEmpleado = async (req, res) => {
    try {
        const empleado = await Empleado.findByIdAndDelete(req.params.id);
        if (!empleado) {
            return res.status(404).json({ error: 'Empleado no encontrado' });
        }
        res.status(200).json({ message: 'Empleado eliminado' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


exports.validarRfcCurpTarjCuenEmpleado = async (req, res) => {
    try {
        const { rfc, curp, tarjeta, cuenta } = req.body;

        // Verificar si ya existe un empleado con el mismo RFC, CURP, Tarjeta o Cuenta
        const empleadoExistente = await Empleado.findOne({
            $or: [
                { rfc: rfc },
                { curp: curp },
                { tarjeta: tarjeta },
                { cuenta: cuenta }
            ]
        });

        if (empleadoExistente) {
            let messages = [];

            // Construir mensajes específicos para cada campo duplicado
            if (empleadoExistente.rfc === rfc) {
                messages.push('El RFC ingresado ya existe.');
            }
            if (empleadoExistente.curp === curp) {
                messages.push('La CURP ingresada ya existe.');
            }
            if (empleadoExistente.tarjeta === tarjeta) {
                messages.push('La tarjeta ingresada ya existe.');
            }
            if (empleadoExistente.cuenta === cuenta) {
                messages.push('La cuenta ingresada ya existe.');
            }

            // Unir todos los mensajes en una sola cadena
            const message = messages.join(' ');

            return res.status(400).json({ message });
        }

        // Crear un nuevo empleado si no se encontraron duplicados
        const nuevoEmpleado = new Empleado(req.body);
        await nuevoEmpleado.save();

        res.status(201).json({
            message: 'Empleado creado exitosamente',
            empleado: nuevoEmpleado
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al crear el empleado',
            error: error.message
        });
    }
};





exports.buscarEmpleado = async(req,res) =>{

    try {
        const { searchQuery } = req.query;
        console.log(searchQuery,"Searh kuery");
        if (!searchQuery) {
            return res.status(400).json({
                message: 'Debe proporcionar una cadena de búsqueda'
            });
        }

        // Crear expresiones regulares para cada campo que buscaremos
        const regex = new RegExp(searchQuery, 'i'); // 'i' hace que sea insensible a mayúsculas y minúsculas

        // Buscar empleados que coincidan en nombre, apePat o apeMat
        const empleados = await Empleado.find({
            $or: [
                { nombre: regex },
                { apePat: regex },
                { apeMat: regex }
            ]
        }).sort({ nombre: 1, apePat: 1, apeMat: 1 }); // Ordenar alfabéticamente

        // Enviar resultados
        res.status(200).json({
            message: `Se encontraron ${empleados.length} empleados que coinciden con la búsqueda`,
            empleados
        });
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al buscar empleados',
            error: error.message
        });
    }
}


