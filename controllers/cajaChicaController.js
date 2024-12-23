const CajaChica = require('../models/CajaChica');
const HojaContable = require('../models/HojaContable');
const express = require('express');
const router = express.Router();

const Movimiento = require('../models/Movimiento');

exports.actualizarFilaCajaChica = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Encuentra y actualiza el movimiento por su ID
    const updatedMovimiento = await Movimiento.findByIdAndUpdate(id, updatedData, {
      new: true, // Devuelve el documento actualizado
    });

    if (!updatedMovimiento) {
      return res.status(404).json({ message: 'Movimiento no encontrado' });
    }

    res.json(updatedMovimiento);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el movimiento' });
  }
};


// Crear una nueva caja chica
exports.crearCajaChica =  async (req, res) => {
    const { idUsuario, mes, anio, nombreCajaChica } = req.body;
  
    try {
      // Buscar si ya existe una Caja Chica para este usuario, mes y año
      const cajaChicaExistente = await CajaChica.findOne({
        idUsuario: idUsuario,
        mes: mes,
        anio: anio
      });
  
      if (cajaChicaExistente) {
        // Si ya existe, retornar un mensaje indicando que no se creó
        return res.status(400).json({
          message: 'Ya existe una Caja Chica para este usuario, mes y año.'
        });
      }
  
      // Si no existe, crear una nueva Caja Chica
      const nuevaCajaChica = new CajaChica({
        nombreCajaChica: nombreCajaChica,
        fechaHoja: new Date(), // O la fecha que necesites
        idUsuario: idUsuario,
        mes: mes,
        anio: anio
      });
  
      // Guardar la nueva Caja Chica en la base de datos
      await nuevaCajaChica.save();
  
      return res.status(201).json({
        message: 'Caja Chica creada exitosamente.',
        cajaChica: nuevaCajaChica
      });
    } catch (error) {
      console.error('Error al crear la Caja Chica:', error);
      return res.status(500).json({
        message: 'Error al procesar la solicitud.',
        error: error.message
      });
    }
  };

// Obtener todas las cajas chicas
exports.obtenerCajasChicas = async (req, res) => {
    try {
        const cajasChicas = await CajaChica.find().populate('idUsuario');
        res.status(200).json(cajasChicas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las cajas chicas', error });
    }
};

// Obtener una caja chica por ID
exports.obtenerCajaChicaPorId = async (req, res) => {
    try {
        const cajaChica = await CajaChica.findById(req.params.id).populate('idUsuario');
        if (!cajaChica) {
            return res.status(404).json({ message: 'Caja chica no encontrada' });
        }
        res.status(200).json(cajaChica);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la caja chica', error });
    }
};

// Actualizar una caja chica
exports.actualizarCajaChica = async (req, res) => {
    try {
        const cajaChicaActualizada = await CajaChica.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!cajaChicaActualizada) {
            return res.status(404).json({ message: 'Caja chica no encontrada' });
        }
        res.status(200).json(cajaChicaActualizada);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la caja chica', error });
    }
};

