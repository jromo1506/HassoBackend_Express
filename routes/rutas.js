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
const proveedorController = require('../controllers/proveedorController');
const nominaController = require('../controllers/nominaController');
const clienteController = require('../controllers/clienteController');
const solicitudController = require('../controllers/solicitudController');

// EMPLEADO
router.post('/empleados', empleadoController.createEmpleado);
router.get('/empleados', empleadoController.getEmpleadosDesp);
router.get('/empleados/:id', empleadoController.getEmpleadoById);
router.put('/empleados/:id', empleadoController.updateEmpleado);
router.delete('/empleados/:id', empleadoController.deleteEmpleado);
router.post('/empleados/validarRepetidos',empleadoController.validarRfcCurpTarjCuenEmpleado);
router.get('/buscaEmpleado', empleadoController.buscarEmpleado);
router.put('/despedirEmpleado/:id',empleadoController.despedirEmpleado);


// PROYECTO
router.post('/proyectos', proyectoController.createProyecto);
router.get('/proyectos', proyectoController.getProyectos);
router.get('/proyectos/:id', proyectoController.getProyectoById);
router.put('/proyectos/:id', proyectoController.updateProyecto);
router.delete('/proyectos/:id', proyectoController.deleteProyecto);
router.get('/buscaProyecto',proyectoController.buscarProyecto);


// HORA TRABAJADA

router.post('/horas-trabajadas', horasTrabajadasController.createHorasTrabajadas);
router.get('/horas-trabajadas', horasTrabajadasController.getHorasTrabajadas);
router.get('/horas-trabajadas/:id', horasTrabajadasController.getHorasTrabajadasById);
router.put('/horas-trabajadas/:id', horasTrabajadasController.updateHorasTrabajadas);
router.delete('/horas-trabajadas/:id', horasTrabajadasController.deleteHorasTrabajadas);
router.get('/horas-trabajadas/horas-semanales/:idSemana',horasTrabajadasController.getHorasDeSemanaPorId);
router.get('/horas-trabajadas/:idSemana/:idEmpleado', horasTrabajadasController.getHorasBySemanaAndEmpleado);
router.get('/obtenerHorasMesAnio/:mes/:ano', horasTrabajadasController.getHorasPorMesYAnio);
router.get('/obtenerHorasSemana/:idSemana', horasTrabajadasController.getHorasBySemana);
router.post('/darDeAltaHorasRegExtras',horasTrabajadasController.darDeAltaHorasRegularesExtras);
router.delete('/deleteHorasValidandoSiHayxtras/:id', horasTrabajadasController.deleteHorasValidandoSiHayExtras)
router.put('/calcularNomina/:idSemana/:idEmpleado',horasTrabajadasController.calcularTotalNomina);
router.get('/obtenerSumaHoras/:idSemana/:idEmpleado',horasTrabajadasController.obtenerPagoTotalHoras);




// SEMANA
router.post('/semanas', semanaController.createSemanaDebug);
router.get('/semanas', semanaController.getSemanas);
router.get('/semanas/:id', semanaController.getSemanaById);
router.put('/semanas/:id', semanaController.updateSemana);
router.delete('/semanas/:id', semanaController.deleteSemana);
router.post('/semanas/verificar',semanaController.buscarSemana);
router.delete('/eliminaNominasHoras/:idSemana',semanaController.eliminarNominasHorasYSemana);

// Nuevas funciones de nominas
router.get('/ObtenerNominasHorasDeSemanaSinFormato/:idSemana',semanaController.obtenerNominasDeUnaSemanaJuntoConSusHoras);
router.get('/ObtenerNominasHorasDeSemana/:idSemana',semanaController.obtenerNominasDeUnaSemanaConHorasPorDia);


// router.get('/ObtenerNominasHorasDeSemanaSeparadasPorDia/:idSemana',semanaController.obtenerNominasDeUnaSemanaConHorasPorDia);



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
router.put('/cajas-chicas/:id', cajaChicaController.actualizarFilaCajaChica);
router.delete('/cajas-chicas/:id', cajaChicaController.eliminarCajaChica);
router.get('/cajas-chicas/usuario/:idUsuario',cajaChicaController.getCajasChicasByUsuario);
router.post('/cajas-chicas/buscarHojaContable',cajaChicaController.buscarHojaContable);


