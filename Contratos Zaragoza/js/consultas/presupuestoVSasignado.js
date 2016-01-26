function presupuestoVSasignado(){
//Se realiza la consulta SPARQL
var SPARQL_ENDPOINT = 'http://datos.zaragoza.es/sparql';
var query = 'SELECT *\
	WHERE\
	{\
		{\
			SELECT DISTINCT ?uri ?titulo ?presupuesto \
			WHERE{\
				?uri a pproc:Contract.\
				?uri dcterms:title ?titulo.\
				?uri pproc:contractObject ?objeto.\
				?objeto pproc:contractEconomicConditions ?economia.\
				?economia pproc:budgetPrice ?budget.\
				?budget<http://purl.org/goodrelations/v1#hasCurrencyValue> ?presupuesto.\
				?budget<http://purl.org/goodrelations/v1#valueAddedTaxIncluded> "true"^^xsd:boolean.\
				FILTER(?presupuesto > 0)\
			}\
		}\
		{\
			SELECT ?uri SUM(?precio) as ?Precio ?fechaFormalizacion ?cif ?nombre \
			WHERE{\
				?uri a pproc:Contract.\
				?uri pc:tender ?tender.\
				?tender a pproc:FormalizedTender.\
				?tender pproc:formalizedDate ?fechaFormalizacion.\
				?tender   pc:supplier ?empresaid.\
				?empresaid <http://www.w3.org/ns/org#identifier> ?cif.\
				?empresaid <http://schema.org/name> ?nombre.\
				?tender pc:offeredPrice ?offeredPriceVAT.\
				?offeredPriceVAT gr:hasCurrencyValue ?precio.\
				?offeredPriceVAT gr:valueAddedTaxIncluded "true"^^xsd:boolean.\
			}\
			GROUP BY ?uri ?fechaFormalizacion ?cif ?nombre \
		}\
	}\
	ORDER BY desc(?presupuesto)';
//Se almacena en data toda la información devuelta en la consulta
$.getJSON(SPARQL_ENDPOINT + '?query=' + encodeURIComponent(query) + '&format=application%2Fsparql-results%2Bjson&timeout=0')
   .success(function(data) {
		var feature;
		//Se crea una tabla para mostrar los datos en ella
		var table = '<table>';
		//Se le asigna un nombre a cada columna de la tabla
		table += '<tr> <td><h2>Titulo</h2></td> <td><h2>Presupuesto</h2></td> <td><h2>Adjudicado Por</h2></td><td><h2>Fecha Formalización</h2></td><td><h2>Empresa</h2></td></tr>';
		//Se recorre el json devuelto en la consulta
		for (var i = 0; i < data.results.bindings.length; i++) {
			//Por cada elemento devuelto se pasa la información a la tabla
			feature = data.results.bindings[i];
			table += '<tr><td>' + '<a href="'+feature.uri.value+'">'+feature.titulo.value+'</a></td> <td>' + feature.presupuesto.value + '</td> <td>' + feature.Precio.value + '</td><td>' + feature.fechaFormalizacion.value + '</td><td>' + '<a href="adjudicadosCIF.html?cif='+feature.cif.value+'">'+feature.nombre.value+'</a></td> <td></tr>';  
		}
		//Se cierra la tabla
		table += '</table>';
		//Se inserta el contenido de la tabla en el elemento "tabla" creado en el HTML
		document.getElementById("tabla").innerHTML = table;
});
}