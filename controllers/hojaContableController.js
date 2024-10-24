const HojaContable = require('../models/HojaContable');

// Crear una nueva Hoja Contable
exports.crearHojaContable = async (req, res) => {
    console.log(req.body)
    try {
        const nuevaHoja = new HojaContable(req.body);
        await nuevaHoja.save();
        res.status(201).json(nuevaHoja);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
};

// Obtener todas las Hojas Contables
exports.obtenerHojasContables = async (req, res) => {
    try {
        const hojas = await HojaContable.find().populate('fechaHoja');
        res.status(200).json(hojas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener una Hoja Contable por ID
exports.obtenerHojaContablePorId = async (req, res) => {
    try {
        const hoja = await HojaContable.findById(req.params.id).populate('fechaHoja');
        if (!hoja) {
            return res.status(404).json({ error: 'Hoja Contable no encontrada' });
        }
        res.status(200).json(hoja);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar una Hoja Contable
exports.actualizarHojaContable = async (req, res) => {
    try {
        const hojaActualizada = await HojaContable.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!hojaActualizada) {
            return res.status(404).json({ error: 'Hoja Contable no encontrada' });
        }
        res.status(200).json(hojaActualizada);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar una Hoja Contable
exports.eliminarHojaContable = async (req, res) => {
    try {
        const hojaEliminada = await HojaContable.findByIdAndDelete(req.params.id);
        if (!hojaEliminada) {
            return res.status(404).json({ error: 'Hoja Contable no encontrada' });
        }
        res.status(200).json({ message: 'Hoja Contable eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getHojasContablesByUsuario = async (req, res) => {
    try {
        const { idUsuario } = req.params; // Obtener el idUsuario desde los parámetros de la solicitud

        // Buscar las hojas contables donde idUsuario coincida (puede ser null o undefined si no es requerido)
        const hojasContables = await HojaContable.find({ idUsuario }).populate('idUsuario');

        if (!hojasContables.length) {
            const placeholderHojaContable = {
                nombreHoja: '', // Valores predeterminados para el placeholder
                fechaHoja: Date(), // Fecha actual como valor de placeholder
                idUsuario: idUsuario || null // Usar el idUsuario que vino en la solicitud, o null si no es requerido
            };
            return res.status(200).json([placeholderHojaContable]);
        }

        // Responder con las hojas contables encontradas
        res.status(200).json(hojasContables);
    } catch (error) {
        console.error('Error al obtener hojas contables:', error);
        res.status(500).json({ message: 'Error al obtener las hojas contables' });
    }
};


// Checa si ya hay una hoja Contable con el mismo mes y año
exports.verificarHojaContableActual = async (req, res) => {
    try {
        // Obtener el mes y año actual
        const fechaActual = new Date();
        const mesActual = fechaActual.toLocaleString('default', { month: 'long' });  // Obtiene el mes como string (Ej: 'October')
        const anioActual = fechaActual.getFullYear();  // Obtiene el año (Ej: 2024)

        // Buscar si existe una hoja contable con el mes y año actual
        const hojaContableExistente = await HojaContable.findOne({ mes: mesActual, anio: anioActual });

        if (hojaContableExistente) {
            return res.status(200).json({
                existe: true,
                message: 'Ya existe una hoja contable para el mes y año actual.',
                hojaContable: hojaContableExistente
            });
        } else {
            return res.status(200).json({
                existe: false,
                message: 'No existe ninguna hoja contable para el mes y año actual.'
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error al verificar la existencia de la hoja contable.'
        });
    }
};


