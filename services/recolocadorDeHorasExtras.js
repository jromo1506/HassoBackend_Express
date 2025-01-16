const HorasTrabajadas = require('../models/HorasTrabajadas');
const Nomina = require('../models/Nomina.js');



/*
PASOS PARA RECOLOCAR LAS HORAS
1 - La semana debe estar completa (con o sin horas extras)
2 - Contar todas las horas (extras y regulares juntas) y determinar si se cumplen o no las 48
    - Si no se cumplen y hay horas extras se tienen que realocar
    - Si exactamente se cumplen 48 y hay horas extras se tiene que realocar
    - Cualquier otro caso no ocupa realocacion
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
        // Primero, obtener el documento con la fecha más antigua de la semana y el empleado
        const horas = await HorasTrabajadas.find({ idSemana, idEmpleado, sonHorasExtra: true })
            .sort({ fecha: 1 })  // Ordena de más antiguo a más reciente
            .limit(1);  // Solo nos interesa el primer (más antiguo)

        if (horas.length === 0) {
            console.log("No se encontraron horas extras para ese empleado y semana.");
            return [];
        }

        // Obtener la fecha del día más antiguo
        const fechaMasAntigua = horas[0].fecha;


        // Ahora, obtener todas las horas del mismo día más antiguo
        const horasDelDiaMasAntiguo = await HorasTrabajadas.find({
            idSemana,
            idEmpleado,
            sonHorasExtra: true,
            fecha: {
                $gte: new Date(fechaMasAntigua.setHours(0, 0, 0, 0)),  // Comienza el día (00:00:00)
                $lt: new Date(fechaMasAntigua.setHours(23, 59, 59, 999)) // Fin del día (23:59:59)
            }
        });

        return horasDelDiaMasAntiguo;
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
        console.log(idSemana+" "+idProyecto+" "+idEmpleado+" "+diaSemana,"CHAMBA");
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





module.exports = {
    obtenerTotalHorasTrabajadas,
    tieneHorasExtras,
    obtenerHorasExtras,
    obtenerHoraMasLejanaDelDia,
    buscarSiHayHorasRegularesParaEseProyectoEnEseMismoDia
}