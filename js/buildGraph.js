/*
 * This is the code for building a graph representation using D3.
 * The initial code if for transforming an XML representation I use 
 * into D3's representation. The stuff following that is for normal D3 layouts
 * 
    Brian J. Stinar
    Noventum Custom Software Development 
    505-750-1169  - Call me if you want to talk or have questions. 
    I like that more than email. 
 */



// I'm thinking this will actually go into graphTheory.js
// For using other visualization routines (i.e. graph-visualization) 
// https://github.com/davidpiegza/Graph-Visualization/blob/master/index_example.html
// It is nice to have disjoint sections connected, so they do not fly off into infinity
function joinDisjointSections()
{
    // create a new virtual node, with datatype of "virtual"
    
    // Get the different disjoint sections
    
    // For each disjoint section
    //   Attach the first node to the virtual node, with an invisible edge 
    
}

// TODO: Remove all the gloabls from this file. This should be the only thing in here.
function buildGraph(data)
{
    this.buildTextFromDescription = function()
    {        
        svg.selectAll("text").text(function(d) { return d.description; });
    };
    
    this.buildTextFromDistance = function()
    {
        svg.selectAll("text").text(function(d) { return d.distance + "  distance : " + d.distance; });
    };

    function transformText(d) 
    {
        return "translate(" + d.x + 1000 + "," + d.y + ")";
    };
    
    var w = 1280;
    var h = 1024;

    var svg = d3.select("body")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    var colors = d3.scale.category10();

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
        .charge([-1500])  
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
        
    edges.append("text").text("hi");

    // TODO: abstract this out. I don't need 400-line functions
    var nodes = svg.selectAll("circle")
        .data(data.nodes)
        .enter()
        .append("circle")
        .attr("r", 10)
        .style("fill", function(d, i) 
        {
            switch (d.type)
            {
                case "source":
                    return d3.rgb(0, 255, 0);
                case "visited" :
                    return d3.rgb(255, 255, 255);
                case "1": // Believe, or cluster 1
                    return d3.rgb(255, 10, 200);
                case "2": // Action, or cluster 2
                    return d3.rgb(200, 10, 10);   
                default:
                    return colors(d.type);
            }

        })
        .call(force.drag);
        
    var text =  svg.append("g").selectAll("text")
        .data(force.nodes())
        .enter().append("text")
        .attr("x", 10)
        .attr("y", ".31em");
    
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

    this.buildTextFromDescription(); // Default behavior, which gets over-written by Djesktra's
    return this;
}
