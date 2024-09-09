const express = require('express');
const router = express.Router();

const empleadoController = require('../controllers/empleadoController');
const horasTrabajadasController = require('../controllers/horasTrabajadasController');
const proyectoController = require('../controllers/proyectoController');
const semanaController = require('../controllers/semanaController');
const usuarioController = require('../controllers/usuarioController');
const movimientoController = require('../controllers/movimientoController');
const cajaChicaController = require('../controllers/cajaChicaController');



router.post('/empleados', empleadoController.createEmpleado);
router.get('/empleados', empleadoController.getEmpleados);
router.get('/empleados/:id', empleadoController.getEmpleadoById);
router.put('/empleados/:id', empleadoController.updateEmpleado);
router.delete('/empleados/:id', empleadoController.deleteEmpleado);

router.post('/proyectos', proyectoController.createProyecto);
router.get('/proyectos', proyectoController.getProyectos);
router.get('/proyectos/:id', proyectoController.getProyectoById);
router.put('/proyectos/:id', proyectoController.updateProyecto);
router.delete('/proyectos/:id', proyectoController.deleteProyecto);

router.post('/horas-trabajadas', horasTrabajadasController.createHorasTrabajadas);
router.get('/horas-trabajadas', horasTrabajadasController.getHorasTrabajadas);
router.get('/horas-trabajadas/:id', horasTrabajadasController.getHorasTrabajadasById);
router.put('/horas-trabajadas/:id', horasTrabajadasController.updateHorasTrabajadas);
router.delete('/horas-trabajadas/:id', horasTrabajadasController.deleteHorasTrabajadas);

router.post('/semanas', semanaController.createSemana);
router.get('/semanas', semanaController.getSemanas);
router.get('/semanas/:id', semanaController.getSemanaById);
router.put('/semanas/:id', semanaController.updateSemana);
router.delete('/semanas/:id', semanaController.deleteSemana);


router.post('/usuarios', usuarioController.crearUsuario);
router.post('/usuarios/auth',usuarioController.autenticarUsuario);
router.get('/usuarios', usuarioController.obtenerUsuarios);
router.get('/usuarios/:id', usuarioController.obtenerUsuarioPorId);
router.put('/usuarios/:id', usuarioController.actualizarUsuario);
router.delete('/usuarios/:id', usuarioController.eliminarUsuario);


router.post('/cajas-chicas', cajaChicaController.crearCajaChica);
router.get('/cajas-chicas', cajaChicaController.obtenerCajasChicas);
router.get('/cajas-chicas/:id', cajaChicaController.obtenerCajaChicaPorId);
router.put('/cajas-chicas/:id', cajaChicaController.actualizarCajaChica);
router.delete('/cajas-chicas/:id', cajaChicaController.eliminarCajaChica);


router.post('/movimientos', movimientoController.crearMovimiento);
router.get('/movimientos', movimientoController.obtenerMovimientos);
router.get('/movimientos/:id', movimientoController.obtenerMovimientoPorId);
router.put('/movimientos/:id', movimientoController.actualizarMovimiento);
router.delete('/movimientos/:id', movimientoController.eliminarMovimiento);




module.exports = router;
