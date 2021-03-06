#d3-graph-theory

The D3-graph-theory project is to use basic graph theory (Dijkstra's, and closeness centrality presently) on the D3 graph data structures. Presently, it only handles undirected, unweighted, graphs. As it integrates well with D3, it is written in JavaScript.

![Dijkstra's example](https://raw.github.com/brian-stinar/d3-graph-theory/master/screenshots/Dijkstras.png)

##Features 
- Dijkstra's shortest path algorithm used to calculate distances between nodes.
- Closeness centrality calculations which use the inverse of distance
- Disjoint subgraph detection
- XML node/edge list -> D3 datastructure examples
- Adjacency list creation from D3 data structures to use in implementing other graph theory algorithms


##Examples
All the examples live in the examples/ directory. 

I tried to name these (and everything!) in a way that the names make sense. 

See dijkstras.html for an example of the use of Dijkstra's . The calculated distances are shown as labels for the nodes. Closeness centrality is output to the console.

See DisconnectSubgraphDetection.html for an example of, guess what, disconnected subgraph detection.

brianGoals2014.02.17.html shows parsing an XML structure into the structures D3 expects. 

fullyConnected.html makes the graph from brianGoals2014.02.17 fully connected.

##Where Do We Go From Here?
I would like to handle directed graphs, and different weights.
There are many, many cool graph theory algorithms that would be fun to implement in JavaScript.

I love graph theory, and D3 is probably the coolest JavaScript library I've used. I'd like to continue to expand d3-graph-theory, but I have to pay by billz. Luckily, I have a customer that has a great need for something like this, and has agreed to allow me to open source my work (provided I can partition it off well from their main code base.) I am an independent software developer, hustling for customers. If you like this library, and want to PAY me to expand it, please get in touch with me. This is what I do for a job.

##References
[D3] (http://d3js.org/) - The Coolest JavaScript Library Ever

[Dijkstra's Algorithm] (http://en.wikipedia.org/wiki/Dijkstra's_algorithm)

[Closeness Centrality] (http://en.wikipedia.org/wiki/Centrality#Closeness_centrality)

[Aaron Torres] (https://github.com/agtorre/) - My Friend That Told Me About The Benifits of GitHub 

[Noventum] (http://www.noventum.us/) - My Contracting Company 
