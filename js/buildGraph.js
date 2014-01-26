/*
 * This is the code for building a graph representation using D3. 
 * 
    Brian J. Stinar
    Noventum Custom Software Development 
    505-750-1169  - Call me if you want to talk or have questions. 
    I like that more than email. 
 */

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
        edgesByPosition.push({"source": targetNode, "target": sourceNode , "weight": 1}); // Delete this if we only have single directionaly edges.
    });
    
    var force = d3.layout.force()
        .nodes(data.nodes)
        .links(edgesByPosition)
        .size([w, h])
        .linkDistance([100])
        .charge([-2000])  
        .start();

    svg.append("svg:defs").selectAll("marker")  // Remove this if not interested in directional markings
        .data(["arrow"])
        .enter().append("svg:marker")
        .attr("id", String)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 10)
        .attr("refY", 0)
        .attr("markerWidth", 10)
        .attr("markerHeight", 10)
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M0,-5L10,0L0,0");

    var edges = svg.selectAll("line")
        .data(edgesByPosition)
        .enter()
        .append("svg:line")
        .attr("class", "link arrow")
        .attr("marker-end", "url(#arrow)");
        
        /*
        .style("stroke", "#ccc")
        .style("stroke-width", 1)
        .attr("class", "link arrow")
        .attr("marker-end", "url(#arrow)");;*/

    edges.append("text").text("hi");

    var nodes = svg.selectAll("circle")
        .data(data.nodes)
        .enter()
        .append("circle")
        .attr("r", 10)
        .style("fill", function(d, i) 
        {
            
            if (d.type === "1") // Hypothesis / Belief
            {
                 return d3.rgb(255, 10, 200);   
            }
    
            if (d.type === "2") // Action
            {
                 return d3.rgb(200, 10, 10);   
            }
            
            if (d.type === "source")
            {
                return d3.rgb(0, 255, 0);
            }
            
            if (d.type === "unvisited")
            {
                return d3.rgb(0, 0 ,0);
            }
            
            if (d.type === "visited")
            {
                return d3.rgb(255, 255, 255);
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
        .text(function(d) { return d.name + "  distance : " + d.distance; });

    function transformText(d) 
    {
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