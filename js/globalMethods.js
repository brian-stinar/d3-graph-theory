/* 
 * Global methods. I don't really like these, but I'm not 100% sure where to put 
 * them right now... This is better than in buildGraph.js
 * 
    Brian J. Stinar
    Noventum Custom Software Development 
    505-750-1169  - Call me if you want to talk or have questions. 
    I like that more than email. 
 */

// Maybe I can put these generate routines into a generator object? 
function generateFourSubgraphs()
{
    var data = generateSixRingGraph();
    
    data["nodes"].push({"name" : "7"}, {"name" : "8"}, {"name" : "9"}, {"name" : "10"});
    data["edges"].push({"source" : "7", "target" : "8"}, {"source" : "7", "target" : "9"}, {"source" : "7", "target" : "10"});

    data["nodes"].push({"name" : "11"}, {"name" : "12"}, {"name" : "13"}, {"name" : "14"});
    data["edges"].push({"source" : "11", "target" : "12"}, {"source" : "11", "target" : "13"}, {"source" : "11", "target" : "14"});
    data["edges"].push({"source" : "12", "target" : "11"}, {"source" : "12", "target" : "13"}, {"source" : "12", "target" : "14"});
    data["edges"].push({"source" : "13", "target" : "14"});
    
    return data;
};

        
function generateDoubleBox()
{
    var data = generateSixRingGraph();
    data["edges"].push({"source" : "6", "target" : "3", "type" : "unvisited"});
    return data;
}
        
        
function generateSixRingGraph()
{
    var data = {};
    data["nodes"] = [{"name":"0"}, {"name":"1"}, {"name":"2"}, {"name":"3"}, {"name":"4"}, {"name":"5"}, {"name":"6"}];
    data["edges"] =  
    [
        {"source" : "1", "target" : "2"}, {"source" : "2", "target" : "3"}, {"source" : "3", "target" : "4"},
        {"source" : "4", "target" : "5"}, {"source" : "5", "target" : "6"}, {"source" : "6", "target" : "1"}
    ];

    for (node in data["nodes"])
    {
        data["nodes"][node]["type"] = "unvisited";
    }

    return data;
}


// Maybe these two could go into a runner object?
function runSubgraphDetection(data)
{
    var graphTheory = d3.graphTheory(data["nodes"], data["edges"]);
    var disjointSets = graphTheory.detectDisjointSubgraphs(); 
    
    for (var setIndex in disjointSets)
    {
        console.log("setIndex = " + setIndex);
        for (var nodeIndex in disjointSets[setIndex])
        {
            console.log("nodeIndex = " + nodeIndex);
            disjointSets[setIndex][nodeIndex]["type"] = setIndex;
        }
    }
    
    buildGraph(data);
}


function runDijkstras(data)
{
    var graphTheory = d3.graphTheory(data["nodes"], data["edges"]);
    var source = data["nodes"][2];
    source["type"] = "source";
    graphTheory.dijkstras(source);
    console.log("source['name'] = ");
    console.log(source['name']);

    var graph = buildGraph(data);
    graph.buildTextFromDistance();
}
