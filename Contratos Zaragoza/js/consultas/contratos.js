//Se realiza la consulta SPARQL
function contratos(filtro,year) {
	console.log("Año: " + year);
var filtroyear = 'FILTER ( regex(?fechaFormalizacion, "'+year+'"))';
var filtrofiltro = 'ORDER BY '+filtro+'';
console.log(filtrofiltro);
var SPARQL_ENDPOINT = 'http://datos.zaragoza.es/sparql';
var query ='SELECT DISTINCT ?uri  str(min(?titulo)) as ?Titulo str(min(?nombre)) as ?Nombre ?fechaFormalizacion ucase(replace(replace(replace(?cif," ",""),"-",""),"/.","")) as ?Cif min(?servicioGestor) as ?ServicioGestor ?id ?precio \
	WHERE {\
		?uri a pproc:Contract.\
		?uri dcterms:title ?titulo.\
		?uri pc:tender ?tender.\
		?tender a pproc:FormalizedTender.\
		?tender pproc:formalizedDate ?fechaFormalizacion.\
		OPTIONAL {?tender   pc:supplier ?empresaid.}\
		OPTIONAL {?empresaid <http://www.w3.org/ns/org#identifier> ?cif.}\
		OPTIONAL {?empresaid <http://schema.org/name> ?nombre.}\
		OPTIONAL {?uri pproc:managingDepartment ?managingDepartment.}\
		OPTIONAL {?managingDepartment dcterms:title ?servicioGestor.}\
		OPTIONAL {?managingDepartment dcterms:identifier ?id.}\
		OPTIONAL {?tender pc:offeredPrice ?offeredPriceVAT.\
				?offeredPriceVAT gr:hasCurrencyValue ?precio.\
				?offeredPriceVAT gr:valueAddedTaxIncluded "true"^^xsd:boolean.}\
	'+filtroyear+'}\
GROUP BY ?uri ?cif ?id ?precio ?fechaFormalizacion \
ORDER BY '+filtro;

//Se almacena en data toda la información devuelta en la consulta
$.getJSON(SPARQL_ENDPOINT + '?query=' + encodeURIComponent(query) + '&format=application%2Fsparql-results%2Bjson&timeout=0')
    .success(function(data) {
		var feature;
		//Se crea una tabla para mostrar los datos en ella

		var table = '';

		//Se le asigna un nombre a cada columna de la tabla

		
		//Se recorre el json devuelto en la consulta
		for (var i = 0; i < data.results.bindings.length; i++) {
			//Por cada elemento devuelto se pasa la información a la tabla
			feature = data.results.bindings[i];
			var uri = feature.uri.value;
			var expediente = uri.substring(59,uri.length);
			if(typeof feature.Cif == 'undefined'){
				var cif = new Object();
				cif.value = "";
				}
			else if(typeof feature.Cif !== 'undefined'){
				var cif = new Object();
				cif.value = feature.Cif.value;
				}
			if(typeof feature.Nombre == 'undefined'){
				var nombre = new Object();
				nombre.value = "";
				}
			else if(typeof feature.Nombre !== 'undefined'){
				var nombre = new Object();
				nombre.value = feature.Nombre.value;
				}
			if(typeof feature.ServicioGestor == 'undefined'){
				var servicioGestor = new Object();
				servicioGestor.value = "";
				}
			else if(typeof feature.ServicioGestor !== 'undefined'){
				var servicioGestor = new Object();
				servicioGestor.value = feature.ServicioGestor.value;
				}
			if(typeof feature.id == 'undefined'){
				var id = new Object();
				id.value = "";
				}
			else if(typeof feature.id !== 'undefined'){
				var id = new Object();
				id.value = feature.id.value;
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
			table += '<div class="col-xs-8"><p><a href="'+feature.uri.value+'" target=\"_blank\">'+feature.Titulo.value+' ('+expediente+')</a></p></div>';
			table += '</div>';
			table += '<div class="row">';
			table += '<div class="col-xs-4"><p>Adjudicatario</p></div>';
			table += '<div class="col-xs-8"><p>'+nombre.value+'</p></div>';
			table += '</div>';
			table += '<div class="row">';
			table += '<div class="col-xs-4"><p>CIF</p></div>';
			table += '<div class="col-xs-8"><p><a href="adjudicadosCIF.html?cif='+cif.value+'">'+cif.value + '</a></p></div>';
			table += '</div>';
			table += '<div class="row">';
			table += '<div class="col-xs-4"><p>Servicio Gestor</p></div>';
			table += '<div class="col-xs-8"><p><a href="adjudicadosPorServicioGestor.html?servicio='+id.value+'&nombre='+servicioGestor.value+'">'+servicioGestor.value + '</a></p></div>';
			table += '</div>';
			table += '<div class="row">';
			table += '<div class="col-xs-4"><p>Precio de adjudicación</p></div>';
			table += '<div class="col-xs-8"><p>'+Math.round(parseFloat(precio.value)).toLocaleString()+' €</p></div>';
			table += '</div>';
			table += '<div class="row">';
			table += '<div class="col-xs-4"><p>Fecha Formalización</p></div>';
			table += '<div class="col-xs-8"><p>'+feature.fechaFormalizacion.value+'</p></div>';
			table += '</div>';
			/*table += '<tr><td>' + '<a href="'+feature.uri.value+'">'+feature.Titulo.value+'</a>' + '</td><td>' + nombre.value + '</td><td>' + '<a href="adjudicadosCIF.html?cif='+cif.value+'">'+cif.value + '</a></td><td>' + '<a href="adjudicadosPorServicioGestor.html?servicio='+id.value+'">'+servicioGestor.value + '</a></td><td>' + precio.value + '</td><td>' + feature.fechaFormalizacion.value + '</td></tr>';   */
			
			
		}
		//Se cierra la tabla
		table += '';
		//Se inserta el contenido de la tabla en el elemento "tabla" creado en el HTML
		document.getElementById("tabla").innerHTML = table;
});
}

function sel_fecha (){
	var fecha = new Date();
	var ano = fecha.getFullYear();
	var ano1 = ano-1;
	var ano2 = ano-2;
	var ano3 = ano-3;
	var ano4 = ano-4;
	var impr = '';
	impr += '<select name="ano" id="ano_sel" class="form-control">'; 
	impr += '<option value="'+ano+'">'+ano+'</option>';
	impr += '<option value="'+ano1+'">'+ano1+'</option>';
	impr += '<option value="'+ano2+'">'+ano2+'</option>';
	impr += '<option value="'+ano3+'">'+ano3+'</option>';
	impr += '<option value="'+ano4+'">'+ano4+'</option>';
	impr += '</select>';
	document.getElementById("sel_fecha").innerHTML = impr;
}

function auxiliar() {
	var ano = document.getElementById("ano_sel").value;
	var orden = document.getElementById("ordenar_por").value;
	contratos(orden,ano);
}