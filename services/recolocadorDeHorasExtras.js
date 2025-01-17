const HorasTrabajadas = require('../models/HorasTrabajadas');
const Nomina = require('../models/Nomina.js');



/*
PASOS PARA RECOLOCAR LAS HORAS
1 - La semana debe estar completa (con o sin horas extras)
2 - Contar todas las horas (extras y regulares juntas) y determinar si se cumplen o no las 48
    - Si no se cumplen y hay horas extras se tienen que realocar
    - Si exactamente se cumplen 48 y hay horas extras se tiene que realocar
    - Si se completan las horas pero hay horas extras que deben de convertise en regules
      y se debe realocar el numero de horas extras que se necesitan para completar paso 4



    REALOCAR
3 - Se obtienen las horas extras del dia mas lejano (De Lunes a viernes) 
3.1 Dentro de ese dia de obtiene la hora extra mas lejana (Mas temprano a mas tarde)
3.2 Evaluar si esas horas son suficientes para completar las horas extras
3.3 Buscar en ese mismo dia de esa misma hora si hay un resgitro de horas en ese mismo proyecto
    -Si existe: Las horas extras se transfieren a ese registro y se elimina el registro de horas extras transferido
    -Si no existe: Cambiar las horas extras a regulares


3.3 Se vuelve a repetir el paso 2 hasta que no se nececite recolocar



[TODOS ESTOS CAMBIOS DEBEN MATENER SU FECHA Y HORA DE CREACION, DE OTRA FORMA CAUSARAN UN DESACOMOO]
    A- Si no son suficientes para completar las 48  solo se convierten en regulares
    B- Si son suficientes para completar exactamente 48 solo se convierten en regulares
    C- Si son suficientes para completar (sobrepasandolas) se dividen dichas horas extras en
      las regulares para completar y las extras sobrantes, se restan a las horas faltantes. La diferencia
      se convierte en extras y se le resta a las extras para obtener las regulares
3.3 Se vuelve a repetir el paso 2 hasta que no se nececite recolocar


4 - Si se completan mas de 48 horas pero no cuenta con 48 horas regulares
    hay que averiguar el numero de horas extras que se deben convertir en
    regulares para que se completen las 48 y el resto dejarlas asi

4.1 Obtener el num de horas regulares y de extras.
4.2 Comparar si las horas regulares superan las 48 horas
    - Si superan las 48 horas no se hace nada
    - Si no las supera las 48 restar a 48 las horas regulares
      eso te da el numero de horas extras que se deben de convertir
      y se llama al realocador por horas

REALOCADOR POR HORAS
4.3 Obtiene la hora mas temprana del dia mas lejano
4.4 Checa si las horas trabajadas de esa hora son suficientes para
    llenar las horas a converir
(checando si existe un registro y disminuye el num de horas extras faltantes)
        -Si no son suficientes se convierten en regulares y se vuelve a llamar a la funcion
        -Si son suficientes y sobrepasan el numero el numero de horas extras
         se convierten en regulares y el sobrante se queda como extra y se sale del ciclo
        -Si son suficientes exactamene se convierten en regulares y se sale del ciclo


- 
*/


// OBTIENE EL TOTAL DE HORAS TRABAJADAS
const obtenerTotalHorasTrabajadas = async(idSemana, idEmpleado) => {
    try {
      // Consulta para obtener las horas del empleado en la semana específica
      const horasTrabajadas = await HorasTrabajadas.find({
        idEmpleado,
        idSemana,
      });
  
      // Suma todas las horas trabajadas
      const totalHoras = horasTrabajadas.reduce((total, registro) => {
        return total + registro.horasTrabajadas;
      }, 0);
  
      return totalHoras;
    } catch (error) {
      console.error("Error al obtener las horas trabajadas:", error);
      throw error;
    }
  }



// EVALUA SI HAY HORAS EXTRAS EN LA SEMANA
const tieneHorasExtras = async (idSemana, idEmpleado) => {
    try {
        // Consulta en la base de datos
        const horasExtras = await HorasTrabajadas.findOne({
            idSemana: idSemana,
            idEmpleado: idEmpleado,
            sonHorasExtra: true
        });

        // Si encuentra un registro, devuelve true
        return !!horasExtras;
    } catch (error) {
        console.error('Error al verificar horas extras:', error);
        throw new Error('Error al verificar horas extras');
    }
};




