function adjudicadosCIF(){
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

//Se recoge el valor del cif
var fin = params['cif'];
//Se le asigna valor al div "cif" del HTML
document.getElementById("cif").innerHTML = fin;
//Se realiza la consulta SPARQL
var SPARQL_ENDPOINT = 'http://datos.zaragoza.es/sparql';
var query = 'SELECT DISTINCT ?uri min(?titulo) as ?Titulo min(?servicioGestor) as ?ServicioGestor ?fechaFormalizacion ?id ?precio ?empresa \
WHERE { \
?uri a pproc:Contract. \
?uri dcterms:title ?titulo. \
?uri pc:tender ?tender. \
?tender a pproc:FormalizedTender. \
?tender pproc:formalizedDate ?fechaFormalizacion. \
OPTIONAL {?tender   pc:supplier ?empresaid. \
		?empresaid <http://www.w3.org/ns/org#identifier> ?cif.} \
OPTIONAL {?tender   pc:supplier ?empresaid. \
		?empresaid <http://schema.org/name> ?empresa.} \
OPTIONAL {?uri pproc:managingDepartment ?managingDepartment. \
		?managingDepartment dcterms:title ?servicioGestor.} \
OPTIONAL {?uri pproc:managingDepartment ?managingDepartment. \
	?managingDepartment dcterms:identifier ?id.} \
OPTIONAL {?tender pc:offeredPrice ?offeredPriceVAT. \
	 ?offeredPriceVAT gr:hasCurrencyValue ?precio. \
	 ?offeredPriceVAT gr:valueAddedTaxIncluded "true"^^xsd:boolean.} \
FILTER(regex(replace(replace(replace(?cif," ",""),"-",""),"/.",""),"^'+fin+'$","i")) \
	} \
GROUP BY ?uri ?id ?precio ?empresa ?fechaFormalizacion';
/*var query = 'SELECT DISTINCT ?uri min(?titulo) as ?Titulo min(?servicioGestor) as ?ServicioGestor ?fechaFormalizacion ?id ?precio ?empresa \
		WHERE {\
			?uri a pproc:Contract.\
			?uri dcterms:title ?titulo.\
			?uri pc:tender ?tender.\
			?tender a pproc:FormalizedTender.\
			OPTIONAL {?tender   pc:supplier ?empresaid.}\
			?tender pproc:formalizedDate ?fechaFormalizacion.\
			OPTIONAL {?empresaid <http://www.w3.org/ns/org#identifier> ?cif.}\
			OPTIONAL {?empresaid <http://schema.org/name> ?empresa.}\
			OPTIONAL {?uri pproc:managingDepartment ?managingDepartment.}\
			OPTIONAL {?managingDepartment dcterms:title ?servicioGestor.}\
			OPTIONAL {?managingDepartment dcterms:identifier ?id.}\
			OPTIONAL {?tender pc:offeredPrice ?offeredPriceVAT.\
					  ?offeredPriceVAT gr:hasCurrencyValue ?precio.\
					  ?offeredPriceVAT gr:valueAddedTaxIncluded "true"^^xsd:boolean.}\
			FILTER(regex(replace(replace(replace(?cif," ",""),"-",""),"/.",""),"^'+fin+'$","i"))\
		}\
		GROUP BY ?uri ?id ?precio ?empresa ?fechaFormalizacion';*/
//Se almacena en data toda la información devuelta en la consulta
$.getJSON(SPARQL_ENDPOINT + '?query=' + encodeURIComponent(query) + '&format=application%2Fsparql-results%2Bjson&timeout=0')
	.success(function(data) {
		console.log(data);
		var feature;
		var resul;
		//Se crea una tabla para mostrar los datos en ella
		var table = '';
		var precioTotal = 0;
		//Se recorre el json devuelto en la consulta
		for (var i = 0; i < data.results.bindings.length; i++) {
			//Por cada elemento devuelto se pasa la información a la tabla
			feature = data.results.bindings[i];
			resul = feature.empresa.value;
			if(typeof feature.empresa == 'undefined'){
				var empresa = new Object();
				empresa.value = "";
				}
			else if(typeof feature.empresa !== 'undefined'){
				var empresa = new Object();
				empresa.value = feature.empresa.value;
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
			if(typeof feature.precio == 'undefined'){
				var precio = new Object();
				precio.value = "";
				}
			else if(typeof feature.precio !== 'undefined'){
				var precio = new Object();
				precio.value = feature.precio.value;
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
			table += '<div class="col-xs-4"><p>Servicio Gestor</p></div>';
			table += '<div class="col-xs-8"><p><a href="adjudicadosPorServicioGestor.html?servicio='+id.value+'&nombre='+servicioGestor.value+'">'+servicioGestor.value+'</a></p></div>';
			table += '</div>';
			table += '<div class="row">';
			table += '<div class="col-xs-4"><p>Fecha de formalización</p></div>';
			table += '<div class="col-xs-8"><p>' + feature.fechaFormalizacion.value + '</p></div>';
			table += '</div>';
			table += '<div class="row">';
			table += '<div class="col-xs-4"><p>Precio de adjudicación</p></div>';
			table += '<div class="col-xs-8"><p>' + Math.round(parseFloat(precio.value)).toLocaleString() + ' €</p></div>';
			table += '</div>';
			table += '</div>';
			precioTotal += Math.round(parseFloat(precio.value));
		}
		table += '</table>';
		if (data.results.bindings.length == 0)
			table = '</br><h3>No se encontaron empresas con dicho CIF</h3>';
		//Se le da valor al div "empresa" del HTML
		if (resul != null)
			document.getElementById("empresa").innerHTML = resul;
		//Se cierra la tabla
		//Se inserta el contenido de la tabla en el elemento "tabla" creado en el HTML
		document.getElementById("datos").innerHTML = Math.round(parseFloat(precioTotal)).toLocaleString();
		document.getElementById("tabla").innerHTML = table;
});
}