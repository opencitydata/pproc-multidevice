function presupuestoVSasignado(ano){
//Se realiza la consulta SPARQL
var SPARQL_ENDPOINT = 'http://datos.zaragoza.es/sparql';
var query = 'SELECT DISTINCT * \
	WHERE\
	{\
		{\
			SELECT DISTINCT ?uri ?titulo ?presupuesto \
			WHERE {\
				?uri a pproc:Contract.\
				?uri dcterms:title ?titulo.\
				?uri pproc:contractObject ?objeto.\
				?uri pc:tender ?tender.\
				?objeto pproc:contractEconomicConditions ?economia.\
				?economia pproc:budgetPrice ?budget.\
				?budget<http://purl.org/goodrelations/v1#hasCurrencyValue> ?presupuesto.\
				?budget<http://purl.org/goodrelations/v1#valueAddedTaxIncluded> "true"^^xsd:boolean.\
				FILTER(?presupuesto > 0)\
			}\
		}\
		{\
			SELECT ?uri SUM(?precio) as ?Precio \
			WHERE{\
				?uri a pproc:Contract.\
				?uri pc:tender ?tender.\
				?tender a pproc:FormalizedTender.\
				?tender pc:offeredPrice ?offeredPriceVAT.\
				?offeredPriceVAT gr:hasCurrencyValue ?precio.\
				?offeredPriceVAT gr:valueAddedTaxIncluded "true"^^xsd:boolean.\
			}\
			GROUP BY ?uri \
		}\
		{\
			SELECT DISTINCT ?uri min(?fechaFormalizacion) as ?Fecha\
			WHERE {\
				?uri a pproc:Contract.\
				?uri pc:tender ?tender.\
				?tender a pproc:FormalizedTender.\
				?tender pproc:formalizedDate ?fechaFormalizacion.\
				FILTER ( regex(?fechaFormalizacion, "'+ano+'"))\
			}\
            GROUP BY ?uri\
		}\
	}\
	ORDER BY desc(?presupuesto)';
//Se almacena en data toda la información devuelta en la consulta
$.getJSON(SPARQL_ENDPOINT + '?query=' + encodeURIComponent(query) + '&format=application%2Fsparql-results%2Bjson&timeout=0')
   .success(function(data) {
	   console.log(data);
		var feature;
		//Se crea una tabla para mostrar los datos en ella
		var table = '';
		//Se le asigna un nombre a cada columna de la tabla
		
		//Se recorre el json devuelto en la consulta
		for (var i = 0; i < data.results.bindings.length; i++) {
			//Por cada elemento devuelto se pasa la información a la tabla
			feature = data.results.bindings[i];
			if(i%2==0)
				table += '<div class="caso1">';
			else
				table += '<div class="caso2">';
			table += '<div class="row">';
			table += '<div class="col-xs-4"><p>Titulo</p></div>';
			table += '<div class="col-xs-8"><p><a href="'+feature.uri.value+'">'+feature.titulo.value+'</a></p></div>';
			table += '</div>';
			table += '<div class="row">';
			table += '<div class="col-xs-4"><p>Presupuesto</p></div>';
			table += '<div class="col-xs-8"><p>'+Math.round(parseFloat(feature.presupuesto.value)).toLocaleString()+' €</p></div>';
			table += '</div>';
			table += '<div class="row">';
			table += '<div class="col-xs-4"><p>Adjudicado por</p></div>';
			table += '<div class="col-xs-8"><p>'+Math.round(parseFloat(feature.Precio.value)).toLocaleString()+' €</p></div>';
			table += '</div>';
			table += '<div class="row">';
			table += '<div class="col-xs-4"><p>Fecha Formalizacion</p></div>';
			table += '<div class="col-xs-8"><p>'+feature.Fecha.value+'</p></div>';
			table += '</div>';
			table += '</div>';
		}
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
	presupuestoVSasignado(ano);
}