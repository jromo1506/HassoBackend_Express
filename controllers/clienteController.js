const Cliente = require('../models/Cliente');

// Crear un nuevo cliente
exports.crearCliente = async (req, res) => {
    try {
        const cliente = new Cliente(req.body);
        const nuevoCliente = await cliente.save();
        res.status(201).json(nuevoCliente);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear el cliente', error });
    }
};

// Obtener todos los clientes
exports.obtenerClientes = async (req, res) => {
    try {
        const clientes = await Cliente.find().populate('idMovimiento');
        res.status(200).json(clientes);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los clientes', error });
    }
};

// Obtener un cliente por su ID
exports.obtenerClientePorId = async (req, res) => {
    try {
        const cliente = await Cliente.findById(req.params.id).populate('idMovimiento');
        if (!cliente) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }
        res.status(200).json(cliente);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el cliente', error });
    }
};

// Actualizar un cliente por su ID
exports.actualizarCliente = async (req, res) => {
    try {
        const clienteActualizado = await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!clienteActualizado) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }
        res.status(200).json(clienteActualizado);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar el cliente', error });
    }
};

// Eliminar un cliente por su ID
exports.eliminarCliente = async (req, res) => {
    try {
        const clienteEliminado = await Cliente.findByIdAndDelete(req.params.id);
        if (!clienteEliminado) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }
        res.status(200).json({ mensaje: 'Cliente eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el cliente', error });
    }
};