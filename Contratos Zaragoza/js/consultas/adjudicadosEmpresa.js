function adjudicadosEmpresa(){
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
var fin = params['empresa'];
//En caso de que haya tildes, se soluciona el problema
fin = fin.replace(/%A1/g,"á");
fin = fin.replace(/%81/g,"Á");
fin = fin.replace(/%A9/g,"é");
fin = fin.replace(/%89/g,"É");
fin = fin.replace(/%AD/g,"í");
fin = fin.replace(/%8D/g,"Í");
fin = fin.replace(/%B3/g,"ó");
fin = fin.replace(/%93/g,"Ó");
fin = fin.replace(/%BA/g,"ú");
fin = fin.replace(/%9A/g,"Ú");
fin = fin.replace(/%B1/g,"ñ");
fin = fin.replace(/%91/g,"Ñ");
fin = fin.replace(/%20/g," ");
fin = fin.replace(/%C3/g,"");


//Se le asigna valor al div "empresa" del HTML
document.getElementById("empresa").innerHTML = fin;
console.log(fin);
//Se realiza la consulta SPARQL
var SPARQL_ENDPOINT = 'http://datos.zaragoza.es/sparql';
var query = 'SELECT DISTINCT ?empresa ucase(replace(replace(replace(?cif," ",""),"-",""),"/.","")) as ?Cif\
		WHERE { \
			?uri a pproc:Contract. \
			?uri pc:tender ?tender. \
			?tender   pc:supplier ?empresaid. \
			?empresaid <http://www.w3.org/ns/org#identifier> ?cif. \
			?empresaid <http://schema.org/name> ?empresa. \
			FILTER(regex(?empresa,"'+fin+'","i")) \
		}';
//Se almacena en data toda la información devuelta en la consulta
$.getJSON(SPARQL_ENDPOINT + '?query=' + encodeURIComponent(query) + '&format=application%2Fsparql-results%2Bjson&timeout=0')
	.success(function(data) {
		var feature;
		//Se crea una tabla para mostrar los datos en ella
		var table = '<table>';
		//Se le asigna un nombre a cada columna de la tabla
		table += '<tr> <td><h2>Empresa</h2></td></tr>';
		//Se recorre el json devuelto en la consulta
		for (var i = 0; i < data.results.bindings.length; i++) {
			//Por cada elemento devuelto se pasa la información a la tabla
			feature = data.results.bindings[i];
			//El elemento devuelto incluye un enlace a los contratos de la empresa
			table += '<tr><td>' + '<a href="adjudicadosCIF.html?cif='+feature.Cif.value+'">'+feature.empresa.value+'</td><td>' + feature.Cif.value + '</td></tr>';
		}
		//Se cierra la tabla
		table += '</table>';
		if (data.results.bindings.length == 0)
			table = '</br><h3>No se encontaron empresas con dicho nombre</h3>';
		//Se inserta el contenido de la tabla en el elemento "tabla" creado en el HTML
		document.getElementById("tabla").innerHTML = table;
});
}