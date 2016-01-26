//Se realiza la consulta SPARQL
function tipoProcedimiento() {
var SPARQL_ENDPOINT = 'http://datos.zaragoza.es/sparql';
var query ='SELECT DISTINCT ?uri ?titulo ?procedimiento\
	WHERE{\
		?uri a pproc:Contract.\
		?uri dcterms:title ?titulo.\
		?uri pc:tender ?tender.\
		?tender a pproc:FormalizedTender.\
		?uri pproc:contractProcedureSpecifications ?procedureType.\
		?procedureType pproc:procedureType  ?procedimiento.\
	}';

//Se almacena en data toda la información devuelta en la consulta
$.getJSON(SPARQL_ENDPOINT + '?query=' + encodeURIComponent(query) + '&format=application%2Fsparql-results%2Bjson&timeout=0')
    .success(function(data) {
		var feature;
		//Se crea una tabla para mostrar los datos en ella
		var table = '<table>';
		table += '<tr> <td><h2>Título</h2></td> <td><h2>Procedimiento</h2></td> </tr>';
		//Se recorre el json devuelto en la consulta
		for (var i = 0; i < data.results.bindings.length; i++) {
			//Por cada elemento devuelto se pasa la información a la tabla
			feature = data.results.bindings[i];
			var aux = "";
			if (feature.procedimiento.value == "http://contsem.unizar.es/def/sector-publico/pproc#RegularOpen")
				aux = "Regular Open";
			else if (feature.procedimiento.value == "http://contsem.unizar.es/def/sector-publico/pproc#Minor")
				aux = "Minor";
			else if (feature.procedimiento.value == "http://contsem.unizar.es/def/sector-publico/pproc#Negotiated")
				aux = "Negotiated";
			table += '<tr><td>' + '<a href='+feature.uri.value+'>'+feature.titulo.value+'</a>' + '</td><td>' + aux + '</td></tr>';   
			
			
		}
		//Se cierra la tabla
		table += '</table>';
		//Se inserta el contenido de la tabla en el elemento "tabla" creado en el HTML
		document.getElementById("tabla").innerHTML = table;
});
}