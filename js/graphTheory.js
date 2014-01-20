/* This is an attmept to build some graph theory logic into D3, using the
datatypes for nodes / edges (links) that D3 uses. 

This is for UNDIRECTED graphs only, with edge weights of 1.
If people like this, and want to pay me to develop it further, I will. 
Otherwise, I think a undirected version will work for my current customer.

Brian J. Stinar
Noventum Custom Software Development 
2014.01.13
505-750-1169  - Call me if you want to talk or have questions. 
I like that more than email. 
*/

// TODO: Make the source node one color, and all the other nodes another color.
// TODO: Figure out how to print distances, maybe after the node name? 

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
        this.undirectedAdjaceyList = new Array(this.nodes.length);
        
        // Make our array-of-arrays
        for (var rowIndex = 0; rowIndex < this.nodes.length; rowIndex++)
        {
            this.undirectedAdjaceyList[rowIndex] = new Array(this.nodes.length);
        }
        
        // Initalize the array of arrays to all zeros
        for (var rowIndex = 0; rowIndex < this.nodes.length; rowIndex++)
        {
            for (var columnIndex = 0; columnIndex < this.nodes.length; columnIndex++)
            {
                this.undirectedAdjaceyList[rowIndex][columnIndex] = 0;            
            }
        }
        
        // Edges is a listing of source->destination via node name
        // I need to get the indexof each element to figure out where
        // in the adjacency list things go
        // 
        // This is an undirected graph. Hence the both ways connections.
        // I should also make this adjacency list store the edge weight (1) 
        // instead of the name of the target.
        for (var edgeIndex = 0; edgeIndex < this.edges.length; edgeIndex++)
        {
            var sourcePosition = this.findNodePostionInNodeList(this.edges[edgeIndex]["source"]);
            var targetPosition = this.findNodePostionInNodeList(this.edges[edgeIndex]["target"]);
            this.undirectedAdjaceyList[sourcePosition][targetPosition] = this.nodes[targetPosition]["name"];
            this.undirectedAdjaceyList[targetPosition][sourcePosition] = this.nodes[sourcePosition]["name"];            
        }
    };

    
    // This would be nice to add prettier-printing. I.E. to compensate for the
    // length of the name in determining how many spaces to print. This looks good
    // for single-character node names, but it will need adjustment for longer 
    // named nodes.
    this.printAdjacencyList = function()
    {
        // Create labels based on node names
        var columnsLabels = "       ";
        for (var nodeIndex = 0; nodeIndex < this.nodes.length; nodeIndex++)
        {
            columnsLabels += this.nodes[nodeIndex]["name"]  + "      ";
        }
        console.info(columnsLabels);
        
        // Print the contents of the list
        var outputString = "";

        for (var rowIndex = 0; rowIndex < this.nodes.length; rowIndex++)
        {
            outputString = this.nodes[rowIndex]["name"];
            for (var columnIndex = 0; columnIndex < this.nodes.length; columnIndex++)
            {
                outputString+= "      " + this.undirectedAdjaceyList[rowIndex][columnIndex];
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
        var sourceNodeIndex = this.findNodePostionInNodeList(sourceNode["name"]);
        
        if (sourceNodeIndex === -1)
        {
            console.debug("The source node index === -1. This shouldn't happen if findNodePostionInNodeList() is called with an existing node");
            return -1; 
        }
        
        var distances = new Array(this.nodes.length);
        var previous = new Array(this.nodes.length); // Previous node to undefined initially
        
        for (var nodeIndex = 0; nodeIndex < this.nodes.length; nodeIndex++)
        {
            distances[nodeIndex] = infinity;
        }

        distances[sourceNodeIndex] = 0;

        var nodesToIterateOver = this.nodes.slice(0); // Copy the array. These both point to the same objects now.
        
        while (nodesToIterateOver.length > 0)
        {
            // This would be good to change to avoid the 'undefined' return
            // when we are finished. That would make it clearer.
            var currentNode = this.getSmallestDistance(distances, nodesToIterateOver);
            
            if (currentNode === undefined)
            {
                console.log("Infinite distance returned undefined node for smallest distance... breaking");
                break;
            }
            
            // Check the distance, to make sure it's non-infinite
            if (distances[this.findNodePostionInNodeList(currentNode)] === infinity)
            {
                console.log("distance === infinity - exiting");
                break;
            }
                        
            // Remove closestNeighbor from nodesToIterateOver
            var indexOfRemoval = nodesToIterateOver.indexOf(currentNode);
            if (indexOfRemoval > -1)
            {
                nodesToIterateOver.splice(indexOfRemoval, 1);
            }
            
            else
            {
                console.log("Error! indexOfRemoval === -1");
                return;
            }
            
            var neighbors = this.getAllNeighbors(currentNode);
            
            for (var neightborIndex = 0; neightborIndex < neighbors.length; neightborIndex++)
            {
                var currentNeighbor = neighbors[neightborIndex]; // Crappy name from psuedo-code implementation on wikipedia.
                var currentNeighborPosition = this.findNodePostionInNodeList(currentNeighbor);
               
                var alt = distances[this.findNodePostionInNodeList(currentNode["name"])] + distanceBetweenNodes; // +1 
                
                if ((alt < distances[currentNeighborPosition]) || (distances[currentNeighborPosition] === infinity))
                {
                    distances[currentNeighborPosition] = alt;
                    previous.push(currentNode); 
                    // decrease-key v in Q;                           // Reorder v in the Queue // Not sure what this is supposed to do...?
                }
            }
            
        }
        console.log("after dijkstras. Distances = ");
        console.log(distances);
        
        for (nodeIndex in this.nodes)
        {
            this.nodes[nodeIndex]["distance"] = distances[nodeIndex];
        }
        return distances;
    };


    this.getSmallestDistance = function(distances, nodesToIterateOver)
    {        
        var closestDistance = MAX_INT;
        var closestNode; 
                
        for (var nodesToIterateOverIndex = 0; nodesToIterateOverIndex < nodesToIterateOver.length; nodesToIterateOverIndex++)
        {
            var closestNode;
            
            var iteratingNode = nodesToIterateOver[nodesToIterateOverIndex];
            var iteratingNodePositionInGlobalList = this.findNodePostionInNodeList(iteratingNode["name"]);
            
            if ((distances[iteratingNodePositionInGlobalList] !== infinity) && (distances[iteratingNodePositionInGlobalList] < closestDistance))
            {
                closestDistance = distances[iteratingNodePositionInGlobalList];
                closestNode = this.nodes[iteratingNodePositionInGlobalList];
            }
        }
        
        if (closestNode === undefined)
        {
            console.log("Only infinite distances left. Returning undefined.");
            return;
        }
        
        return closestNode;        
    };
    
    
    this.getAllNeighbors = function(sourceNode)
    {
        var currentSourceNodeIndex = this.findNodePostionInNodeList(sourceNode["name"]);
        
        var adjacencyList = this.undirectedAdjaceyList[currentSourceNodeIndex];
        var neighborList = new Array();
        for (var nodeIndex = 0; nodeIndex < adjacencyList.length; nodeIndex++)
        {
            if (adjacencyList[nodeIndex] !== 0)
            {
                neighborList.push(adjacencyList[nodeIndex]); // Careful with these different indexes
            }
        }
        return neighborList;
    };
 
    
    this.buildUndirectedAdjacenyList();
    this.printAdjacencyList();
    
    return this;
};