// OBTIENE TODAS LAS HORAS DEL DIA MAS CERCANO
const obtenerHorasExtras = async (idSemana, idEmpleado) => {
    try {
        // Definir el orden relativo de los días de la semana
        const ordenDias = [
            "Viernes anterior",  // Más lejano
            "Sabado anterior",
            "Domingo anterior",
            "Lunes",
            "Martes",
            "Miercoles",
            "Jueves" // Más cercano
        ];

        // Obtener todas las horas extras del trabajador en esa semana
        const horas = await HorasTrabajadas.find({ idSemana, idEmpleado, sonHorasExtra: true });

        if (horas.length === 0) {
            console.log("No se encontraron horas extras para ese empleado y semana.");
            return [];
        }

        // Ordenar las horas según el campo diaSemana basado en ordenDias
        horas.sort((a, b) => {
            return ordenDias.indexOf(a.diaSemana) - ordenDias.indexOf(b.diaSemana);
        });

        // Filtrar las horas del día más lejano según el orden
        const diaMasLejano = horas[0].diaSemana; // El primer elemento tras ordenar
        const horasDelDiaMasLejano = horas.filter(hora => hora.diaSemana === diaMasLejano);
       
        return horasDelDiaMasLejano;
    } catch (error) {
        console.error("Error al obtener las horas extras:", error);
        return [];
    }
};


// OBTIENE LA HORA TRABAJADA CON LA HORA MAS TEMPRANA
const obtenerHoraMasLejanaDelDia = async (registros) =>{
    try{
        if (!Array.isArray(registros) || registros.length === 0) {
            throw new Error('El array de registros está vacío o no es válido.');
        }
    
        // Ordenar los registros por horaCreacion en orden ascendente (de más antigua a más reciente)
        const registrosOrdenados = registros.sort((a, b) => new Date(a.horaCreacion) - new Date(b.horaCreacion));
    
        // Retornar el primer registro (el más antiguo)
        return registrosOrdenados[0];
    }
    catch(error){

    }
}


const buscarSiHayHorasRegularesParaEseProyectoEnEseMismoDia = async(horaSemejante)=>{
    try {
        const { idSemana, idProyecto, idEmpleado, diaSemana } = horaSemejante;
        // Buscar en la base de datos
        const registroEncontrado = await HorasTrabajadas.findOne({
            idSemana,
            idProyecto,
            idEmpleado,
            diaSemana,
            sonHorasExtra: false // Buscar específicamente donde `sonHorasExtra` es `false`
        });

        return registroEncontrado;
    } catch (error) {
        console.error('Error al buscar el registro:', error);
        throw error; // Lanza el error para manejarlo en el nivel superior
    }
}

// TRANSFIERE LAS HORAS DE UN HORARIO  A OTRO SI HAY PROYECTOS
const transferirHorasExtrasAHorasRegularesYEliminar = async(idHorarioOrigen,idHorarioDestino) =>{
    try {
        // Buscar ambos horarios
        const horarioOrigen = await HorasTrabajadas.findById(idHorarioOrigen);
        const horarioDestino = await HorasTrabajadas.findById(idHorarioDestino);

        if (!horarioOrigen || !horarioDestino) {
            throw new Error('Uno o ambos horarios no existen.');
        }

        // Sumar las horas del origen al destino
        horarioDestino.horasTrabajadas += horarioOrigen.horasTrabajadas;

        // Guardar el horario destino con las horas actualizadas
        await horarioDestino.save();

        // Eliminar el horario origen
        await HorasTrabajadas.findByIdAndDelete(idHorarioOrigen);

        return {
            success: true,
            message: 'Horas transferidas exitosamente.',
            horarioDestinoActualizado: horarioDestino
        };
    } catch (error) {
        console.error('Error durante la transferencia de horas:', error);
        return {
            success: false,
            message: 'Ocurrió un error durante la transferencia de horas.',
            error: error.message
        };
    }
}


