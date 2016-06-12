//Se realiza la consulta SPARQL
function presupuestoProcedimiento(ano) {
var SPARQL_ENDPOINT = 'http://datos.zaragoza.es/sparql';
var query ='SELECT DISTINCT SUM(?presupuesto) as ?Presupuesto ?procedimiento\
			WHERE{\
				?uri a pproc:Contract.\
                ?uri pc:tender ?tender.\
				?tender a pproc:FormalizedTender.\
				?tender pproc:formalizedDate ?fechaFormalizacion.\
                ?uri pproc:contractProcedureSpecifications ?procedureType.\
		        ?procedureType pproc:procedureType  ?procedimiento.\
				?uri pproc:contractObject ?objeto.\
				?objeto pproc:contractEconomicConditions ?economia.\
				?economia pproc:budgetPrice ?budget.\
				?budget<http://purl.org/goodrelations/v1#hasCurrencyValue> ?presupuesto.\
				?budget<http://purl.org/goodrelations/v1#valueAddedTaxIncluded> "true"^^xsd:boolean.\
				FILTER ( regex(?fechaFormalizacion, "'+ano+'"))\
				FILTER(?presupuesto > 0)\
			}\
GROUP BY ?procedimiento \
ORDER BY desc(?Presupuesto)';

//Se almacena en data toda la información devuelta en la consulta
$.getJSON(SPARQL_ENDPOINT + '?query=' + encodeURIComponent(query) + '&format=application%2Fsparql-results%2Bjson&timeout=0')
    .success(function(data) {
		var feature;
		//Se crea una tabla para mostrar los datos en ella
		var table = '';
		var total = 0;
		//Se recorre el json devuelto en la consulta
		for (var i = 0; i < data.results.bindings.length; i++) {
			feature = data.results.bindings[i];
			total += Math.round(parseFloat(feature.Presupuesto.value));
		}
		for (var i = 0; i < data.results.bindings.length; i++) {
			//Por cada elemento devuelto se pasa la información a la tabla
			feature = data.results.bindings[i];
			var aux = "";
			if (feature.procedimiento.value == "http://contsem.unizar.es/def/sector-publico/pproc#RegularOpen")
				aux = "Regular Abierto";
			else if (feature.procedimiento.value == "http://contsem.unizar.es/def/sector-publico/pproc#Minor")
				aux = "Menor";
			else if (feature.procedimiento.value == "http://contsem.unizar.es/def/sector-publico/pproc#Negotiated")
				aux = "Negociado";
			else if (feature.procedimiento.value == "http://purl.org/procurement/public-contracts#Restricted")
				aux = "Restringido";
			
			if(i%2==0)
				table += '<div class="caso1">';
			else
				table += '<div class="caso2">';
			table += '<div class="row">';
			table += '<div class="col-xs-4"><p>Tipo de procedimiento</p></div>';
			table += '<div class="col-xs-8"><p>'+aux+'</p></div>';
			table += '</div>';
			table += '<div class="row">';
			table += '<div class="col-xs-4"><p>Presupuesto Total</p></div>';
			table += '<div class="col-xs-8"><p>'+Math.round(parseFloat(feature.Presupuesto.value)).toLocaleString()+' €</p></div>';
			table += '</div>';
			table += '<div class="row">';
			table += '<div class="col-xs-4"><p>Porcentaje</p></div>';
			table += '<div class="col-xs-8"><p>'+Math.round((100*feature.Presupuesto.value/total)).toLocaleString()+'%</p></div>';
			table += '</div>';
			table += '</div>';	
		}
		if (data.results.bindings.length == 0)
			table = '</br><h3>No se encontaron contratos con estas características</h3>';
		//Se cierra la tabla
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
	presupuestoProcedimiento(ano);
}