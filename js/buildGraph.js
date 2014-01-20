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

    edges.append("text").text("hi");

    var nodes = svg.selectAll("circle")
        .data(data.nodes)
        .enter()
        .append("circle")
        .attr("r", 10)
        .style("fill", function(d, i) {
            
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
        .text(function(d) { return d.name; });

    var edgepaths = svg.selectAll(".edgepath")
        .data(edgesByPosition)
        .enter()
        .append('path')
        .attr({'d': function(d) {return 'M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y;},
               'class':'edgepath',
               'fill-opacity':0,
               'stroke-opacity':0,
               'fill':'blue',
               'stroke':'red',
               'id':function(d,i) {return 'edgepath'+i;}})
        .style("pointer-events", "none");

    // http://bl.ocks.org/jhb/5955887 for edge labels
    var edgelabels = svg.selectAll(".edgelabel")
        .data(edgesByPosition)
        .enter()
        .append('text')
        .style("pointer-events", "none")
        .attr({'class':'edgelabel',
               'id':function(d,i){return 'edgelabel'+i;},
               'dx':80,
               'dy':0,
               'font-size':10,
               'fill':'#aaa'});

    edgelabels.append('textPath')
        .attr('xlink:href',function(d,i) {return '#edgepath'+i;})
        .style("pointer-events", "none")
        .text(function(d,i){return 'label '+i;});


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
        
        edgepaths.attr('d', function(d) { var path='M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y;
                return path;});    

    });
}