// Eliminar una caja chica
exports.eliminarCajaChica = async (req, res) => {
    const { id } = req.params;  // El ID de la CajaChica se pasa como parámetro

    try {
        // 1. Verificar si la CajaChica existe
        const cajaChica = await CajaChica.findById(id);

        if (!cajaChica) {
            return res.status(404).json({ error: 'CajaChica no encontrada' });
        }

        // 2. Eliminar los Movimientos asociados a esta CajaChica
        await Movimiento.deleteMany({ idCajaChica: id });  // Eliminar todos los movimientos con ese idCajaChica

        // 3. Eliminar la CajaChica
        await CajaChica.findByIdAndDelete(id);  // Usamos findByIdAndDelete en lugar de remove()

        // 4. Responder con éxito
        res.status(200).json({ message: `CajaChica con ID ${id} y sus movimientos eliminados exitosamente` });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

exports.getCajasChicasByUsuario = async (req, res) => {
    try {
        const { idUsuario } = req.params; // Obtener el idUsuario desde los parámetros de la solicitud

        // Buscar las cajas chicas donde idUsuario coincida
        const cajasChicas = await CajaChica.find({ idUsuario }).populate('idUsuario');

        if (!cajasChicas.length) {
            const placeholderCajaChica = {
                nombreCajaChica: 'No se encontraron hojas para este usuario', // Valores predeterminados para el placeholder
                idUsuario: '', // Usamos el idUsuario que vino en la solicitud
            };
            return res.status(200).json([placeholderCajaChica]);
        }

        // Responder con las cajas chicas encontradas
        res.status(200).json(cajasChicas);
    } catch (error) {
        console.error('Error al obtener cajas chicas:', error);
        res.status(500).json({ message: 'Error al obtener las cajas chicas' });
    }
};


// Busca si existe una hoja contable con los mismos mes y anio que la caja chica para exportar los gastos

exports.buscarHojaContable = async (req, res) => {
    try {
        const { mes, anio } = req.body;
        console.log(mes + " " + anio ,"FECHA");
        // Verificar si existe una hoja de contable con el mismo mes y año
        const hojaContable = await HojaContable.findOne({ mes: mes, anio: anio });
        console.log(hojaContable,"HOJA CONT");
        if (!hojaContable) {
            return res.status(404).json({ message: 'No se encontró ninguna Hoja Contable para este mes y año' });
        }

        return res.status(200).json({ hojaContable });
    } 
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al buscar la Hoja Contable' });
    }
};



exports.obtenerCajasChicasPorAnio =  async (req, res) => {
  const { anio } = req.params;
  try {
      // Validar que el parámetro sea un número
      if (isNaN(anio)) {
          return res.status(400).json({ error: 'El año debe ser un número.' });
      }

      // Buscar las hojas del año especificado
      const hojas = await CajaChica.find({ anio: parseInt(anio, 10) });

      // Responder con los resultados
      if (hojas.length === 0) {
          return res.status(404).json({ message: `No se encontraron hojas para el año ${anio}.` });
      }

      res.status(200).json(hojas);
  } catch (error) {
      console.error('Error al obtener hojas:', error);
      res.status(500).json({ error: 'Error del servidor. Inténtalo más tarde.' });
  }
};


exports.obtenerCajasChicasPorAnioYUsuario = async (req, res) => {
  const { anio, idUsuario } = req.params;

  try {
      // Validar que el parámetro "anio" sea un número
      if (isNaN(anio)) {
          return res.status(400).json({ error: 'El año debe ser un número.' });
      }

      // Validar que "idUsuario" esté presente
      if (!idUsuario) {
          return res.status(400).json({ error: 'El ID del usuario es requerido.' });
      }

      // Buscar las hojas del año y usuario especificados
      const hojas = await CajaChica.find({
          anio: parseInt(anio, 10),
          idUsuario: idUsuario
      }).populate('idUsuario'); // Incluye la información del usuario relacionado

      // Verificar si se encontraron resultados
      if (hojas.length === 0) {
          return res.status(404).json({ message: `No se encontraron hojas para el año ${anio} y usuario ${idUsuario}.` });
      }

      res.status(200).json(hojas);
  } catch (error) {
      console.error('Error al obtener hojas:', error);
      res.status(500).json({ error: 'Error del servidor. Inténtalo más tarde.' });
  }
};


const obtenerMovimientosPorAnio = async (anio) => {
  try {
      // Validar que el parámetro sea un número
      if (isNaN(anio)) {
          throw new Error('El año debe ser un número válido.');
      }

      // Buscar todas las cajas chicas del año especificado
      const cajasChicas = await CajaChica.find({ anio: parseInt(anio, 10) });

      if (cajasChicas.length === 0) {
          throw new Error(`No se encontraron cajas chicas para el año ${anio}.`);
      }

      // Extraer los IDs de las cajas chicas
      const idsCajasChicas = cajasChicas.map(caja => caja._id);

      // Buscar los movimientos relacionados con estas cajas chicas
      const movimientos = await Movimiento.find({ idCajaChica: { $in: idsCajasChicas } });

      if (movimientos.length === 0) {
          throw new Error(`No se encontraron movimientos para las cajas chicas del año ${anio}.`);
      }

      // Retornar los movimientos encontrados
      return movimientos;
  } catch (error) {
      // Propagar el error para que el controlador lo maneje
      throw error;
  }
};




