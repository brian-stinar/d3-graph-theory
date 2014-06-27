/* 
 * Runners - objects which run everything.
 * 
    Brian J. Stinar
    Noventum Custom Software Development 
    505-750-1169  - Call me if you want to talk or have questions. 
    I like that more than email. 
 */



function Runner(data)
{
    var m_data = data;

    // This different members have a lot of similarities. Maybe I can 
    // make one private method that has all the similar parts, which is called 
    // first by both?
    this.runSubgraphDetection = function()
    {
        var graphTheory = d3.graphTheory(m_data["nodes"], m_data["edges"]);
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

        buildGraph(m_data);
    };


    this.runDijkstras = function()
    {
        var graphTheory = d3.graphTheory(m_data["nodes"], m_data["edges"]);
        var source = m_data["nodes"][2];
        source["type"] = "source";
        graphTheory.dijkstras(source);
        console.log("source['name'] = ");
        console.log(source['name']);

        var graph = buildGraph(m_data);
        graph.buildTextFromDistance();
    };
    
    this.runFullyConnected = function()
    {
        //var graphTheory = d3.graphTheory({"nodes": m_data["nodes"], "edges": m_data["edges"]});
        var graphTheory = d3.graphTheory(m_data["nodes"], m_data["edges"]);
        
        graphTheory.makeFullyConnected();
        
        var graph = buildGraph(m_data);
        //graph.buildTextFromDistance();
    };
    
}