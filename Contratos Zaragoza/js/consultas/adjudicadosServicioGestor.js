function adjudicadosServicioGestor(){
//Se cogen los valores pasados por URI.
//Se dividen por "&"
var paramstr = window.location.search.substr(1);
var paramarr = paramstr.split ("&");
var params = {};
//Se guardan los valores
for ( var i = 0; i < paramarr.length; i++) {
	var tmparr = paramarr[i].split("=");
	params[tmparr[0]] = tmparr[1];
}
//Se recoge el valor del servicio
var fin = params['servicio'];
//Se realiza la consulta SPARQL
var SPARQL_ENDPOINT = 'http://datos.zaragoza.es/sparql';
var query = 'SELECT DISTINCT min(?servicioGestor) as ?ServicioGestor ?id\
		WHERE { \
			?uri a pproc:Contract. \
			?uri pproc:managingDepartment ?managingDepartment.\
			?managingDepartment dcterms:title ?servicioGestor.\
			?managingDepartment dcterms:identifier ?id.\
			FILTER(regex(?servicioGestor,"'+fin+'","i")) \
		}\
		GROUP BY(?id)';
//Se almacena en data toda la información devuelta en la consulta
$.getJSON(SPARQL_ENDPOINT + '?query=' + encodeURIComponent(query) + '&format=application%2Fsparql-results%2Bjson&timeout=0')
	.success(function(data) {
		var feature;
		//Se crea una tabla para mostrar los datos en ella
		var table = '<table>';
		//Se le asigna un nombre a cada columna de la tabla
		table += '<tr> <td><h2>Servicio Gestor</h2></td></tr>';
		//Se recorre el json devuelto en la consulta
		for (var i = 0; i < data.results.bindings.length; i++) {
			//Por cada elemento devuelto se pasa la información a la tabla
			feature = data.results.bindings[i];
			servicio = feature.ServicioGestor.value;
			table += '<tr><td>' + '<a href="adjudicadosPorServicioGestor.html?servicio='+feature.id.value+'">'+feature.ServicioGestor.value+'</a></td></tr>';  
			}
		//Se le asigna valor al div "servicio" del HTML
		document.getElementById("servicio").innerHTML = servicio;
		//Se cierra la tabla
		table += '</table>';
		//Se inserta el contenido de la tabla en el elemento "tabla" creado en el HTML
		document.getElementById("tabla").innerHTML = table;
});
}