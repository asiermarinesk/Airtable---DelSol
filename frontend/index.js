import {initializeBlock, useBase, useRecords, useWatchable, useCursor, useLoadable} from '@airtable/blocks/ui';
import React from 'react';

// Definimos "indice" de forma global para interactuar con ella en ambas funciones.
let indice = 0;     

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
    const cursor = useCursor();

    //  Puesta a punto de cursores y hooks para situarte.
    useLoadable(cursor);
    useWatchable(cursor, ['selectedFieldIds', 'selectedRecordIds']);
    SituarRecord(cursor.selectedRecordIds, records);

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
