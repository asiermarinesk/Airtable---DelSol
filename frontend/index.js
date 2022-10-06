import {initializeBlock, useBase, useRecords, useWatchable, useCursor} from '@airtable/blocks/ui';
import React from 'react';

/*
function NombreBD() {
    const base = useBase("DatosPokemon");
    return <div>{base.name}</div>;
}
*/
/*
function EjemplosUseRecords() {
    const base = useBase();
    const table = base.tables[0];
    const view = table.views[0];
    let records;
    // Returns all records in the table
    let records1 = useRecords(table);
    var stringifiedObj1 = Object.entries(records1).map(x=>x.join(":")).join("\n");
    // Equivalent to the above - useful if you want to reuse the queryResult elsewhere
    const queryResult = table.selectRecords();
    let records2 = useRecords(queryResult);
    // Returns all records for a view
    let records3 = useRecords(view)
    // Returns all records in a table, only loading data for the specified fields
    let records4 = useRecords(table, {fields: ['Name']});
    // Returns all records in a table, sorting the records by values in the specified fields
    let records5 = useRecords(table, {sorts: [
       // sort by 'My field' in ascending order...
       {field: 'Name'},
       // then by 'My other field' in descending order
       {field: 'Prueba', direction: 'desc'},
    ]});
    return records1.name, records2.name, records3.name, records4.name, records5.name;
}
*/
/*
function NombresRecordsFormateado() {
    const base = useBase();
    const table = base.tables[0];
    // grab all the records from that table
    const records = useRecords(table, {sorts: [
        // sort by 'My field' in ascending order...
        {field: 'Name'},
        // then by 'My other field' in descending order
        {field: 'Prueba', direction: 'desc'},
     ]});
    // render a list of records:
    return (
        <ul>
            {records.map(record => {
                return <li key={record.id}>{record.name}</li>
            })}
        </ul>
    );
}
*/

    //  INTERVAL    -   No PARECE funcionar
/*
async function timeout(ms) {
    const base = useBase();
    return new Promise(resolve => setInterval(async function (){
        await base.createRecordsAsync([
        {
            fields: {
                'Name': "Darkrai"
            }
        }
        ]);
    }, ms));
}    
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
*/
    //  Pruebas Watch
//Primer intento
/*
function pruebaWatch() {
    const base = useBase();
    const table = base.tables[0];
    table.watch(primaryField, pruebaAlgodon);
}
function pruebaAlgodon() {
    return (
        <p>
            "He registrado un cambio."
        </p>
    );
}
*/

//Primer palo de ciego
function ActiveView() {
    let cursor = useCursor();
    let base = useBase();
    let table = base.tables[0];
    //let queryResult = table.selectRecords();
    let records = useRecords(table);
    useWatchable(cursor, 'selectedRecordIds', () => {
        records.forEach(record => {
            cursor.selectedRecordIds.forEach(idVigilado => {
                if (record.id == idVigilado) {
                    
                    record.watch("name", function () {
                        alert('Valor cambiado de');console.log(record.id);
                    });
                    record.unwatch();
                } 
            });
            //
        }); 
    });
    
    return <span>No existen cambios</span>
}

initializeBlock(() => <ActiveView/>);
