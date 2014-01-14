function buildGraph(data)
{
    var w = 1000;
    var h = 600;

    var svg = d3.select("body")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    var colors = d3.scale.category10();
    console.log(data);

    var edgesByPosition = [];
            
    data.edges.forEach(function(e) 
    {  
        // Get the source and target nodes
        var sourceNode = data.nodes.filter(function(n) { return n.name === e.source; })[0],
        targetNode = data.nodes.filter(function(n) { return n.name   === e.target; })[0];
        edgesByPosition.push({"source": sourceNode, "target": targetNode, "weight": 1}); // Add the edge to the array
    });
    
    var force = d3.layout.force()
        .nodes(data.nodes)
        .links(edgesByPosition)
        .size([w, h])
        .linkDistance([100])
        .charge([-2000])  
        .start();

    var edges = svg.selectAll("line")
        .data(edgesByPosition)
        .enter()
        .append("line")
        .style("stroke", "#ccc")
        .style("stroke-width", 1);

    var nodes = svg.selectAll("circle")
        .data(data.nodes)
        .enter()
        .append("circle")
        .attr("r", 10)
        .style("fill", function(d, i) {
            
            // Have this conditional on the type of node
            
            if (d.type === "1") // Hypothesis / Belief
            {
                 return d3.rgb(255, 10, 200);   
            }
    
            if (d.type === "2") // Action
            {
                 return d3.rgb(200, 10, 10);   
            }
            else
            {
                return colors(i);
            }
        })
        .call(force.drag);
        
    var text = svg.append("g").selectAll("text")
        .data(force.nodes())
        .enter().append("text")
        .attr("x", 10)
        .attr("y", ".31em")
        .text(function(d) { return d.name; });

    function transformText(d) {
        return "translate(" + d.x + 1000 + "," + d.y + ")";
    }
            
    force.on("tick", function() 
    {
        edges.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        nodes.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });

        text.attr("transform", transformText);

    });
}