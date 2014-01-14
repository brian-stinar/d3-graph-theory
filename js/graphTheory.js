// This is an attmept to build some graph theory logic into D3, using the
// datatypes for nodes / edges (links) that D3 uses. 
d3.graphTheory = function(nodes, edges)
{
    this.nodes = nodes; 
    this.edges = edges;
    
    this.findNodePostionInNodeList = function(nodeName)
    {
        for (var i = 0; i < this.nodes.length; i++)
        {            
            if (this.nodes[i]["name"] === nodeName)
            {
                return i;
            }
        }
        return -1; 
    };
    
    // This representation is needed for basically all following graph algoriths
    this.buildUndirectedAdjacenyList = function()
    {
        this.adjaceyList = new Array(this.nodes.length);
        
        // Make our array-of-arrays
        for (var i = 0; i < this.nodes.length; i++)
        {
            this.adjaceyList[i] = new Array(this.nodes.length);
        }
        
        // Initalize the array of arrays to all zeros
        for (var i = 0; i < this.nodes.length; i++)
        {
            for (var j = 0; j < this.nodes.length; j++)
            {
                this.adjaceyList[i][j] = 0;            
            }
        }
        
        // Edges is a listing of source->destination via node name
        // I need to get the indexof each element to figure out where
        // in the adjacency list things go
        for (var i = 0; i < this.edges.length; i++)
        {
            var sourcePosition = this.findNodePostionInNodeList(this.edges[i]["source"]);
            var targetPosition = this.findNodePostionInNodeList(this.edges[i]["target"]);
            this.adjaceyList[sourcePosition][targetPosition] = 1;
            this.adjaceyList[targetPosition][sourcePosition] = 1;            
        }
    };
    
    this.printAdjacencyList = function()
    {
    
        // Create labels based on node names
        var columnsLabels = "        ";
        for (var i = 0; i < this.nodes.length; i++)
        {
            columnsLabels += this.nodes[i]["name"]  + "   ";
        }
        console.info(columnsLabels);
        
        // Print the contents of the list
        var outputString = "";

        for (var i = 0; i < this.nodes.length; i++)
        {
            outputString = this.nodes[i]["name"];
            for (var j = 0; j < this.nodes.length; j++)
            {
                outputString+= "      " + this.adjaceyList[i][j];
            }
            console.info(outputString);
            outputString = "";
        }
    };

    this.buildUndirectedAdjacenyList();
    this.printAdjacencyList();
};