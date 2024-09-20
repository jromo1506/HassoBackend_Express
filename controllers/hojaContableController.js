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