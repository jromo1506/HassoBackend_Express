const Solicitud = require('../models/Solicitud');

// Crear una nueva solicitud
exports.createSolicitud = async (req, res) => {
    try {
        const { idUsuario, idCajachica } = req.body;
        const newSolicitud = new Solicitud({
            idUsuario,
            idCajachica
        });
        const savedSolicitud = await newSolicitud.save();
        res.status(201).json(savedSolicitud);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la solicitud', error });
    }
};

// Obtener todas las solicitudes
exports.getSolicitudes = async (req, res) => {
    try {
        const solicitudes = await Solicitud.find();
        res.status(200).json(solicitudes);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las solicitudes', error });
    }
};

// Obtener una solicitud por ID
exports.getSolicitudById = async (req, res) => {
    try {
        const solicitud = await Solicitud.findById(req.params.id);
        if (!solicitud) {
            return res.status(404).json({ message: 'Solicitud no encontrada' });
        }
        res.status(200).json(solicitud);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la solicitud', error });
    }
};

// Actualizar una solicitud
exports.updateSolicitud = async (req, res) => {
    try {
        const { idUsuario, idCajachica } = req.body;
        const updatedSolicitud = await Solicitud.findByIdAndUpdate(
            req.params.id,
            { idUsuario, idCajachica },
            { new: true, runValidators: true }
        );
        if (!updatedSolicitud) {
            return res.status(404).json({ message: 'Solicitud no encontrada' });
        }
        res.status(200).json(updatedSolicitud);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la solicitud', error });
    }
};

// Eliminar una solicitud
exports.deleteSolicitud = async (req, res) => {
    try {
        const deletedSolicitud = await Solicitud.findByIdAndDelete(req.params.id);
        if (!deletedSolicitud) {
            return res.status(404).json({ message: 'Solicitud no encontrada' });
        }
        res.status(200).json({ message: 'Solicitud eliminada' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la solicitud', error });
    }
};
