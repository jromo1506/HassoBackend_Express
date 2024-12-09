const Anno = require('../models/Anualidad');  // Asegúrate de que la ruta sea correcta según la estructura de tu proyecto
const Gasto = require('../models/Gasto');
const Ingreso = require('../models/Ingreso');
const HojaContable = require('../models/HojaContable');

// Crear un nuevo Anno
exports.createAnno = async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();  // Obtener el año actual
        
        // Verificar si ya existe un Anno con el mismo año
        const existingAnno = await Anno.findOne({ anio: currentYear });

        if (existingAnno) {
            return res.status(400).json({ message: `El año ${currentYear} ya está registrado` });
        }

        // Si no existe, crear un nuevo Anno con el año actual
        const newAnno = new Anno({
            anio: currentYear,
            total_Ingresos: 0,  // Valor por defecto
            totalImpuestosEspeciales_Ingresos: 0,  // Valor por defecto
            totalImporte_Ingresos: 0,  // Valor por defecto
            totalIVA_Ingresos: 0,  // Valor por defecto
            total_Gastos: 0,  // Valor por defecto
            totalImpuestos_Gastos: 0,  // Valor por defecto
            totalImporte_Gastos: 0,  // Valor por defecto
            totalIVA_Gatsos: 0,  // Valor por defecto
            totalIngresos_IVA: 0,  // Valor por defecto
            totalegresos_IVA: 0,  // Valor por defecto
            total_IVA: 0,  // Valor por defecto
            pagoISR_IVA: 0  // Valor por defecto
        });

        await newAnno.save();
        res.status(201).json(newAnno);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el año', error });
    }
};
// Obtener todos los Annos
exports.getAllAnnos = async (req, res) => {
    try {
        const annos = await Anno.find();
        res.status(200).json(annos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los años', error });
    }
};

// Obtener un Anno por su ID
exports.getAnnoById = async (req, res) => {
    try {
        const anno = await Anno.findById(req.params.id);
        if (!anno) {
            return res.status(404).json({ message: 'Anno no encontrado' });
        }
        res.status(200).json(anno);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el año', error });
    }
};

// Actualizar un Anno por su ID
exports.updateAnno = async (req, res) => {
    try {
        const updatedAnno = await Anno.findByIdAndUpdate(
            req.params.id,
            req.body,  // Usamos directamente req.body
            { new: true } // Devuelve el documento actualizado
        );

        if (!updatedAnno) {
            return res.status(404).json({ message: 'Anno no encontrado para actualizar' });
        }
        res.status(200).json(updatedAnno);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el año', error });
    }
};

// Eliminar un Anno por su ID
exports.deleteAnno = async (req, res) => {
    try {
        const deletedAnno = await Anno.findByIdAndDelete(req.params.id);
        if (!deletedAnno) {
            return res.status(404).json({ message: 'Anno no encontrado para eliminar' });
        }
        res.status(200).json({ message: 'Anno eliminado con éxito', deletedAnno });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el año', error });
    }
};





exports.calcularTotalesAnno = async (req, res) => {
    try {
        const { anio } = req.params;

        if (!anio || isNaN(anio)) {
            return res.status(400).json({ message: 'El año es inválido o no proporcionado.' });
        }

        // Buscar hojas contables del año especificado
        const hojasContables = await HojaContable.find({ anio });

        if (!hojasContables.length) {
            return res.status(404).json({ message: 'No se encontraron hojas contables para el año especificado.' });
        }

        const hojasContablesIds = hojasContables.map(hoja => hoja._id);

        // Buscar y calcular los totales de gastos e ingresos
        const gastos = await Gasto.find({ idHojaContable: { $in: hojasContablesIds } });
        const ingresos = await Ingreso.find({ idHojaContable: { $in: hojasContablesIds } });

        // Calcular totales de impuestos especiales
        const totalImpuestosEspeciales_Ingresos = ingresos.reduce((acc, ingreso) => acc + (ingreso.impEsp || 0), 0);
        const totalImpuestosEspeciales_Gastos = gastos.reduce((acc, gasto) => acc + (gasto.impEsp || 0), 0);

        // Otros cálculos
        const totalIVA_Gastos = gastos.reduce((acc, gasto) => acc + (gasto.IVA || 0), 0);
        const totalIVA_Ingresos = ingresos.reduce((acc, ingreso) => acc + (ingreso.IVA || 0), 0);

        const totalIngresos_IVA = totalIVA_Ingresos;
        const totalEgresos_IVA = totalIVA_Gastos;
        const total_IVA = totalIngresos_IVA - totalEgresos_IVA;

        const pagoISR_IVA = (1 * totalIngresos_IVA / 0.16) * 0.3 * 0.0125;

        const totalImporte_Ingresos = ingresos.reduce((acc, ingreso) => acc + (ingreso.importe || 0), 0);
        const totalImporte_Gastos = gastos.reduce((acc, gasto) => acc + (gasto.importe || 0), 0);
        const total_Gastos = gastos.reduce((acc, gasto) => acc + (gasto.total || 0), 0);
        const total_Ingresos = ingresos.reduce((acc, ingreso) => acc + (ingreso.total || 0), 0);

        // Buscar o crear el registro del año en Anno
        let anno = await Anno.findOne({ anio });

        if (!anno) {
            anno = new Anno({ anio });
        }

        // Asignar valores calculados
        anno.total_Ingresos = total_Ingresos;
        anno.totalIVA_Ingresos = totalIVA_Ingresos;
        anno.totalImporte_Ingresos = totalImporte_Ingresos;
        anno.totalImpuestosEspeciales_Ingresos = totalImpuestosEspeciales_Ingresos;

        anno.total_Gastos = total_Gastos;
        anno.totalIVA_Gatsos = totalIVA_Gastos;
        anno.totalImporte_Gastos = totalImporte_Gastos;
        anno.totalImpuestosEspeciales_Gastos = totalImpuestosEspeciales_Gastos;

        anno.totalIngresos_IVA = totalIngresos_IVA;
        anno.totalegresos_IVA = totalEgresos_IVA;
        anno.total_IVA = total_IVA;
        anno.pagoISR_IVA = pagoISR_IVA;

        await anno.save();

        res.status(200).json({ message: 'Totales calculados y guardados correctamente', anno });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al calcular y guardar los totales', error });
    }
};


exports.obtenerAnnoByAnio = async (req, res) => {
    const { anio } = req.params; // Obtiene el parámetro 'anio' de la URL
    console.log(anio);
    try {
        const anno = await Anno.findOne({ anio: Number(anio) }); // Busca el documento con el año proporcionado
        if (!anno) {
            return res.status(404).json({ message: 'Anno no encontrado' });
        }
        res.json(anno);
    } catch (error) {
        res.status(500).json({ message: 'Error al buscar el anno', error: error.message });
    }
};