// SWITCHEA ENTRE TRUE O FALSE PARA UNA HORA 
const cambiarSonHorasExtra = async (idHorario, nuevoValor) => {
    try {
        // Validar que el valor sea booleano
        if (typeof nuevoValor !== 'boolean') {
            throw new Error('El valor de `sonHorasExtra` debe ser un booleano.');
        }

        // Buscar y actualizar el documento
        const resultado = await HorasTrabajadas.findByIdAndUpdate(
            idHorario,
            { sonHorasExtra: nuevoValor },
            { new: true } // Devuelve el documento actualizado
        );

        if (!resultado) {
            throw new Error('No se encontró un horario con el ID proporcionado.');
        }

        return {
            success: true,
            message: 'El campo sonHorasExtra fue actualizado exitosamente.',
            data: resultado
        };
    } catch (error) {
        console.error('Error al actualizar sonHorasExtra:', error);
        return {
            success: false,
            message: 'Ocurrió un error al actualizar sonHorasExtra.',
            error: error.message
        };
    }
};


// OBTIENE LA SUMA DE HORAS EXTRAS 
const obtenerSumaHorasExtras = async (idSemana, idEmpleado) => {
    try {
        // Usamos el método aggregate para realizar la suma de las horas extras
        const resultado = await HorasTrabajadas.aggregate([
            // Filtro de semana e idEmpleado
            { 
                $match: {
                    idSemana: idSemana,
                    idEmpleado: idEmpleado,
                    sonHorasExtra: true // Solo consideramos las horas extras
                }
            },
            // Sumar las horasTrabajadas
            {
                $group: {
                    _id: null, // No necesitamos un campo de agrupación, solo sumaremos
                    totalHorasExtras: { $sum: "$horasTrabajadas" } // Sumar todas las horasTrabajadas
                }
            }
        ]);

        // Si no se encuentran horas extras, devolvemos 0
        if (resultado.length === 0) {
            return 0;
        }

        // Devuelve la suma de las horas extras
        return resultado[0].totalHorasExtras;
    } catch (error) {
        console.error("Error al obtener la suma de horas extras:", error);
        return 0;
    }
};

// OBTIENE LA SIMA DE HORAS REGULARES
const obtenerSumaHorasRegulares = async (idSemana, idEmpleado) => {
    try {
        // Usamos el método aggregate para realizar la suma de las horas regulares
        const resultado = await HorasTrabajadas.aggregate([
            // Filtro de semana e idEmpleado
            { 
                $match: {
                    idSemana: idSemana,
                    idEmpleado: idEmpleado,
                    sonHorasExtra: false // Solo consideramos las horas regulares
                }
            },
            // Sumar las horasTrabajadas
            {
                $group: {
                    _id: null, // No necesitamos un campo de agrupación, solo sumaremos
                    totalHorasRegulares: { $sum: "$horasTrabajadas" } // Sumar todas las horasTrabajadas
                }
            }
        ]);

        // Si no se encuentran horas regulares, devolvemos 0
        if (resultado.length === 0) {
            return 0;
        }

        // Devuelve la suma de las horas regulares
        return resultado[0].totalHorasRegulares;
    } catch (error) {
        console.error("Error al obtener la suma de horas regulares:", error);
        return 0;
    }
};

// DETERMINA EL CASO DE PROBLEMA PARA LAS HORAS FALTANTES
const compararHorasTrabajadas = async (idHora, horasFaltantes) => {
    try {
        // Obtén la hora trabajada específica
        const hora = await HorasTrabajadas.findById(idHora);

        if (!hora) {
            return 'No se encontró la hora trabajada con el ID proporcionado.';
        }

        // Compara las horas trabajadas con las horas faltantes y devuelve el mensaje correspondiente
        if (hora.horasTrabajadas > horasFaltantes) {
            return 'Superan';
        } else if (hora.horasTrabajadas < horasFaltantes) {
            return 'NoSuperan';
        } else {
            return 'Exacto';
        }
    } catch (error) {
        console.error("Error al comparar la hora trabajada:", error);
        return 'Error al obtener o comparar la hora trabajada.';
    }
};

// TODO: SOLUCIONES PARA CADA UNO DE LOS 3 CASOS


module.exports = {
    obtenerTotalHorasTrabajadas,
    tieneHorasExtras,
    obtenerHorasExtras,
    obtenerHoraMasLejanaDelDia,
    buscarSiHayHorasRegularesParaEseProyectoEnEseMismoDia,
    cambiarSonHorasExtra,
    transferirHorasExtrasAHorasRegularesYEliminar,
    obtenerSumaHorasExtras,
    obtenerSumaHorasRegulares,
    compararHorasTrabajadas
}




