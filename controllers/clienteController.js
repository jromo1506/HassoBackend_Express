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

exports.buscarCliente = async (req, res) => {
    try {
        const { searchQuery } = req.query;

        if (!searchQuery) {
            return res.status(400).json({
                message: 'Debe proporcionar una cadena de búsqueda'
            });
        }

        // Crear expresión regular para la búsqueda insensible a mayúsculas y minúsculas
        const regex = new RegExp(searchQuery, 'i');

        // Buscar clientes que coincidan en nombre o rfc
        const clientes = await Cliente.find({
            $or: [
                { nombre: regex },
                { rfc: regex }
            ]
        }).sort({ nombre: 1 }); // Ordenar alfabéticamente por nombre

        // Enviar resultados
        res.status(200).json({
            message: `Se encontraron ${clientes.length} clientes que coinciden con la búsqueda`,
            clientes
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al buscar clientes',
            error: error.message
        });
    }
};