function graficaEmpresas(){
//Información necesaria para dibujar el gráfico

var diameter = 1500,
	format = d3.format(",d");

var color = d3.scale.ordinal()
	.domain(["Sqoop", "Pig", "Apache", "a", "b", "c", "d", "e", "f", "g"])
	.range(["steelblue", "pink", "lightgreen", "violet", "orangered", "green", "orange", "skyblue", "gray", "aqua"]);

var bubble = d3.layout.pack()
	.sort(null)
	.size([diameter, diameter])
	.padding(10);

var svg = d3.select("#grafico").append("svg")
	.attr("width", diameter)
	.attr("height", diameter)
	.attr("class", "bubble");
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
	LIMIT 20';

//Se almacena en data toda la información devuelta en la consulta
d3.json("empresas-cif.json", function(error, empresas) {
  if (error) throw error;	
$.getJSON(SPARQL_ENDPOINT + '?query=' + encodeURIComponent(query) + '&format=application%2Fsparql-results%2Bjson&timeout=0')
   .success(function(data) {
	   //Se dibujan los datos
		var node = svg.selectAll(".node")
			.data(bubble.nodes(classes(data.results,empresas))
				.filter(function (d) {
					return !d.children;
				}))
			.enter().append("g")
			.attr("class", "node")
			.attr("transform", function (d) {
				return "translate(" + d.x + "," + d.y + ")";
			});

	node.append("title")
		.text(function(d) { return d.className.value + ": " + d.value; });

	node.append("circle")
		.attr("r", function (d) {
			return d.r;
		})
		.style("fill", function (d, i) {
			return color(i);
		});

	node.append("text")
	  .attr("dy", ".3em")
	  .style("text-anchor", "middle")
	  .text(function(d) { return (d.className + ": " + d.value); });
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
d3.select(self.frameElement).style("height", diameter + "px");
}