const Usuario = require('../models/Usuario');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');




// Crear un nuevo usuario
exports.crearUsuario = async (req, res) => {
    try {
        // Verifica si el usuario ya existe
        const usuarioExistente = await Usuario.findOne({ usuario: req.body.usuario });

        if (usuarioExistente) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        const saltRounds = 10; // Define el número de rondas de cifrado
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        // Crea el nuevo usuario con la contraseña cifrada
        const nuevoUsuario = new Usuario({
            usuario: req.body.usuario,
            password: hashedPassword,
            nivelUsuario: req.body.nivelUsuario
        });

        await nuevoUsuario.save();
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el usuario', error });
    }
};
exports.autenticarUsuario = async(req,res) =>{
    const { usuario, password } = req.body;

    try {
        const usuarioEncontrado = await Usuario.findOne({ usuario });

        if (!usuarioEncontrado) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const esValidaLaPassword = await bcrypt.compare(password, usuarioEncontrado.password);
       
        if (!esValidaLaPassword) {
            
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        res.status(200).json({
            message: 'Autenticación exitosa',
            usuario: {
                id: usuarioEncontrado._id,
                usuario: usuarioEncontrado.usuario,
                nivelUsuario: usuarioEncontrado.nivelUsuario,
            }
        });
    } catch (error) {
        console.error('Error al autenticar el usuario:', error);  // Registra el error en el servidor
        res.status(500).json({ message: 'Error al autenticar el usuario', error: error.message });
    }
}

// Obtener todos los usuarios
exports.obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los usuarios', error });
    }
};

// Obtener un usuario por ID
exports.obtenerUsuarioPorId = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el usuario', error });
    }
};

// Actualizar un usuario
exports.actualizarUsuario = async (req, res) => {
    try {
        const usuarioActualizado = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!usuarioActualizado) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json(usuarioActualizado);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el usuario', error });
    }
};

// Eliminar un usuario
exports.eliminarUsuario = async (req, res) => {
    try {
        const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
        if (!usuarioEliminado) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json({ message: 'Usuario eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el usuario', error });
    }
};