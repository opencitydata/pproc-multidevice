function adjudicadosPorServicioGestor(){
//Se cogen los valores pasados por URI.
//Se dividen por "&"
var paramstr = window.location.search.substr(1);
var paramarr = paramstr.split ("&");
var params = {};
for ( var i = 0; i < paramarr.length; i++) {
	var tmparr = paramarr[i].split("=");
	params[tmparr[0]] = tmparr[1];
}
//Se recoge el valor del servicio
var fin = params['servicio'];
var nombre = params['nombre'];
//En caso de que haya tildes, se soluciona el problema
nombre = nombre.replace(/%A1/g,"á");
nombre = nombre.replace(/%81/g,"Á");
nombre = nombre.replace(/%A9/g,"é");
nombre = nombre.replace(/%89/g,"É");
nombre = nombre.replace(/%AD/g,"í");
nombre = nombre.replace(/%8D/g,"Í");
nombre = nombre.replace(/%B3/g,"ó");
nombre = nombre.replace(/%93/g,"Ó");
nombre = nombre.replace(/%BA/g,"ú");
nombre = nombre.replace(/%9A/g,"Ú");
nombre = nombre.replace(/%B1/g,"ñ");
nombre = nombre.replace(/%91/g,"Ñ");
nombre = nombre.replace(/%20/g," ");
nombre = nombre.replace(/%C3/g,"");
//Se le asigna valor al div "empresa" del HTML
document.getElementById("servicio").innerHTML = nombre;
//Se realiza la consulta SPARQL
if(fin == ""){
var table = "No se pudieron encontrar contratos adjudicados a este servicio gestor. Disculpen las molestias."
document.getElementById("tabla").innerHTML = table;
}
else{
var SPARQL_ENDPOINT = 'http://datos.zaragoza.es/sparql';
var query = 'SELECT DISTINCT ?uri min(?titulo) as ?Titulo ?nombre ucase(replace(replace(replace(?cif," ",""),"-",""),"/.","")) as ?Cif ?precio\
		WHERE {\
			?uri a pproc:Contract.\
			?uri dcterms:title ?titulo.\
			?uri pc:tender ?tender.\
			?tender a pproc:FormalizedTender.\
			OPTIONAL {?tender   pc:supplier ?empresaid.}\
			?tender pproc:formalizedDate ?fechaFormalizacion.\
			OPTIONAL {?empresaid <http://www.w3.org/ns/org#identifier> ?cif.}\
			OPTIONAL {?empresaid <http://schema.org/name> ?nombre.}\
			OPTIONAL {?uri pproc:managingDepartment ?managingDepartment.}\
			OPTIONAL {?managingDepartment dcterms:title ?servicioGestor.}\
			OPTIONAL {?managingDepartment dcterms:identifier ?id.}\
			OPTIONAL {?tender pc:offeredPrice ?offeredPriceVAT.\
					  ?offeredPriceVAT gr:hasCurrencyValue ?precio.\
					  ?offeredPriceVAT gr:valueAddedTaxIncluded "true"^^xsd:boolean.}\
			FILTER(regex(?id,"'+fin+'")) \
		}\
		GROUP BY ?uri ?nombre ?cif ?id ?precio';
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
			var servicio = feature.Titulo.value;
			//El elemento devuelto tiene duración y fecha
			if(typeof feature.nombre == 'undefined'){
				var nombre = new Object();
				nombre.value = "";
				}
			else if(typeof feature.nombre !== 'undefined'){
				var nombre = new Object();
				nombre.value = feature.nombre.value;
				}
			if(typeof feature.Cif == 'undefined'){
				var cif = new Object();
				cif.value = "";
				}
			else if(typeof feature.Cif !== 'undefined'){
				var cif = new Object();
				cif.value = feature.Cif.value;
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
			table += '<div class="col-xs-4"><p>Empresa</p></div>';
			table += '<div class="col-xs-8"><p><a href="adjudicadosCIF.html?cif='+cif.value+'">'+nombre.value+'</a></p></div>';
			table += '</div>';
			table += '<div class="row">';
			table += '<div class="col-xs-4"><p>Precio</p></div>';
			table += '<div class="col-xs-8"><p>' + Math.round(parseFloat(precio.value)).toLocaleString() + ' €</p></div>';
			table += '</div>';
			table += '</div>';
			
			}
		//Se inserta el contenido de la tabla en el elemento "tabla" creado en el HTML
		document.getElementById("tabla").innerHTML = table;
});
}
}