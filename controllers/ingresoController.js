const Ingreso = require('../models/Ingreso');

// Crear un nuevo Ingreso
exports.crearIngreso = async (req, res) => {
    try {
        const nuevoIngreso = new Ingreso(req.body);
        await nuevoIngreso.save();
        res.status(201).json(nuevoIngreso);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener todos los Ingresos
exports.obtenerIngresos = async (req, res) => {
    try {
        const ingresos = await Ingreso.find();
        res.status(200).json(ingresos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un Ingreso por ID
exports.obtenerIngresoPorId = async (req, res) => {
    try {
        const ingreso = await Ingreso.findById(req.params.id);
        if (!ingreso) {
            return res.status(404).json({ error: 'Ingreso no encontrado' });
        }
        res.status(200).json(ingreso);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar un Ingreso
exports.actualizarIngreso = async (req, res) => {
    try {
        const ingresoActualizado = await Ingreso.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!ingresoActualizado) {
            return res.status(404).json({ error: 'Ingreso no encontrado' });
        }
        res.status(200).json(ingresoActualizado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar un Ingreso
exports.eliminarIngreso = async (req, res) => {
    try {
        const ingresoEliminado = await Ingreso.findByIdAndDelete(req.params.id);
        if (!ingresoEliminado) {
            return res.status(404).json({ error: 'Ingreso no encontrado' });
        }
        res.status(200).json({ message: 'Ingreso eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getIngresosByHojaContable = async (req, res) => {
    try {
        const { id } = req.params;
        const ingresos = await Ingreso.find({ idHojaContable: id });

        if (ingresos.length === 0) {
            const defaultIngreso = {
                obra: "",
                fechaPago: "",
                concepto: "",
                total: 0,
                importe: 0,
                IVA: 0,
                fechaFactura: "",
                cliente: "",
                RFC: "",
                pedido: "",
                idHojaContable: ""
            };
            return res.json([defaultIngreso]);
        }

        res.json(ingresos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los ingresos', error });
    }
};
