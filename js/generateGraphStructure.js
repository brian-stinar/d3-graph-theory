/* 
 * Graph structure generation.
 * 
    Brian J. Stinar
    Noventum Custom Software Development 
    505-750-1169  - Call me if you want to talk or have questions. 
    I like that more than email. 
 */

function Generator()
{
    this.generateFourSubgraphs = function()
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


    this.generateDoubleBox = function()
    {
        var data = generateSixRingGraph();
        data["edges"].push({"source" : "6", "target" : "3", "type" : "unvisited"});
        return data;
    };


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
    };
}
