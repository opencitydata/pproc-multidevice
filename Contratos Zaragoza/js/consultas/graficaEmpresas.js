function asignar(cif, empresas) {
	var out = 0;
	var i = 0;
	var res = 0;
	while(out==0){
		if (empresas.results.bindings[i].CIF.value === cif.value){
			res = empresas.results.bindings[i].empresa.value;
			out = 1;
		}
		i++;
	}
	return res;
	
}
function graficaEmpresasMovil(){
var SPARQL_ENDPOINT = 'http://datos.zaragoza.es/sparql';
var query = '	SELECT DISTINCT replace(replace(replace(?cif," ",""),"-",""),"/.","") as ?CIF COUNT(?Titulo) as ?Contratos \
	WHERE {\
	?uri a <http://contsem.unizar.es/def/sector-publico/pproc#Contract>.\
	?uri dcterms:title ?Titulo.\
	?uri <http://purl.org/procurement/public-contracts#tender> ?a.\
	?a   <http://purl.org/procurement/public-contracts#supplier> ?empresaid.\
	?empresaid <http://www.w3.org/ns/org#identifier> ?cif.\
	}\
GROUP BY replace(replace(replace(?cif," ",""),"-",""),"/.","")\
	ORDER BY desc(?Contratos)\
	LIMIT 20';

//Se almacena en data toda la información devuelta en la consulta
d3.json("empresas-cif.json", function(error, empresas) {
  if (error) throw error;	
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
			var nombre = asignar(feature.CIF,empresas);
			if(i%2==0)
				table += '<div class="caso1">';
			else
				table += '<div class="caso2">';
			table += '<div class="row">';
			table += '<div class="col-xs-4"><p>Empresa</p></div>';
			table += '<div class="col-xs-8"><p>'+nombre+'</a></p></div>';
			table += '</div>';
			table += '<div class="row">';
			table += '<div class="col-xs-4"><p>Contratos Firmados</p></div>';
			table += '<div class="col-xs-8"><p>'+feature.Contratos.value+'</p></div>';
			table += '</div>';
			table += '</div>';
		}
		//Se inserta el contenido de la tabla en el elemento "tabla" creado en el HTML
		document.getElementById("grafico").innerHTML = table;
   });
   });
}
function graficaEmpresas(){
//Información necesaria para dibujar el gráfico


var bleed = 100,
    width = 850,
    height = 550;

var pack = d3.layout.pack()
    .sort(null)
    .size([width, height + bleed * 2])
    .padding(2);
	
var color = d3.scale.ordinal()
	.domain(["Sqoop", "Pig", "Apache", "a", "b", "c", "d", "e", "f", "g"])
	.range(["steelblue", "pink", "lightgreen", "violet", "orangered", "green", "orange", "skyblue", "gray", "aqua"]);
	
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(0," + -bleed + ")");


//Se realiza la consulta			
var SPARQL_ENDPOINT = 'http://datos.zaragoza.es/sparql';
var query = '	SELECT DISTINCT replace(replace(replace(?cif," ",""),"-",""),"/.","") as ?CIF COUNT(?Titulo) as ?Contratos \
	WHERE {\
	?uri a <http://contsem.unizar.es/def/sector-publico/pproc#Contract>.\
	?uri dcterms:title ?Titulo.\
	?uri <http://purl.org/procurement/public-contracts#tender> ?a.\
	?a   <http://purl.org/procurement/public-contracts#supplier> ?empresaid.\
	?empresaid <http://www.w3.org/ns/org#identifier> ?cif.\
	}\
GROUP BY replace(replace(replace(?cif," ",""),"-",""),"/.","")\
	ORDER BY desc(?Contratos)\
	LIMIT 10';

//Se almacena en data toda la información devuelta en la consulta
d3.json("empresas-cif.json", function(error, empresas) {
  if (error) throw error;	
$.getJSON(SPARQL_ENDPOINT + '?query=' + encodeURIComponent(query) + '&format=application%2Fsparql-results%2Bjson&timeout=0')
   .success(function(data) {
	   var node = svg.selectAll(".node")
      .data(pack.nodes(classes(data.results,empresas))
				.filter(function (d) {
					return !d.children;
				}))
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  node.append("circle")
      .attr("r", function(d) { return d.r; })
	  .style("fill", function (d, i) {
			return color(i);
		});

  node.append("text")
      .text(function(d) { return d.className + ": " + d.value; })
      .style("font-size", function(d) { return Math.min(2 * d.r, (2 * d.r - 8) / this.getComputedTextLength() * 24) + "px"; })
      .attr("dy", ".35em");
});
});

// Returns a flattened hierarchy containing all leaf nodes under the root.

function classes(root,empresas) {
	var classes = [];

	function recurse(name, node) {
		if (node.bindings) node.bindings.forEach(function (child) {
			recurse(node.CIF, child);
		});
		
		else classes.push({
			packageName: name,
			className: asignar(node.CIF, empresas),
			value: node.Contratos.value
		});
		console.log(node.CIF);
		
	}
	recurse(null, root);
	return {
		children: classes
	};
}

//Fucnion para asignar nombres a los CIFs del resultado.
function asignar(cif, empresas) {
	var out = 0;
	var i = 0;
	var res = 0;
	while(out==0){
		if (empresas.results.bindings[i].CIF.value === cif.value){
			res = empresas.results.bindings[i].empresa.value;
			out = 1;
		}
		i++;
	}
	return res;
	
}
d3.select(self.frameElement).style("height", height + "px");
}