// MOVIMEINTO
router.post('/movimientos', movimientoController.crearMovimiento);
router.get('/movimientos', movimientoController.obtenerMovimientos);
router.get('/movimientos/:id', movimientoController.obtenerMovimientoPorId);
router.put('/movimientos/:id', movimientoController.actualizarMovimiento);
router.delete('/movimientos/:id', movimientoController.eliminarMovimiento);
router.post('/movimientosValidados',movimientoController.crearMovimientoConVerificacion);
router.put('/movimientosChecked/:id',movimientoController.checkedMovimiento);
router.put('actualizarExportados',movimientoController.actualizarExportados);


// HOJA CONTABLE
router.post('/hojaContable', hojaContableController.crearHojaContable);
router.get('/hojaContable', hojaContableController.obtenerHojasContables);
router.get('/hojaContable/:id', hojaContableController.obtenerHojaContablePorId);
router.put('/hojaContable/:id', hojaContableController.actualizarHojaContable);
router.delete('/hojaContable/:id', hojaContableController.eliminarHojaContable);
router.get('/hojaContable/usuario/:idUsuario',hojaContableController.getHojasContablesByUsuario);
router.post('/hojaContable/checarExistencia',hojaContableController.verificarHojaContableActual);

// GASTOS
// router.post('/gasto', gastoController.createGastoValidarRFC);
router.post('/gasto', gastoController.crearGasto);
router.post('/checarDuplicados', gastoController.checarDuplicados);
router.get('/gasto', gastoController.obtenerGastos);
router.get('/gasto/:id', gastoController.obtenerGastoPorId);
router.put('/gasto/:id', gastoController.actualizarGasto);
router.delete('/gasto/:id', gastoController.eliminarGasto);
router.get('/gastosHojas/:id', gastoController.getGastoByHojaContable);
router.post('/importarGastos', gastoController.importarGastos);
router.post('/checarGastosDup',gastoController.checarDuplicados);


// INGRESOS
// router.post('/ingreso', ingresoController.createIngresoVerificarRFC);
router.post('/ingreso', ingresoController.crearIngreso);
router.post('/checarIngreso', ingresoController.checarIngreso);
router.get('/ingreso', ingresoController.obtenerIngresos);
router.get('/ingreso/:id', ingresoController.obtenerIngresoPorId);
router.put('/ingreso/:id', ingresoController.actualizarIngreso);
router.delete('/ingreso/:id', ingresoController.eliminarIngreso);
router.get('/ingresosHojas/:id', ingresoController.getIngresosByHojaContable);


// PROVEEDORES
router.post('/proveedor', proveedorController.createProveedor);
router.get('/proveedor', proveedorController.getProveedores);
router.get('/proveedor/:id', proveedorController.getProveedorById);
router.put('/proveedor/:id', proveedorController.updateProveedor);
router.delete('/proveedor/:id', proveedorController.deleteProveedor);
router.get('/buscaProveedor',proveedorController.buscarProveedor);

// NOMINAS
router.post('/nominas', nominaController.createNomina);
router.get('/nominas', nominaController.getNominas);
router.get('/nominas/:idSemana', nominaController.getNominasBySemana);
router.get('/nominas/:idSemana/:idEmpleado', nominaController.getNominaById);
router.put('/nominas/:idSemana/:idEmpleado', nominaController.updateNomina);
router.delete('/nominas/:idSemana/:idEmpleado', nominaController.deleteNomina);
router.post('/nominaExtemporanea',nominaController.verificarOCrearNomina);
router.get('/getNominaByIdNomina/:id',nominaController.getNominaByIdNomina);
router.put('/putNominaByIdNomina/:id',nominaController.putNominaByIdNomina);
router.put('/alternarCalculado/:idNomina',nominaController.alternarCalculadoNomina);

// CLIENTE
router.post('/cliente', clienteController.crearCliente);
router.get('/cliente', clienteController.obtenerClientes);
router.get('/cliente/:id', clienteController.obtenerClientePorId);
router.put('/cliente/:id', clienteController.actualizarCliente);
router.delete('/cliente/:id', clienteController.eliminarCliente);
router.get('/buscaCliente',clienteController.buscarCliente);

// SOLICITUD
router.post('/solicitud',solicitudController.createSolicitud);
router.get('/solicitud', solicitudController.getSolicitudes);
router.get('/solicitud/:id', solicitudController.getSolicitudById);
router.put('/solicitud/:id', solicitudController.updateSolicitud);
router.delete('/solicitud/:id', solicitudController.deleteSolicitud);






module.exports = router;
