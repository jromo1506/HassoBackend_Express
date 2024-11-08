const Ingreso = require('../models/Ingreso');

// Crear un nuevo Ingreso
exports.crearIngreso = async (req, res) => {
console.log(req.body);


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
        console.log(req.body,"EDITAR INGRESO");
        console.log(req.params.id,"EDITAR INGRESO");
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


exports.checarIngreso = async (req, res) => {
    try {
        const ingreso = req.body;
        const { RFC, folio, idHojaContable } = ingreso;

        // Verificar si ya existe un ingreso con el mismo RFC y folio
        const ingresoDuplicadoAmbos = await Ingreso.findOne({
            idHojaContable,
            $or: [{ RFC }, { folio }]
        });
        if (ingresoDuplicadoAmbos) {
            return res.status(400).json({ message: 'Ya existe un ingreso con el mismo RFC o folio.' });
        }

        // // Verificar si ya existe un ingreso con el mismo RFC
        // const ingresoDuplicadoRFC = await Ingreso.findOne({ RFC });
        // if (ingresoDuplicadoRFC) {
        //     return res.status(400).json({ message: 'Ya existe un ingreso con el mismo RFC.' });
        // }

        // // Verificar si ya existe un ingreso con el mismo folio
        // const ingresoDuplicadoFolio = await Ingreso.findOne({ folio });
        // if (ingresoDuplicadoFolio) {
        //     return res.status(400).json({ message: 'Ya existe un ingreso con el mismo folio.' });
        // }

        // Crear y guardar el nuevo ingreso si no está duplicado
        const nuevoIngreso = new Ingreso(ingreso);
        await nuevoIngreso.save();

        res.status(201).json(nuevoIngreso);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al guardar el ingreso.' });
    }
};


exports.createIngresoVerificarRFC = async (req, res) => {
    try {
        const { RFC, pedido, idHojaContable, ...restData } = req.body;

        // Verificar duplicidad de RFC o pedido en el mismo idHojaContable
        const existingIngreso = await Ingreso.findOne({
            idHojaContable,
            $or: [{ RFC }, { pedido }]
        });
        if (existingIngreso) {
            return res.status(400).json({ message: 'Ingreso duplicado. Ya existe un ingreso con el mismo RFC o pedido en esta hoja contable.' });
        }

        const newIngreso = new Ingreso({ RFC, pedido, idHojaContable, ...restData });
        await newIngreso.save();

        res.status(201).json(newIngreso);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el ingreso', error });
    }
};


exports.editIngreso = async (req,res) => {
 
    try{
       
        const IngresoActualizado = await Usuario.findByIdAndUpdate(req.params.id,req.body,{new:true})
        if (!IngresoActualizado) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json(IngresoActualizado);
    }
    catch(err){
        res.status(500).json({ message: 'Error al actualizar el usuario', error });
    }
}
