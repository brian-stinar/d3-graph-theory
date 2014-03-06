/*
 * This is the code for parsing an XML representation using D3. I am trying to break
 * functionality into separate objects, and files, to avoid everything-all-mixed-
 * -together.
 * 
    Brian J. Stinar
    Noventum Custom Software Development 
    505-750-1169  - Call me if you want to talk or have questions. 
    I like that more than email. 
 */

function Parser(jsonRepresentation)
{
    var m_jsonRepresentation = jsonRepresentation;
    this.data = {};
    
    this.data["edges"] = buildJsonEdges();
    this.data["nodes"] = buildJsonNodes();
    
    function buildJsonEdges(m_jsonRepresentation)
    {
        var edges = []; 

        for (edgeNumber in jsonRepresentation.edgeData)
        {
            edges[edgeNumber] = {};
            edges[edgeNumber]['source'] = jsonRepresentation.edgeData[edgeNumber].fromNode;
            edges[edgeNumber]['target'] = jsonRepresentation.edgeData[edgeNumber].toNode;
        }        
        return edges;
    }
    
    function buildJsonNodes(m_jsonRepresentation)
    {
        var nodes = [];

        for (nodeNumber in jsonRepresentation.nodeData)
        {
            nodes[nodeNumber] = {};
            nodes[nodeNumber].name = jsonRepresentation.nodeData[nodeNumber].nodeId;
            // There will need to be a reckoning between D3 names and our names. 
            // These 'names' are more like our IDs.
            nodes[nodeNumber].description = jsonRepresentation.nodeData[nodeNumber].description;
            nodes[nodeNumber].type = jsonRepresentation.nodeData[nodeNumber].type;

            //console.info(jsonRepresentation.nodeData[nodeNumber]);
        }
        return nodes;
    }
}