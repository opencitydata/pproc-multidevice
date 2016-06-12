function buscarPorPrecio(){
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
//Se recoge el valor del precio
var fin = params['precio'];


//Se le asigna valor al div "precio" del HTML
document.getElementById("precio").innerHTML = fin;
//Se realiza la consulta SPARQL
var SPARQL_ENDPOINT = 'http://datos.zaragoza.es/sparql';
var query = 'SELECT DISTINCT ?uri min(?titulo) as ?Titulo ?nombre ?fechaFormalizacion ucase(replace(replace(replace(?cif," ",""),"-",""),"/.","")) as ?Cif min(?servicioGestor) as ?ServicioGestor ?id ?precio\
		WHERE {\
			?uri a pproc:Contract.\
			?uri dcterms:title ?titulo.\
			?uri pc:tender ?tender.\
			?tender a pproc:FormalizedTender.\
			?tender pproc:formalizedDate ?fechaFormalizacion.\
			OPTIONAL {?tender   pc:supplier ?empresaid.\
					  ?empresaid <http://www.w3.org/ns/org#identifier> ?cif.}\
			OPTIONAL {?tender   pc:supplier ?empresaid.\
					  ?empresaid <http://schema.org/name> ?nombre.}\
			OPTIONAL {?uri pproc:managingDepartment ?managingDepartment.\
					  ?managingDepartment dcterms:title ?servicioGestor.}\
			OPTIONAL {?uri pproc:managingDepartment ?managingDepartment.\
					  ?managingDepartment dcterms:identifier ?id.}\
			OPTIONAL {?tender pc:offeredPrice ?offeredPriceVAT.\
					  ?offeredPriceVAT gr:hasCurrencyValue ?precio.\
					  ?offeredPriceVAT gr:valueAddedTaxIncluded "true"^^xsd:boolean.}\
			FILTER(xsd:integer(?precio) > xsd:integer("'+fin+'"))\
		}\
		GROUP BY ?uri ?nombre ?cif ?id ?precio ?fechaFormalizacion \
		ORDER BY desc(?precio)';
//Se almacena en data toda la información devuelta en la consulta
$.getJSON(SPARQL_ENDPOINT + '?query=' + encodeURIComponent(query) + '&format=application%2Fsparql-results%2Bjson&timeout=0')
	.success(function(data) {
		var feature;
		//Se crea una tabla para mostrar los datos en ella
		var table = '';
		//Se recorre el json devuelto en la consulta
		for (var i = 0; i < data.results.bindings.length; i++) {
			//Por cada elemento devuelto se pasa la información a la tabla
			feature = data.results.bindings[i];
			//El elemento devuelto tiene duración y fecha
			if(typeof feature.nombre == 'undefined'){
				var nombre = new Object();
				nombre.value = "";
				}
			else if(typeof feature.nombre !== 'undefined'){
				var nombre = new Object();
				nombre.value = feature.nombre.value;
				}
			if(typeof feature.id == 'undefined'){
				var id = new Object();
				id.value = "";
				}
			else if(typeof feature.id !== 'undefined'){
				var id = new Object();
				id.value = feature.id.value;
				}
			if(typeof feature.ServicioGestor == 'undefined'){
				var servicioGestor = new Object();
				servicioGestor.value = "";
				}
			else if(typeof feature.ServicioGestor !== 'undefined'){
				var servicioGestor = new Object();
				servicioGestor.value = feature.ServicioGestor.value;
				}
			if(typeof feature.Cif == 'undefined'){
				var cif = new Object();
				cif.value = "";
				}
			else if(typeof feature.Cif !== 'undefined'){
				var cif = new Object();
				cif.value = feature.Cif.value;
				}
			
			if(i%2==0)
				table += '<div class="caso1">';
			else
				table += '<div class="caso2">';
			table += '<div class="row">';
			table += '<div class="col-xs-4"><p>Titulo</p></div>';
			table += '<div class="col-xs-8"><p><a href='+feature.uri.value+'>'+feature.Titulo.value+'</a></p></div>';
			table += '</div>';
			table += '<div class="row">';
			table += '<div class="col-xs-4"><p>Empresa</p></div>';
			table += '<div class="col-xs-8"><p><a href="adjudicadosCIF.html?cif='+cif.value+'">'+nombre.value+'</a></p></div>';
			table += '</div>';
			table += '<div class="row">';
			table += '<div class="col-xs-4"><p>Servicio Gestor</p></div>';
			table += '<div class="col-xs-8"><p><a href="adjudicadosPorServicioGestor.html?servicio='+id.value+'">'+servicioGestor.value+'</a></p></div>';
			table += '</div>';
			table += '<div class="row">';
			table += '<div class="col-xs-4"><p>Fecha de formalización</p></div>';
			table += '<div class="col-xs-8"><p>' + feature.fechaFormalizacion.value + '</p></div>';
			table += '</div>';
			table += '<div class="row">';
			table += '<div class="col-xs-4"><p>Precio</p></div>';
			table += '<div class="col-xs-8"><p>' + Math.round(parseFloat(feature.precio.value)).toLocaleString() + ' €</p></div>';
			table += '</div>';
			table += '</div>';
		}
		if (data.results.bindings.length == 0)
			table = '</br><h3>No se encontaron contratos más caros que el precio establecido</h3>';
		//Se inserta el contenido de la tabla en el elemento "tabla" creado en el HTML
		document.getElementById("tabla").innerHTML = table;
});
}