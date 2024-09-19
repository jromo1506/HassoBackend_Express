const express = require('express');
const router = express.Router();

const empleadoController = require('../controllers/empleadoController');
const horasTrabajadasController = require('../controllers/horasTrabajadasController');
const proyectoController = require('../controllers/proyectoController');
const semanaController = require('../controllers/semanaController');
const usuarioController = require('../controllers/usuarioController');
const movimientoController = require('../controllers/movimientoController');
const cajaChicaController = require('../controllers/cajaChicaController');
const hojaContableController = require('../controllers/hojaContableController');
const ingresoController = require('../controllers/ingresoController');
const gastoController = require('../controllers/gastoController');

// EMPLEADO
router.post('/empleados', empleadoController.createEmpleado);
router.get('/empleados', empleadoController.getEmpleados);
router.get('/empleados/:id', empleadoController.getEmpleadoById);
router.put('/empleados/:id', empleadoController.updateEmpleado);
router.delete('/empleados/:id', empleadoController.deleteEmpleado);

// PROYECTO
router.post('/proyectos', proyectoController.createProyecto);
router.get('/proyectos', proyectoController.getProyectos);
router.get('/proyectos/:id', proyectoController.getProyectoById);
router.put('/proyectos/:id', proyectoController.updateProyecto);
router.delete('/proyectos/:id', proyectoController.deleteProyecto);


// HORA TRABAJADA
router.post('/horas-trabajadas', horasTrabajadasController.createHorasTrabajadas);
router.get('/horas-trabajadas', horasTrabajadasController.getHorasTrabajadas);
router.get('/horas-trabajadas/:id', horasTrabajadasController.getHorasTrabajadasById);
router.put('/horas-trabajadas/:id', horasTrabajadasController.updateHorasTrabajadas);
router.delete('/horas-trabajadas/:id', horasTrabajadasController.deleteHorasTrabajadas);

// SEMANA
router.post('/semanas', semanaController.createSemana);
router.get('/semanas', semanaController.getSemanas);
router.get('/semanas/:id', semanaController.getSemanaById);
router.put('/semanas/:id', semanaController.updateSemana);
router.delete('/semanas/:id', semanaController.deleteSemana);

// USUARIOS
router.post('/usuarios', usuarioController.crearUsuario);
router.post('/usuarios/auth',usuarioController.autenticarUsuario);
router.get('/usuarios', usuarioController.obtenerUsuarios);
router.get('/usuarios/:id', usuarioController.obtenerUsuarioPorId);
router.put('/usuarios/:id', usuarioController.actualizarUsuario);
router.delete('/usuarios/:id', usuarioController.eliminarUsuario);

// CAJA CHICA
router.post('/cajas-chicas', cajaChicaController.crearCajaChica);
router.get('/cajas-chicas', cajaChicaController.obtenerCajasChicas);
router.get('/cajas-chicas/:id', cajaChicaController.obtenerCajaChicaPorId);
router.put('/cajas-chicas/:id', cajaChicaController.actualizarCajaChica);
router.delete('/cajas-chicas/:id', cajaChicaController.eliminarCajaChica);

// MOVIMEINTO
router.post('/movimientos', movimientoController.crearMovimiento);
router.get('/movimientos', movimientoController.obtenerMovimientos);
router.get('/movimientos/:id', movimientoController.obtenerMovimientoPorId);
router.put('/movimientos/:id', movimientoController.actualizarMovimiento);
router.delete('/movimientos/:id', movimientoController.eliminarMovimiento);

// HOJA CONTABLE
router.post('/hojaContable', hojaContableController.crearHojaContable);
router.get('/hojaContable', hojaContableController.obtenerHojasContables);
router.get('/hojaContable/:id', hojaContableController.obtenerHojaContablePorId);
router.put('/hojaContable/:id', hojaContableController.actualizarHojaContable);
router.delete('/hojaContable/:id', hojaContableController.eliminarHojaContable);

// GASTO CONTROLLER
router.post('/gasto', gastoController.crearGasto);
router.get('/gasto', gastoController.obtenerGastos);
router.get('/gasto/:id', gastoController.obtenerGastoPorId);
router.put('/gasto/:id', gastoController.actualizarGasto);
router.delete('/gasto/:id', gastoController.eliminarGasto);



// INGRESOS
router.post('/ingreso', ingresoController.crearIngreso);
router.get('/ingreso', ingresoController.obtenerIngresos);
router.get('/ingreso/:id', ingresoController.obtenerIngresoPorId);
router.put('/ingreso/:id', ingresoController.actualizarIngreso);
router.delete('/ingreso/:id', ingresoController.eliminarIngreso);






module.exports = router;
