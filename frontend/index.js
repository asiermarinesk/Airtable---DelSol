import {initializeBlock, useBase, useRecords, useWatchable, useCursor, useLoadable} from '@airtable/blocks/ui';
import React from 'react';

// Definimos "indice" de forma global para interactuar con ella en ambas funciones.
// "datosEnviar" es la variable donde guardamos el último record que ha sido modificado.
// "verificacionConexionDelSol" guardará el token de acceso a la API para las consultas.
// "respuestaConsulta" guarda la información de retorno de las consultas que ejecutamos a la API.
// "numRecords" se encarga de verificar junto con el length de records que se ha añadido una fila.
// Ya que no podemos encapsular en condicionales los hooks, "interruptorEnvio" se encarga de entrar al condicional por él.
let indice = 0;     
let datosEnviar = "";
let verificacionConexionDelSol = null;
let respuestaConsulta = null;
let numRecords = 0;
let interruptorEnvio = false;

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
        {field: 'Last Modified', direction: 'desc'}
     ]});
    datosEnviar = ultimosRecords[0];
    console.log(datosEnviar);
}

/**
 * Consulta de prueba que realizamos para verificar que podemos ejecutar órdenes
 * en la API de DelSol. De momento incluye un POST que recoge toda la 
 * información de la tabla.
 * Posibilidad de hacerla dinámica pasándo como parámetro la consulta a realizar.
 */
function ConsultaDelSol() {
    let api = "https://api.sdelsol.com/admin/LanzarConsulta";
    let token = "Bearer " + verificacionConexionDelSol;
    fetch(api, {
        method:'POST',
        headers: {
            Authorization: token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "ejercicio":"2022", 
            "consulta":"SELECT *"
        }),
    })
    .then((e) => e.json())
    .then((data) => {
        respuestaConsulta = data.resultado;
        console.log(token);
        console.log(data);
    })
    .catch((err) => 'El error es: ' + console.log(err));
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
    //  Puesta a punto de cursores y hooks para situarte.
    const cursor = useCursor();
    useLoadable(cursor);
    useWatchable(cursor, ['selectedFieldIds', 'selectedRecordIds']);
    SituarRecord(cursor.selectedRecordIds, records);
    //  Sistema de detección de nuevas filas.
    if (numRecords < records.length && numRecords != 0) {
        console.log("nueva fila");
        interruptorEnvio = true;
        numRecords = records.length; 
    }else if(numRecords == 0){
        numRecords = records.length; 
    }
    VisualizarUltimo(table);
    
    if (interruptorEnvio == true && datosEnviar.getCellValue("fldv2BGMaiI6phBzO") == true) {
    /*
        Conexión a DelSol a través de las claves que nos han mandado.
        Dentro de la propia promesa ejecutaremos el resto de consultas,
        de esa forma mantenemos la información sobre el token de acceso.
    */
        let apiConexion = "https://api.sdelsol.com/login/Autenticar";
        let infoDelSol = {
            'codigoFabricante':"378", 
            'codigoCliente':"99973", 
            'baseDatosCliente':"FS378", 
            'password':btoa("x9ZqMmrMivIh")
        };
        fetch(apiConexion, {
            method:'POST',
            headers: {
                Accept: 'application.json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(infoDelSol),
        })
        .then((e) => e.json())
        .then(async(data) => {
            verificacionConexionDelSol = data.resultado;
            ConsultaDelSol();
        })
        .catch((err) => 'El error es: ' + console.log(err));
        interruptorEnvio = false;
    }
    
    
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
