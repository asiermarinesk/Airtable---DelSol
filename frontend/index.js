import {initializeBlock, useBase, useRecords, useWatchable, useCursor, useLoadable} from '@airtable/blocks/ui';
import React from 'react';

let indice = 0;     // La definimos de forma global para interactuar con ella en ambas funciones.
/**
 * Esta función se encarga de averiguar el índice numérico de la fila
 * en la que está la celda seleccionada. El array "records" contiene la información
 * de todas las filas de la tabla.
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
    let base = useBase();
    let table = base.tables[0];
    let records = useRecords(table);
    const cursor = useCursor();
    useLoadable(cursor);
    useWatchable(cursor, ['selectedFieldIds', 'selectedRecordIds']);
    if (cursor.selectedRecordIds.length ==  0 || cursor.selectedFieldIds.length == 0) {
        return <span>No hay valores seleccionados</span>
    }else{
        SituarRecord(cursor.selectedRecordIds, records);
        return <span>
            The record has cell value {records[indice].getCellValue(cursor.selectedFieldIds)} in {cursor.selectedFieldIds}
        </span>
    }
}
/*
        APUNTES DE POSIBLE INTERÉS

    Object.keys(records[4]._data.cellValuesByFieldId)

    async function añadirPeriodicamente() {
        await timeout(5000); // 5 sec pause
    }
    function añadirDirectamente() {
        const base = useBase();
        base.createRecordsAsync([
            {
                fields: {
                    'Name': "Darkrai"
                }
            }
        ]);
    }

    // Posible chuleta de un Map:
    return (
        <ul>
            {records.map(record => {
                return <li key={record.id}>{record.name}</li>
            })}
        </ul>
    );
*/

initializeBlock(() => <Seleccionado/>);
