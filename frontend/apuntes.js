/*
        APUNTES DE POSIBLE INTERÉS

    {records[indice].getCellValue(cursor.selectedFieldIds)} in {cursor.selectedFieldIds}

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