import * as d3 from "d3";
import data from './data.json';
import * as Toolbox from './toolbox.js';
import { useRef, useEffect } from "react";

function Draw({svgRef, dataset}){

//---------------------Configure Data-------------------------//
useEffect(() => {
      var data = JSON.parse(JSON.stringify(dataset));;
      var milestoneArr;
      var origData = [];
      console.log(data);
      console.log("orig data .. ", origData);
      data.forEach(function(dataNode, index, arr) {
        origData.push(JSON.parse(JSON.stringify(dataNode)));   //create duplicate array
      });
      console.log("checkpoint 1");
      data.forEach(function(dataNode, index, arr) {
        for(var i = 1; i < 8; i++)
          if(dataNode["Milestone " + i])
             dataNode["Milestone " + i] = Toolbox.convertDate(dataNode["Milestone " + i]);
      });
      console.log("----------checkpoint 2----");
      console.log(data);
      console.log("--------------------------");

      milestoneArr = Toolbox.createMilestoneArr(data);
      console.log(milestoneArr);
      var milestoneIntervalArr = milestoneArr.map(intervalArr => {
          return Toolbox.createIntervalMedian(intervalArr);
      });
      console.log(milestoneIntervalArr);


   //---------------Draw-------------------//

    var yAxis = 150;
          var xStart = 70;
          const svg = d3.select(svgRef.current)
          .attr("viewBox", `0 0 880 250`)
          .attr("preserveAspectRatio", "xMidYMid meet");
          //create arrow marker
          svg.append("defs")
          .append("marker")
          .attr("id", "arrow-marker")
          .attr("markerWidth", 10)
          .attr("markerHeight", 10)
          .attr("refX", 8)
          .attr("refY", 5)
          .attr("orient", "auto")
          .append("polygon")
          .attr("points", "0 0, 10 5, 0 10")
          .attr("fill", "black");

          //create milestone groups
          var group = svg.selectAll("g")
            .data(milestoneIntervalArr)
            .enter()
            .append("g")
            .attr("transform", function(d, i) { return "translate(" + (10 + i * 130) + ", " + yAxis + ")"; });

          group.append("circle")
          .attr("cx", 30)
          .attr("cy", 0)
          .attr("r", 10)
          .attr("fill", "red")
          .attr("id", function(d, i){return "circle-"+(i+1);})
          .on("click", handleClick);

          group.append("line")
          .attr("x1", 50)
          .attr("y1", 0)
          .attr("x2", d => d<10 ? 83: d<100 ? 80 : 75)
          .attr("y2", 0)
          .attr("stroke", "black")
          .attr("stroke-width", 1);


          group.append("text")
          .text(function(d) {return d;})
          .attr("width", 40)
          .attr("x", 90) // Set the x-coordinate
          .attr("y", 5)
          .attr("text-anchor", "middle");


          group.append("line")
          .attr("x1", d => d<10 ? 97 : d<100 ? 100 : 105)
          .attr("y1", 0)
          .attr("x2", 140)
          .attr("y2", 0)
          .attr("stroke", "black")
          .attr("stroke-width", 1)
          .attr("marker-end", "url(#arrow-marker)");

          group.append("text")
          .text(function(d, i) {return "Milestone " + (i + 1);})
          .attr("width", 100)
          .attr("x", 30) // Set the x-coordinate
          .attr("y", -40)
          .attr("text-anchor", "middle");

          //add final milestone circle
          var milestoneNGroup = svg.append("g")
            .attr("transform", function(d, i) { return "translate(" + (10 + milestoneIntervalArr.length * 130) + ", " + yAxis + ")"; });
          milestoneNGroup.append("circle")
            .attr("cx", 30)
            .attr("cy", 0)
            .attr("r", 10)
            .attr("fill", "red")
            .attr("id", function(d, i){return "circle-"+(milestoneIntervalArr.length+1);})
            .on("click", handleClick);

          milestoneNGroup.append("text")
          .text(function(d, i) {return "Milestone " + (milestoneIntervalArr.length+1);})
          .attr("width", 100)
          .attr("x", 30) // Set the x-coordinate
          .attr("y", -40)
          .attr("text-anchor", "middle");

          var activeCounter = 0;

        /////////////////////////////////table code
          const tableContainer = d3.select("#dashboard-table");

    // Create table element
    const table = tableContainer.append("table");

    // Create table header
    const headerRow = table.append("tr");
    const headers = Object.keys(origData[0]);
    headers.forEach(function(header) {
      headerRow.append("th")
        .text(header);
    });

    // Create table rows
    const rows = table.selectAll("tr.row")
      .data(origData)
      .enter()
      .append("tr")
      .attr("class", "row");

    // Create table cells
    const cells = rows.selectAll("td.cell")
      .data(function(row) {
        return headers.map(function(header) {
          return { column: header, value: row[header] === null || row[header]==="" ? "Null" : row[header]};
        });
      })
      .enter()
      .append("td")
      .attr("class", "cell")
      .text(function(d) { return d.value; });






      function handleClick() {
                var isActive = d3.select(this).classed("highlighted");
                var customMedianIsActive = d3.selectAll("g.highlighted-line-group").nodes().length >=1 ? true : false;
                if(customMedianIsActive) d3.selectAll("g.highlighted-line-group").remove();
                if(isActive){
                  d3.select(this).classed("highlighted", false);
                  d3.select(this.parentNode).classed("highlighted", false);
                  activeCounter--;
                }else if(!isActive && activeCounter < 2){
                  d3.select(this).classed("highlighted", true);
                  d3.select(this.parentNode).classed("highlighted", true);
                  activeCounter++;
                  if(activeCounter === 2){
                    var highlightedCircles = d3.selectAll("circle.highlighted").nodes();
                    console.log("checkpoint 3");
                    var indices = highlightedCircles.map(circle => d3.selectAll("circle").nodes().indexOf(circle));
                    var specifiedIntervalArr = Toolbox.createIntervalArray("Milestone " + (indices[0] + 1), "Milestone " + (indices[1] + 1), data);
                    var specifiedIntervalMedian = Toolbox.createIntervalMedian(specifiedIntervalArr);
                    var selectedCircles = d3.selectAll("circle.highlighted").nodes();
                    var selectedGroups = d3.selectAll("g.highlighted").nodes();
                    console.log("selected groups are: " + selectedGroups[0].getAttribute("transform"));
                    var group1Transform = selectedGroups[0].getAttribute("transform");
                    var group2Transform = selectedGroups[1].getAttribute("transform");
                    var group1Convert = group1Transform.split(/[\(,]+/);
                    var group2Convert = group2Transform.split(/[\(,]+/);
                    var group1X = parseInt(group1Convert[1], 10);
                    var group2X = parseInt(group2Convert[1], 10);
                    var hgroup = svg.append("g")
                    .attr("class", "highlighted-line-group");
                    var firstLine = hgroup.append("line")
                    .attr("class", "highlighted-line")
                    .attr("x1", group1X + (+selectedCircles[0].getAttribute("cx")))
                    .attr("y1", yAxis + (+selectedCircles[0].getAttribute("r")))
                    .attr("x2", group1X + (+selectedCircles[0].getAttribute("cx")))
                    .attr("y2", yAxis+25)
                    .attr("stroke", "black")
                    .attr("stroke-width", 1);
                    var longLine = hgroup.append("line")
                    .attr("class", "highlighted-line")
                    .attr("x1", group1X + (+selectedCircles[0].getAttribute("cx")))
                    .attr("y1", yAxis+25)
                    .attr("x2", group2X + (+selectedCircles[1].getAttribute("cx")))
                    .attr("y2", yAxis+25)
                    .attr("stroke", "black")
                    .attr("stroke-width", 1);
                    hgroup.append("line")
                    .attr("class", "highlighted-line")
                    .attr("x1", group2X + (+selectedCircles[1].getAttribute("cx")))
                    .attr("y1", yAxis + (+selectedCircles[0].getAttribute("r")))
                    .attr("x2", group2X + (+selectedCircles[1].getAttribute("cx")))
                    .attr("y2", yAxis+25)
                    .attr("stroke", "black")
                    .attr("stroke-width", 1);
                    hgroup.append("text")
                    .text(specifiedIntervalMedian)
                    .attr("width", 100)
                    .attr("x", (+longLine.attr("x2") + +longLine.attr("x1"))/2)  // Set the x-coordinate
                    .attr("y", yAxis + 45)
                    .attr("text-anchor", "middle");

                  }
                }else if(activeCounter === 2){
                  d3.selectAll("circle.highlighted").classed("highlighted", false);
                  d3.selectAll("g.highlighted").classed("highlighted", false);
                  d3.select(this).classed("highlighted", true);
                  d3.select(this.parentNode).classed("highlighted", true);
                  activeCounter = 1;
                }
              }

    //-------Dismount-------//
      return()=>{
        d3.selectAll("circle").on("click", null);
        table.remove();
        svg.selectAll("*").remove();
        svgRef.current = null;
        data = null;
        origData = null;
        milestoneArr = null;
        console.log("data dismounted");
      };
    }, [dataset]);
}

export default Draw;