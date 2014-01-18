/* This is an attmept to build some graph theory logic into D3, using the
datatypes for nodes / edges (links) that D3 uses. 

This is for UNDIRECTED graphs only. If people like this, and want to pay me to 
develop a directed graph version, I will. Otherwise, I think a undirected version
will work for my current customer.

Brian J. Stinar
Noventum Custom Software Development 
2014.01.13
505-750-1169  - Call me if you want to talk or have questions. 
I like that more than email. 
*/

var infinity = "infinity";

// http://stackoverflow.com/questions/307179/what-is-javascripts-max-int-whats-the-highest-integer-value-a-number-can-go-t
var MAX_INT = Math.pow(2, 53); 
var distanceBetweenNodes = 1; // Will need to be redone for weighted graphs

d3.graphTheory = function(nodes, edges)
{
    
    this.nodes = nodes; 
    this.edges = edges;
    
    this.findNodePostionInNodeList = function(nodeName)
    {
        for (var nodeIndex = 0; nodeIndex < this.nodes.length; nodeIndex++)
        {
            if (this.nodes[nodeIndex]["name"] === nodeName)
            {
                return nodeIndex;
            }
        }
        return -1; 
    };

    
    // This representation is needed for basically all following graph algoriths
    this.buildUndirectedAdjacenyList = function()
    {
        this.adjaceyList = new Array(this.nodes.length);
        
        // Make our array-of-arrays
        for (var rowIndex = 0; rowIndex < this.nodes.length; rowIndex++)
        {
            this.adjaceyList[rowIndex] = new Array(this.nodes.length);
        }
        
        // Initalize the array of arrays to all zeros
        for (var rowIndex = 0; rowIndex < this.nodes.length; rowIndex++)
        {
            for (var columnIndex = 0; columnIndex < this.nodes.length; columnIndex++)
            {
                this.adjaceyList[rowIndex][columnIndex] = 0;            
            }
        }
        
        // Edges is a listing of source->destination via node name
        // I need to get the indexof each element to figure out where
        // in the adjacency list things go
        // This is an undirected graph.
        for (var edgeIndex = 0; edgeIndex < this.edges.length; edgeIndex++)
        {
            var sourcePosition = this.findNodePostionInNodeList(this.edges[edgeIndex]["source"]);
            var targetPosition = this.findNodePostionInNodeList(this.edges[edgeIndex]["target"]);
            this.adjaceyList[sourcePosition][targetPosition] = this.nodes[targetPosition]["name"];
            this.adjaceyList[targetPosition][sourcePosition] = this.nodes[sourcePosition]["name"];            
        }
    };

    
    this.printAdjacencyList = function()
    {
        // Create labels based on node names
        var columnsLabels = "        ";
        for (var nodeIndex = 0; nodeIndex < this.nodes.length; nodeIndex++)
        {
            columnsLabels += this.nodes[nodeIndex]["name"]  + "   ";
        }
        
        // Print the contents of the list
        var outputString = "";

        for (var rowIndex = 0; rowIndex < this.nodes.length; rowIndex++)
        {
            outputString = this.nodes[rowIndex]["name"];
            for (var columnIndex = 0; columnIndex < this.nodes.length; columnIndex++)
            {
                outputString+= "      " + this.adjaceyList[rowIndex][columnIndex];
            }
            console.info(outputString);
            outputString = "";
        }
    };
    
    // http://en.wikipedia.org/wiki/Dijkstra's_algorithm 
    // Edsger W. Dijkstra was a very cool mathematician.
    // If you don't know much about him, check out the wikipedia page
    // about him, and read more about graph theory.
    // http://en.wikipedia.org/wiki/Edsger_W._Dijkstra
    this.dijkstras = function(sourceNode)
    {
        console.log("Start of dijkstras. sourceNode = ");

        console.log(sourceNode);
        var sourceNodeIndex = this.findNodePostionInNodeList(sourceNode["name"]);
        
        if (sourceNodeIndex === -1)
        {
            console.debug("The source node index === -1. This shouldn't happen if findNodePostionInNodeList() is called with an existing node");
            return -1; 
        }
        
        var distances = new Array(this.nodes.length);
        var previous = new Array(this.nodes.length); // Previous node to undefined
        
        // Initalize distances to infinity
        for (var nodeIndex = 0; nodeIndex < this.nodes.length; nodeIndex++)
        {
            distances[nodeIndex] = infinity;
        }

        distances[sourceNodeIndex] = 0;

        console.log("initial distances = ");
        console.log(distances);
        
        console.log("this.nodes = ");
        console.log(this.nodes);
        var nodesToIterateOver = this.nodes.slice(0); // Copy the array. These both point to the same objects now.
        console.log("nodesToIterateOver = ");
        console.log(nodesToIterateOver);

        
        while (nodesToIterateOver.length > 0)
        {
            console.log("distances = ");
            console.log(distances);
            var u = this.getSmallestDistance(distances, nodesToIterateOver); // Crappy psuedo-code name - also wrong. It needs to get the smallest distance, not the closest neighbor. This is itself in case 1.
            console.log("closestNode (u) = ");
            console.log(u);
            
            // Check the distance, to make sure it's non-infinite
            if (distances[this.findNodePostionInNodeList(u)] === infinity)
            {
                console.log("distance === infinity - exiting");
                break;
            }
            
            // Remove closestNeighbor from nodesToIterateOver
            var indexOfRemoval = nodesToIterateOver.indexOf(u);
            console.log("nodesToIterateOver = ");
            console.log(nodesToIterateOver);
            
            if (indexOfRemoval > -1)
            {
                nodesToIterateOver.splice(indexOfRemoval, 1);
            }
            
            else
            {
                console.log("Error! indexOfRemoval === -1");
                return;
            }
            
            var neighbors = this.getAllNeighbors(u); // This was not set correctly - always only getting neighbors for the sourceNode. 
            
            for (var neightborIndex = 0; neightborIndex < neighbors.length; neightborIndex++)
            {
                var v = neighbors[neightborIndex]; // Crappy name from psuedo-code implementation on wikipedia.
                console.log("\t\t\tv = ");
                console.log(v);
                var vPosition = this.findNodePostionInNodeList(v);
                console.log("\t\t\tvPosition = ");
                console.log(vPosition);
               
                var alt = distances[this.findNodePostionInNodeList(u["name"])] + distanceBetweenNodes; // +1 
                console.log("alt = "); 
                console.log(alt);
                
                console.log("distances[vPosition] = ");
                console.log(distances[vPosition]);
                console.log("vPosition = ");
                console.log(vPosition); // WRONG, I'm getting -1 here.
                
                if ((alt < distances[vPosition]) || (distances[vPosition] === infinity))
                {
                    distances[vPosition] = alt;
                    previous.push(u); 
                    // decrease-key v in Q;                           // Reorder v in the Queue // Not sure...?
                }
            }
            
            console.info("all neighbors = ");
            console.log(u);
            
        }
        console.log("after dijkstras. Distances = ");
        console.log(distances);
        return;
    };

    // Needs to be fixed to get the smallest distance NOT the closest neighbor.
    // These are different. 
    // Also needs to be fixed to only iterate over the nodesToIterateOver, NOT all nodes.
    this.getSmallestDistance = function(distances, nodesToIterateOver)
    {        
        var closestDistance = MAX_INT;
        var closestNode; 
        
        console.log("inside getSmallestDistance()\tdistances = ");
        console.log(distances);
        
        
        for (var nodesToIterateOverIndex = 0; nodesToIterateOverIndex < nodesToIterateOver.length; nodesToIterateOverIndex++)
        {
            var closestNode;
            
            var iteratingNode = nodesToIterateOver[nodesToIterateOverIndex];
            console.log("inside getSmallestDistance()\titeratingNode = ");
            console.log(iteratingNode);
            var iteratingNodePositionInGlobalList = this.findNodePostionInNodeList(iteratingNode["name"]);
            
            if ((distances[iteratingNodePositionInGlobalList] !== infinity) && (distances[iteratingNodePositionInGlobalList] < closestDistance))
            {
                closestDistance = distances[iteratingNodePositionInGlobalList];
                closestNode = this.nodes[iteratingNodePositionInGlobalList];
                console.log("inside getSmallestDistance()\t\t distances[distancesIndex] = ");
                console.log(distances[iteratingNodePositionInGlobalList]);
                console.log("inside getSmallestDistance()\t\tclosestDistance = ");
                console.log(closestDistance);
            }
        }
        
        if (closestNode === undefined)
        {
            console.log("ERROR! THIS SHOULDN'T HAPPEN!");
            return;
        }
        
        return closestNode;
        
        //var closestNeighbor;
        //var currentSourceNodeIndex = this.findNodePostionInNodeList(currentSourceNode["name"]);
        
        /*
        for (var neighborIndex = 0; neighborIndex < neighbors.length; neighborIndex++)
        {
            console.log("\tcurrentSourceNodeIndex = ");
            console.log(currentSourceNodeIndex);
            console.log("\tdistances[currentSourceNodeIndex] = ");
            console.log(distances[currentSourceNodeIndex]);
            if ((distances[currentSourceNodeIndex] !== infinity) && (distances[currentSourceNodeIndex] < closestNeighborDistance))
            {
                closestNeighbor = neighbors[neighborIndex];
            }
        }
        console.log("Returning closestNeighbor=");
        console.log(closestNeighbor);
        return closestNeighbor;
        */ 
    };
    
    this.getAllNeighbors = function(sourceNode)
    {
        var currentSourceNodeIndex = this.findNodePostionInNodeList(sourceNode["name"]);
        
        var adjacencyList = this.adjaceyList[currentSourceNodeIndex];
        var neighborList = new Array();
        for (var nodeIndex = 0; nodeIndex < adjacencyList.length; nodeIndex++)
        {
            if (adjacencyList[nodeIndex] !== 0)
            {
                neighborList.push(adjacencyList[nodeIndex]); // Push the node name, or the node itself. These different indexes will eventually jack me up.
            }
        }
        return neighborList;
    };
 
    
    this.buildUndirectedAdjacenyList();
    this.printAdjacencyList();
    
    this.dijkstras(this.nodes[0]);

};