/* 
 * Global methods. I don't really like these, but I'm not 100% sure where to put 
 * them right now... This is better than in buildGraph.js
 * 
    Brian J. Stinar
    Noventum Custom Software Development 
    505-750-1169  - Call me if you want to talk or have questions. 
    I like that more than email. 
 */



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
