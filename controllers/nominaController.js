const mongoose = require('mongoose');

const {Schema } = mongoose;



const Nomina = require('../models/Nomina');
const HorasTrabajadas = require('../models/HorasTrabajadas');
// Crear una nueva nómina
exports.createNomina = async (req, res) => {
    try {
        const { idEmpleado, idSemana } = req.body;

        // Verificar si ya existe una nómina con el mismo idEmpleado y idSemana
        const existeNomina = await Nomina.findOne({ idEmpleado, idSemana });
        if (existeNomina) {
            return res.status(400).json({
                message: 'Ya existe una nómina registrada para este empleado en esta semana',
            });
        }

        // Crear la nueva nómina si no existe
        const nuevaNomina = new Nomina(req.body);
        const nominaGuardada = await nuevaNomina.save();
        res.status(201).json(nominaGuardada);
    } catch (error) {
        res.status(400).json({ message: 'Error al crear la nómina', error });
    }
};

exports.verificarOCrearNomina = async (req, res) => {
    const { idSemana, idEmpleado, ...nominaData } = req.body;

    try {
        // Verificar si ya existe una nómina con el mismo idSemana y idEmpleado
        const existingNomina = await Nomina.findOne({ idSemana, idEmpleado });
        
        if (existingNomina) {
            return res.status(400).json({ message: "La nómina ya existe para el idSemana e idEmpleado especificados." });
        }

        // Si no existe, crea una nueva nómina con los datos recibidos
        const nuevaNomina = new Nomina({ idSemana, idEmpleado, ...nominaData });
        await nuevaNomina.save();

        return res.status(201).json({ message: "Nómina creada exitosamente.", nomina: nuevaNomina });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al crear la nómina.", error });
    }
};

// Obtener todas las nóminas
exports.getNominas = async (req, res) => {
    try {
        const nominas = await Nomina.find();
        res.status(200).json(nominas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las nóminas', error });
    }
};

// Obtener una nómina por ID
exports.getNominaById = async (req, res) => {
    try {
        const { idSemana, idEmpleado } = req.params;
        const nomina = await Nomina.findOne({ idSemana, idEmpleado });
        if (!nomina) {
            return res.status(404).json({ message: 'Nómina no encontrada' });
        }
        res.status(200).json(nomina);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la nómina', error });
    }
};

// Actualizar una nómina por ID
exports.updateNomina = async (req, res) => {
    try {
        const { idSemana, idEmpleado } = req.params;
        const nominaActualizada = await Nomina.findOneAndUpdate(
            { idSemana, idEmpleado },
            req.body,
            { new: true } // Devuelve el documento actualizado
        );
        if (!nominaActualizada) {
            return res.status(404).json({ message: 'Nómina no encontrada' });
        }
        res.status(200).json(nominaActualizada);
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar la nómina', error });
    }
};

// Eliminar una nómina por ID

exports.deleteNomina = async (req, res) => {
    try {
        const { idSemana, idEmpleado } = req.params;

        // Eliminar la nómina correspondiente
        const nominaEliminada = await Nomina.findOneAndDelete({ idSemana, idEmpleado });
        if (!nominaEliminada) {
            return res.status(404).json({ message: 'Nómina no encontrada' });
        }

        // Eliminar todas las horas trabajadas correspondientes a la misma idSemana y idEmpleado
        const horasEliminadas = await HorasTrabajadas.deleteMany({ idSemana, idEmpleado });

        res.status(200).json({ 
            message: 'Nómina y horas trabajadas eliminadas correctamente',
            detalles: {
                nominaEliminada,
                horasEliminadas: horasEliminadas.deletedCount // Cantidad de documentos eliminados
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la nómina y horas trabajadas', error });
    }
};


exports.getNominasBySemana = async (req, res) => {
    try {
        const { idSemana } = req.params;
        const nominas = await Nomina.find({ idSemana });
        if (nominas.length === 0) {
            return res.status(404).json({ message: 'No se encontraron nóminas para esta semana' });
        }
        res.status(200).json(nominas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las nóminas', error });
    }
};


// NUEVAS FUNCIONES NOMINAS

exports.getNominaByIdNomina = async(req,res)=>{
    try{
        const nomina = await Nomina.findById(req.params.id);
        if (!nomina) {
            return res.status(404).json({ message: 'Nomina not found' });
        }
        res.status(200).json(nomina);
    }
    catch(error){
        res.status(500).json({ message: 'Error al obtener las nóminas', error });
    }
}

exports.putNominaByIdNomina = async(req,res)=>{
    const { id } = req.params; // Obtener el _id de la URL
    const nuevosCampos = req.body; // Obtener los campos a actualizar desde el cuerpo de la solicitud
  
    try {
      const nominaActualizada = await Nomina.findByIdAndUpdate(
        id,
        { $set: nuevosCampos }, // Actualizar solo los campos especificados
        { new: true, runValidators: true } // Retorna el documento actualizado y valida
      );
  
      if (!nominaActualizada) {
        return res.status(404).json({ mensaje: 'Nómina no encontrada' });
      }
  
      res.status(200).json(nominaActualizada);
    } catch (error) {
      console.error('Error al actualizar la nómina:', error);
      res.status(500).json({ mensaje: 'Error al actualizar la nómina', error });
    }
}



exports.alternarCalculadoNomina = async (req, res) => {
    const { idNomina } = req.params;

    try {
        // Buscar la nómina por _id
        const nomina = await Nomina.findById(idNomina);
        if (!nomina) {
            return res.status(404).json({ message: 'Nómina no encontrada.' });
        }

        // Alternar el valor de 'calculado'
        nomina.calculado = !nomina.calculado;
        await nomina.save();

        return res.status(200).json({
            message: 'Estado de calculado alternado correctamente.',
            calculado: nomina.calculado
        });
    } catch (error) {
        console.error('Error al alternar el estado de calculado:', error);
        return res.status(500).json({ message: 'Error al alternar el estado de calculado.', error });
    }
};