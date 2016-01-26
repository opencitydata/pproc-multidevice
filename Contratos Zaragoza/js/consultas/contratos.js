//Se realiza la consulta SPARQL
function contratos(filtro,year,boton) {
	console.log("Valor de boton :" + boton);
	console.log("Año: " + year);
var filtroyear = 'FILTER ( regex(?fechaFormalizacion, "'+year+'"))';
var filtrofiltro = 'ORDER BY '+filtro+'';
console.log(filtrofiltro);
var SPARQL_ENDPOINT = 'http://datos.zaragoza.es/sparql';
var query ='SELECT DISTINCT ?uri min(?titulo) as ?Titulo min(?nombre) as ?Nombre ?fechaFormalizacion ucase(replace(replace(replace(?cif," ",""),"-",""),"/.","")) as ?Cif min(?servicioGestor) as ?ServicioGestor ?id ?precio \
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
'+filtrofiltro+'';

//Se almacena en data toda la información devuelta en la consulta
$.getJSON(SPARQL_ENDPOINT + '?query=' + encodeURIComponent(query) + '&format=application%2Fsparql-results%2Bjson&timeout=0')
    .success(function(data) {
		var feature;
		//Se crea una tabla para mostrar los datos en ella
		var fecha = new Date();
		var ano = fecha.getFullYear();
		var fechas = '<table>';
		var table = '<table>';
		var ano1 = ano-1;
		var ano2 = ano-2;
		var ano3 = ano-3;
		var ano4 = ano-4;
		var ano5 = ano-5;
		//Se le asigna un nombre a cada columna de la tabla
		if (year == ano)
			fechas = '<h2><text style="cursor: pointer" onclick=contratos("'+filtro+'",'+ano1+',"'+boton+'");><u>'+ano1+'</u></text></h2> <h2>'+year+'</h2>';
		else if (year == ano1)
			fechas = '<h2><text style="cursor: pointer" onclick=contratos("'+filtro+'",'+ano2+',"'+boton+'");><u>'+ano2+'</u></text></h2> <h2>'+year+'</h2> <h2><text style="cursor: pointer" onclick=contratos("'+filtro+'",'+ano+',"'+boton+'");><u>'+ano+'</u></text></h2>';
		else if (year == ano2)
			fechas = '<h2><text style="cursor: pointer" onclick=contratos("'+filtro+'",'+ano3+',"'+boton+'");><u>'+ano3+'</u></text></h2> <h2>'+year+'</h2> <h2><text style="cursor: pointer" onclick=contratos("'+filtro+'",'+ano1+',"'+boton+'");><u>'+ano1+'</u></text></h2>';
		else if (year == ano3)
			fechas = '<h2><text style="cursor: pointer" onclick=contratos("'+filtro+'",'+ano4+',"'+boton+'");><u>'+ano4+'</u></text></h2> <h2>'+year+'</h2> <h2><text style="cursor: pointer" onclick=contratos("'+filtro+'",'+ano2+',"'+boton+'");><u>'+ano2+'</u></text></h2>';
		else if (year == ano4)
			fechas = '<h2>'+year+'</h2> <h2><text style="cursor: pointer" onclick=contratos("'+filtro+'",'+ano3+',"'+boton+'");><u>'+ano3+'</u></text></h2>';
		if(boton == "Nombre")
			table += '<tr><td> <h2><text style="cursor: pointer" onclick=contratos("?Titulo","'+year+'","Titulo");><u>Título</u></text></h2> </td><td> <h2><text style="cursor: pointer" onclick=contratos("desc(?Nombre)","'+year+'","Nombreinv");><u>Empresa</u></text></h2> </td><td> <h2><text style="cursor: pointer" onclick=contratos("?Cif","'+year+'","CIF");><u>CIF</u></text></h2> </td><td> <h2><text style="cursor: pointer" onclick=contratos("?ServicioGestor","'+year+'","SG");><u>Servicio Gestor</u></text></h2> </td><td> <h2><text style="cursor: pointer" onclick=contratos("?precio","'+year+'","Precio")><u>Precio</u></text></h2> </td><td><h2><text style="cursor: pointer" onclick=contratos("?fechaFormalizacion","'+year+'","FF")><u>Fecha Formalización</u></text></h2> </td></tr>';
		else if(boton == "Nombreinv")
			table += '<tr><td> <h2><text style="cursor: pointer" onclick=contratos("?Titulo","'+year+'","Titulo");><u>Título</u></text></h2> </td><td> <h2><text style="cursor: pointer" onclick=contratos("?Nombre","'+year+'","Nombre");><u>Empresa</u></text></h2> </td><td> <h2><text style="cursor: pointer" onclick=contratos("?Cif","'+year+'","CIF");><u>CIF</u></text></h2> </td><td> <h2><text style="cursor: pointer" onclick=contratos("?ServicioGestor","'+year+'","SG");><u>Servicio Gestor</u></text></h2> </td><td> <h2><text style="cursor: pointer" onclick=contratos("?precio","'+year+'","Precio")><u>Precio</u></text></h2> </td><td><h2><text style="cursor: pointer" onclick=contratos("?fechaFormalizacion","'+year+'","FF")><u>Fecha Formalización</u></text></h2> </td></tr>';
		else if(boton == "Precio")
			table += '<tr><td> <h2><text style="cursor: pointer" onclick=contratos("?Titulo","'+year+'","Titulo");><u>Título</u></text></h2> </td><td> <h2><text style="cursor: pointer" onclick=contratos("?Nombre","'+year+'","Nombre");><u>Empresa</u></text></h2> </td><td> <h2><text style="cursor: pointer" onclick=contratos("?Cif","'+year+'","CIF");><u>CIF</u></text></h2> </td><td> <h2><text style="cursor: pointer" onclick=contratos("?ServicioGestor","'+year+'","SG");><u>Servicio Gestor</u></text></h2> </td><td> <h2><text style="cursor: pointer" onclick=contratos("desc(?precio)","'+year+'","Precioinv")><u>Precio</u></text></h2> </td><td><h2><text style="cursor: pointer" onclick=contratos("?fechaFormalizacion","'+year+'","FF")><u>Fecha Formalización</u></text></h2> </td></tr>';
		else if(boton == "Precioinv")
			table += '<tr><td> <h2><text style="cursor: pointer" onclick=contratos("?Titulo","'+year+'","Titulo");><u>Título</u></text></h2> </td><td> <h2><text style="cursor: pointer" onclick=contratos("?Nombre","'+year+'","Nombre");><u>Empresa</u></text></h2> </td><td> <h2><text style="cursor: pointer" onclick=contratos("?Cif","'+year+'","CIF");><u>CIF</u></text></h2> </td><td> <h2><text style="cursor: pointer" onclick=contratos("?ServicioGestor","'+year+'","SG");><u>Servicio Gestor</u></text></h2> </td><td> <h2><text style="cursor: pointer" onclick=contratos("?precio","'+year+'","Precio")><u>Precio</u></text></h2> </td><td><h2><text style="cursor: pointer" onclick=contratos("?fechaFormalizacion","'+year+'","FF")><u>Fecha Formalización</u></text></h2> </td></tr>';
		else if(boton == "Titulo")
			table += '<tr><td> <h2><text style="cursor: pointer" onclick=contratos("desc(?Titulo)","'+year+'","Tituloinv");><u>Título</u></text></h2> </td><td> <h2><text style="cursor: pointer" onclick=contratos("?Nombre","'+year+'","Nombre");><u>Empresa</u></text></h2> </td><td> <h2><text style="cursor: pointer" onclick=contratos("?Cif","'+year+'","CIF");><u>CIF</u></text></h2> </td><td> <h2><text style="cursor: pointer" onclick=contratos("?ServicioGestor","'+year+'","SG");><u>Servicio Gestor</u></text></h2> </td><td> <h2><text style="cursor: pointer" onclick=contratos("?precio","'+year+'","Precio")><u>Precio</u></text></h2> </td><td><h2><text style="cursor: pointer" onclick=contratos("?fechaFormalizacion","'+year+'","FF")><u>Fecha Formalización</u></text></h2> </td></tr>';
		else if(boton == "Tituloinv")
			table += '<tr><td> <h2><text style="cursor: pointer" onclick=contratos("?Titulo","'+year+'","Titulo");><u>Título</u></text></h2> </td><td> <h2><text style="cursor: pointer" onclick=contratos("?Nombre","'+year+'","Nombre");><u>Empresa</u></text></h2> </td><td> <h2><text style="cursor: pointer" onclick=contratos("?Cif","'+year+'","CIF");><u>CIF</u></text></h2> </td><td> <h2><text style="cursor: pointer" onclick=contratos("?ServicioGestor","'+year+'","SG");><u>Servicio Gestor</u></text></h2> </td><td> <h2><text style="cursor: pointer" onclick=contratos("?precio","'+year+'","Precio")><u>Precio</u></text></h2> </td><td><h2><text style="cursor: pointer" onclick=contratos("?fechaFormalizacion","'+year+'","FF")><u>Fecha Formalización</u></text></h2> </td></tr>';
		else if(boton == "CIF")
			table += '<tr><td> <h2><text style="cursor: pointer" onclick=contratos("?Titulo","'+year+'","Titulo");><u>Título</u></text></h2> </td><td> <h2><text style="cursor: pointer" onclick=contratos("?Nombre","'+year+'","Nombre");><u>Empresa</u></text></h2> </td><td> <h2><text style="cursor: pointer" onclick=contratos("desc(?Cif)","'+year+'","CIFinv");><u>CIF</u></text></h2> </td><td> <h2><text style="cursor: pointer" onclick=contratos("?ServicioGestor","'+year+'","SG");><u>Servicio Gestor</u></text></h2> </td><td> <h2><text style="cursor: pointer" onclick=contratos("?precio","'+year+'","Precio")><u>Precio</u></text></h2> </td><td><h2><text style="cursor: pointer" onclick=contratos("?fechaFormalizacion","'+year+'","FF")><u>Fecha Formalización</u></text></h2> </td></tr>';
		else if(boton == "CIFinv")
			table += '<tr><td> <h2><text style="cursor: pointer" onclick=contratos("?Titulo","'+year+'","Titulo");><u>Título</u></text></h2> </td><td> <h2><text style="cursor: pointer" onclick=contratos("?Nombre","'+year+'","Nombre");><u>Empresa</u></text></h2> </td><td> <h2><text style="cursor: pointer" onclick=contratos("?Cif","'+year+'","CIF");><u>CIF</u></text></h2> </td><td> <h2><text style="cursor: pointer" onclick=contratos("?ServicioGestor","'+year+'","SG");><u>Servicio Gestor</u></text></h2> </td><td> <h2><text style="cursor: pointer" onclick=contratos("?precio","'+year+'","Precio")><u>Precio</u></text></h2> </td><td><h2><text style="cursor: pointer" onclick=contratos("?fechaFormalizacion","'+year+'","FF")><u>Fecha Formalización</u></text></h2> </td></tr>';
		else if(boton=="SG")
			table += '<tr><td> <h2><text style="cursor: pointer" onclick=contratos("?Titulo","'+year+'","Titulo");><u>Título</u></text></h2> </td><td> <h2><text style="cursor: pointer" onclick=contratos("?Nombre","'+year+'","Nombre");><u>Empresa</u></text></h2> </td><td> <h2><text style="cursor: pointer" onclick=contratos("?Cif","'+year+'","CIF");><u>CIF</u></text></h2> </td><td> <h2><text style="cursor: pointer" onclick=contratos("desc(?ServicioGestor)","'+year+'","SGinv");><u>Servicio Gestor</u></text></h2> </td><td> <h2><text style="cursor: pointer" onclick=contratos("?precio","'+year+'","Precio")><u>Precio</u></text></h2> </td><td><h2><text style="cursor: pointer" onclick=contratos("?fechaFormalizacion","'+year+'","FF")><u>Fecha Formalización</u></text></h2> </td></tr>';
		else if(boton=="SGinv")
			table += '<tr><td> <h2><text style="cursor: pointer" onclick=contratos("?Titulo","'+year+'","Titulo");><u>Título</u></text></h2> </td><td> <h2><text style="cursor: pointer" onclick=contratos("?Nombre","'+year+'","Nombre");><u>Empresa</u></text></h2> </td><td> <h2><text style="cursor: pointer" onclick=contratos("?Cif","'+year+'","CIF");><u>CIF</u></text></h2> </td><td> <h2><text style="cursor: pointer" onclick=contratos("?ServicioGestor","'+year+'","SG");><u>Servicio Gestor</u></text></h2> </td><td> <h2><text style="cursor: pointer" onclick=contratos("?precio","'+year+'","Precio")><u>Precio</u></text></h2> </td><td><h2><text style="cursor: pointer" onclick=contratos("?fechaFormalizacion","'+year+'","FF")><u>Fecha Formalización</u></text></h2> </td></tr>';
		else if(boton == "FF")
			table += '<tr><td> <h2><text style="cursor: pointer" onclick=contratos("?Titulo","'+year+'","Titulo");><u>Título</u></text></h2> </td><td> <h2><text style="cursor: pointer" onclick=contratos("?Nombre","'+year+'","Nombre");><u>Empresa</u></text></h2> </td><td> <h2><text style="cursor: pointer" onclick=contratos("?Cif","'+year+'","CIF");><u>CIF</u></text></h2> </td><td> <h2><text style="cursor: pointer" onclick=contratos("?ServicioGestor","'+year+'","SG");><u>Servicio Gestor</u></text></h2> </td><td> <h2><text style="cursor: pointer" onclick=contratos("?precio","'+year+'","Precio")><u>Precio</u></text></h2> </td><td><h2><text style="cursor: pointer" onclick=contratos("desc(?fechaFormalizacion)","'+year+'","FFinv")><u>Fecha Formalización</u></text></h2> </td></tr>';
		else
			table += '<tr><td> <h2><text style="cursor: pointer" onclick=contratos("?Titulo","'+year+'","Titulo");><u>Título</u></text></h2> </td><td> <h2><text style="cursor: pointer" onclick=contratos("?Nombre","'+year+'","Nombre");><u>Empresa</u></text></h2> </td><td> <h2><text style="cursor: pointer" onclick=contratos("?Cif","'+year+'","CIF");><u>CIF</u></text></h2> </td><td> <h2><text style="cursor: pointer" onclick=contratos("?ServicioGestor","'+year+'","SG");><u>Servicio Gestor</u></text></h2> </td><td> <h2><text style="cursor: pointer" onclick=contratos("?precio","'+year+'","Precio")><u>Precio</u></text></h2> </td><td><h2><text style="cursor: pointer" onclick=contratos("?fechaFormalizacion","'+year+'","FF")><u>Fecha Formalización</u></text></h2> </td></tr>';
		
		//Se recorre el json devuelto en la consulta
		for (var i = 0; i < data.results.bindings.length; i++) {
			//Por cada elemento devuelto se pasa la información a la tabla
			feature = data.results.bindings[i];
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
			table += '<tr><td>' + '<a href="'+feature.uri.value+'">'+feature.Titulo.value+'</a>' + '</td><td>' + nombre.value + '</td><td>' + '<a href="adjudicadosCIF.html?cif='+cif.value+'">'+cif.value + '</a></td><td>' + '<a href="adjudicadosPorServicioGestor.html?servicio='+id.value+'">'+servicioGestor.value + '</a></td><td>' + precio.value + '</td><td>' + feature.fechaFormalizacion.value + '</td></tr>';   
			
			
		}
		//Se cierra la tabla
		table += '</table>';
		//Se inserta el contenido de la tabla en el elemento "tabla" creado en el HTML
		document.getElementById("fecha").innerHTML = fechas;
		document.getElementById("tabla").innerHTML = table;
});
}