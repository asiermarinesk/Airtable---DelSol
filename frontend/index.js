import {initializeBlock, useBase, useRecords, useWatchable, useCursor, useLoadable} from '@airtable/blocks/ui';
import React from 'react';

// Definimos "indice" de forma global para interactuar con ella en ambas funciones.
// "datosEnviar" es la variable donde guardamos el último record que ha sido modificado.
let indice = 0;     
let datosEnviar = "";
let avisado;
let numRecords = 0;

/**
 * Esta función se encarga de averiguar el índice numérico de la fila
 * en la que está la celda seleccionada. El array "records" contiene la información
 * de todas las filas de la tabla. Vuelca la información en la variable global "indice".
 * @param {string} idRecord 
 * @param {array} records 
 */
function SituarRecord(idRecord, records) {
    let filaEncontrada = records.findIndex(record => record.id == idRecord);
    indice = filaEncontrada;
}
/**
 * A través de la información de la tabla que le facilitamos (paso necesario para no
 * cargar más hooks unas veces que otras y de error), y combinado con la fecha de modificación,
 * averiguamos cuál ha sido el último record modificado y lo vuelca en "datosEnviar".
 * @param {*} table 
 */
function VisualizarUltimo(table) {
    let ultimosRecords = useRecords(table, {sorts: [
        {field: 'Last Modified', direction: 'desc', limit: 1}
     ]});
    datosEnviar = ultimosRecords[0];
}

/**
 * Coge los datos de la tabla en la que se encuentra, crea los cursores que vigilan
 * dónde está situado el cliente y devuelve por pantalla la información de la celda.
 * Es dinámico aunque cambie la estructura de la tabla.
 * @returns El estado de la interacción en la pantalla.
 */
function Seleccionado() {
    //  Definición de variables básicas para moverte por la tabla.
    let base = useBase();
    let table = base.tables[0];
    let records = useRecords(table);
    //  Variables de fecha para hallar el último modificado y comparar.
    const fecha = new Date();
    const hoy = new Date(fecha);
    //  Puesta a punto de cursores y hooks para situarte.
    const cursor = useCursor();
    useLoadable(cursor);
    useWatchable(cursor, ['selectedFieldIds', 'selectedRecordIds']);
    SituarRecord(cursor.selectedRecordIds, records);
    VisualizarUltimo(table);
    //console.log(datosEnviar.getCellValue("fldMt4ueHXyUpgMBN").substring(0, datosEnviar.getCellValue("fldMt4ueHXyUpgMBN").length - 7));
    //console.log(hoy.toISOString().substring(0, hoy.toISOString().length - 7));

    //  Si el minuto de modificación es el mismo, se activa.
    /*if (datosEnviar.getCellValue("fldMt4ueHXyUpgMBN").substring(0, datosEnviar.getCellValue("fldMt4ueHXyUpgMBN").length - 7) == hoy.toISOString().substring(0, hoy.toISOString().length - 7) && avisado == undefined) {
        alert("funciona");
        avisado = true;
    }
    if (datosEnviar.getCellValue("fldMt4ueHXyUpgMBN").substring(0, datosEnviar.getCellValue("fldMt4ueHXyUpgMBN").length - 7) != hoy.toISOString().substring(0, hoy.toISOString().length - 7) && avisado != undefined) {
        alert("reset");
        avisado = undefined;
    }*/
    console.log(numRecords);
    console.log(records.length);

    if (numRecords < records.length) {
        console.log("nueva fila");
        numRecords = records.length;
        /*
        Hola Asier así creo que esta bien, solo cuando se crea una nueva fila ya sea por 
        la tabla o por el formulario aparece nueva fila. Por otro lado cuando te mueves por 
        las celdas de la tabla vuelve aparecer el numero 2 veces por que cada vez que te pones encima 
        de una celda vuelve a leer todo el código y vuelve a leer los dos console.log 
        de fuera del scope.

        El problema era lo del bucle que te dije que se estaba realimentando, a parte, estabas 
        jugando con el método undefined como valor de inicio y eso no es recomendable, para evitar
        eso lo he inicializado con un 0. 

        Te dejo el código tuyo abajo por si quieres echarle un ojo. 
        */
    }


    /*if (numRecords != undefined && numRecords < records.length) {
        console.log("nueva fila");
        numRecords = records.length;

    }else if (numRecords == undefined) {
        numRecords = records.length;

    }else if (numRecords >= records.length) {
        numRecords = undefined;
    }*/



    //  Se obtienen los datos de la API y se vuelcan en "datosApi"
    let api = "https://rest.reviso.com/customers";
    let datosApi = [];
    fetch(api, {
        method:'GET',
        headers: {
            'X-AppSecretToken':'demo',
            'X-AgreementGrantToken': 'demo',
            'Content-Type': 'application/json'
        }
    })
    .then((e) => e.json())
    .then((data) => {
        for (let i = 0; i < data["collection"].length; i++) {
            datosApi[i] = data["collection"][i];
        }
    })
    .catch((err) => 'El error es: ' + console.log(err));

    //  Prevención de errores => Sólo se selecciona una celda.
    if (cursor.selectedRecordIds.length ==  0 || cursor.selectedFieldIds.length == 0) {
        return <span>No hay valores seleccionados</span>
    }else if(cursor.selectedRecordIds.length > 1 || cursor.selectedFieldIds.length > 1){
        return <span>Has hecho una selección múltiple. Elige un único campo a modificar</span>
    }else{
        /*  Creación de un array para almacenar los datos de la fila. 
            Es necesario obtener los IDs de las columnas para moverte 
            de forma dinámica. */
        let datosFila = [];
        let idsColumnas = Object.keys(records[indice]._data.cellValuesByFieldId);
        for (let i = 0; i < idsColumnas.length; i++) {
            datosFila.push(records[indice].getCellValue(idsColumnas[i]));
        }
        let datosString = datosFila.join(" ");
        return <span>
            <p> Fila {indice} seleccionada. </p> 
            <p>{datosString}</p>
        </span>
    }
}

initializeBlock(() => <Seleccionado/>);
