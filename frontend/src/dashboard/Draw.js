import * as d3 from "d3";
import data from './data.json';
import thresholds from './thresholds.json'
import * as Toolbox from './toolbox.js';
import { useRef, useEffect } from "react";

function Draw({svgRef, dataset}){

//---------------------Configure Data-------------------------//
useEffect(() => {
      var data = JSON.parse(JSON.stringify(dataset));
      var milestoneActualArr;
      var milestonePlannedArr;
      var origData = [];
      console.log(data);
      console.log("orig data .. ", origData);
      data.forEach(function(dataNode, index, arr) {
        origData.push(JSON.parse(JSON.stringify(dataNode)));   //create duplicate array rather than using dataset to eliminate chances of data manipulation of original set
      });
      console.log("checkpoint 1");
      data.forEach(function(dataNode, index, arr) {
        for(var i = 1; i < dataNode.length - 3; i++)
          if(dataNode["Milestone " + i] && dataNode["Milestone " + i]["planned"])
             dataNode["Milestone " + i]["planned"] = Toolbox.convertDate(dataNode["Milestone " + i]["planned"]);
          if(dataNode["Milestone " + i]["actual"])
             dataNode["Milestone " + i]["actual"] = Toolbox.convertDate(dataNode["Milestone " + i]["actual"]);
      });
      console.log("----------checkpoint 2----");
      console.log(data);
      console.log("--------------------------");

      milestoneActualArr = Toolbox.createActualArr(data);
      console.log("actual arr :");
      console.log(milestoneActualArr);
      console.log("expected arr ");
      console.log(milestonePlannedArr);
      var milestoneActualIntervalArr = milestoneActualArr.map(intervalArr => {
          return Toolbox.createIntervalMedian(intervalArr);
      });
      console.log(milestoneActualIntervalArr);

   //---------------Draw-------------------//

    var yAxis = 150;
          var xStart = 70;
          const svg = d3.select(svgRef.current)
          .attr("viewBox", `0 0 1150 250`)
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
          var group = svg.selectAll(".milestone-group")
            .data(milestoneActualIntervalArr)
            .enter()
            .append("g")
            .attr("transform", function(d, i) { return "translate(" + (10 + i * 130) + ", " + yAxis + ")"; })
            .classed("milestone-group", true);;

          var circleGroup = group.append("g")
          .classed("circle-milestone-group", true)
          .on("click", handleClick);

          circleGroup.append("circle")
          .attr("cx", 30)
          .attr("cy", 0)
          .attr("r", 10)
          .attr("fill", function(d,i){
              if(i === 0 || i === 1 || i===3 || i ===4){
                  return "white";
              } else return "rgb(128, 128, 128)";
          })
          .attr("id", function(d, i){return "circle-"+(i+1);})
          .classed("milestone-circle", true);

          group.append("line")
          .attr("x1", 50)
          .attr("y1", 0)
          .attr("x2", d => d<10 ? 83: d<100 ? 80 : 75)
          .attr("y2", 0)
          .attr("stroke", function(d, i) {
                var color;
                var intervalDeltas = Toolbox.getIntervalDeltas(data, "Milestone " + (i + 1),  "Milestone " + (i + 2));
                console.log("interval deltas", intervalDeltas);
                var deltaMedian = Toolbox.createIntervalMedian(intervalDeltas);
                console.log("delta median", deltaMedian);
                color = deltaMedian >= thresholds[i]["red"] ? "red" : (deltaMedian < thresholds[i]["red"] && deltaMedian >= thresholds[i]["amber"] ? "yellow" : "green");
                return color;
          })
          .attr("stroke-width", 1);


          group.append("text")
          .text(function(d) {return d;})
          .attr("width", 40)
          .attr("x", 90)
          .attr("y", 5)
          .attr("text-anchor", "middle");


          group.append("line")
          .attr("x1", d => d<10 ? 97 : d<100 ? 100 : 105)
          .attr("y1", 0)
          .attr("x2", 140)
          .attr("y2", 0)
          .attr("stroke", function(d, i) {
              var color;
              var intervalDeltas = Toolbox.getIntervalDeltas(data, "Milestone " + (i + 1),  "Milestone " + (i + 2));
              console.log("interval deltas", intervalDeltas);
              var deltaMedian = Toolbox.createIntervalMedian(intervalDeltas);
              console.log("delta median", deltaMedian);
              color = deltaMedian >= thresholds[i]["red"] ? "red" : (deltaMedian < thresholds[i]["red"] && deltaMedian >= thresholds[i]["amber"] ? "yellow" : "green");
              return color;
          })
          .attr("stroke-width", 1)
          .attr("marker-end", "url(#arrow-marker)");

          circleGroup.append("text")
          .text(function(d, i) {return "M" + (i + 1);})
          .attr("width", 100)
          .attr("x", 30) // Set the x-coordinate
          .attr("y", 0)
          .style("font-size", "8")
          .attr("text-anchor", "middle")
          .attr("alignment-baseline", "middle")
          .attr("fill", function(d,i){
            if(i === 0 || i === 1 || i===3 || i ===4){
                return "black";
            } else return "white";
          });


          //add final milestone circle
          var milestoneNGroup = svg.append("g")
            .attr("transform", function(d, i) { return "translate(" + (10 + milestoneActualIntervalArr.length * 130) + ", " + yAxis + ")"; })
            .classed("milestone-group", true);
          var circleNGroup = milestoneNGroup.append("g")
            .classed("circle-milestone-group", true)
            .on("click", handleClick);
          circleNGroup.append("circle")
            .attr("cx", 30)
            .attr("cy", 0)
            .attr("r", 10)
            .attr("fill", "rgb(128, 128, 128)")
            .attr("id", function(d, i){return "circle-"+(milestoneActualIntervalArr.length+1);})
            .classed("milestone-circle", true)
          circleNGroup.append("text")
          .text(function(d, i) {return "M" + (milestoneActualIntervalArr.length+1);})
          .attr("width", 100)
          .attr("x", 30) // Set the x-coordinate
          .attr("y", 0)
          .style("font-size", "8")
          .attr("text-anchor", "middle")
          .attr("alignment-baseline", "middle")
          .attr("fill", "white");

          var activeCounter = 0;

          //Add M1-M7 lines
        var m1m7LineGroup = svg.append("g")
          .classed("m1_m7_linegroup", true);

        m1m7LineGroup.append("line") //vert line left
          .attr("x1", 45)
          .attr("y1", 140)
          .attr("x2", 70)
          .attr("y2", 90)
          .attr("stroke", function(d, i) {
                var color;
                var intervalDeltas = Toolbox.getIntervalDeltas(data, "Milestone 1",  "Milestone 7");
                console.log("interval deltas", intervalDeltas);
                var deltaMedian = Toolbox.createIntervalMedian(intervalDeltas);
                console.log("delta median", deltaMedian);
                color = deltaMedian >= thresholds[8]["red"] ? "red" : (deltaMedian < thresholds[8]["red"] && deltaMedian >= thresholds[8]["amber"] ? "yellow" : "green");
                return color;
          });
          m1m7LineGroup.append("line") //vert line right
          .attr("x2", 815)
          .attr("y2", 140)
          .attr("x1", 790)
          .attr("y1", 90)
          .attr("stroke", function(d, i) {
                var color;
                var intervalDeltas = Toolbox.getIntervalDeltas(data, "Milestone 1",  "Milestone 7");
                console.log("interval deltas", intervalDeltas);
                var deltaMedian = Toolbox.createIntervalMedian(intervalDeltas);
                console.log("delta median", deltaMedian);
                color = deltaMedian >= thresholds[8]["red"] ? "red" : (deltaMedian < thresholds[8]["red"] && deltaMedian >= thresholds[8]["amber"] ? "yellow" : "green");
                return color;
          })
          .attr("marker-end", "url(#arrow-marker)");

        m1m7LineGroup.append("line")//horizontal line left
        .attr("x1", 70)
        .attr("y1", 90)
        .attr("x2", 410)
        .attr("y2", 90)
        .attr("stroke", function(d, i) {
              var color;
              var intervalDeltas = Toolbox.getIntervalDeltas(data, "Milestone 1",  "Milestone 7");
              console.log("interval deltas", intervalDeltas);
              var deltaMedian = Toolbox.createIntervalMedian(intervalDeltas);
              console.log("delta median", deltaMedian);
              color = deltaMedian >= thresholds[8]["red"] ? "red" : (deltaMedian < thresholds[8]["red"] && deltaMedian >= thresholds[8]["amber"] ? "yellow" : "green");
              return color;
        });
        m1m7LineGroup.append("line")//horizontal line right
          .attr("x1", 450)
          .attr("y1", 90)
          .attr("x2", 790)
          .attr("y2", 90)
          .attr("stroke", function(d, i) {
                var color;
                var intervalDeltas = Toolbox.getIntervalDeltas(data, "Milestone 1",  "Milestone 7");
                console.log("interval deltas", intervalDeltas);
                var deltaMedian = Toolbox.createIntervalMedian(intervalDeltas);
                console.log("delta median", deltaMedian);
                color = deltaMedian >= thresholds[8]["red"] ? "red" : (deltaMedian < thresholds[8]["red"] && deltaMedian >= thresholds[8]["amber"] ? "yellow" : "green");
                return color;
          });

          m1m7LineGroup.append("text")
            .text(function(d, i) {
                var intervalArray = Toolbox.createIntervalArray("Milestone 1",  "Milestone 7", "actual", data);
                var intervalMedian = Toolbox.createIntervalMedian(intervalArray);
                return intervalMedian
            })
            .attr("width", 40)
            .attr("x", 430)
            .attr("y", 90)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle");

      //Add M7 to M9 line

      var m7m9LineGroup = svg.append("g")
      .classed("m7_m9_linegroup", true);

      m7m9LineGroup.append("line") //vert line left
        .attr("x1", 825)
        .attr("y1", 140)
        .attr("x2", 850)
        .attr("y2", 90)
        .attr("stroke", function(d, i) {
              var color;
              var intervalDeltas = Toolbox.getIntervalDeltas(data, "Milestone 7",  "Milestone 9");
              console.log("interval deltas", intervalDeltas);
              var deltaMedian = Toolbox.createIntervalMedian(intervalDeltas);
              console.log("delta median", deltaMedian);
              color = deltaMedian >= thresholds[8]["red"] ? "red" : (deltaMedian < thresholds[8]["red"] && deltaMedian >= thresholds[8]["amber"] ? "yellow" : "green");
              return color;
        });
        m7m9LineGroup.append("line") //vert line right
        .attr("x2", 1075)
        .attr("y2", 140)
        .attr("x1", 1050)
        .attr("y1", 90)
        .attr("stroke", function(d, i) {
              var color;
              var intervalDeltas = Toolbox.getIntervalDeltas(data, "Milestone 7",  "Milestone 9");
              console.log("interval deltas", intervalDeltas);
              var deltaMedian = Toolbox.createIntervalMedian(intervalDeltas);
              console.log("delta median", deltaMedian);
              color = deltaMedian >= thresholds[8]["red"] ? "red" : (deltaMedian < thresholds[8]["red"] && deltaMedian >= thresholds[8]["amber"] ? "yellow" : "green");
              return color;
        })
        .attr("marker-end", "url(#arrow-marker)");

      m7m9LineGroup.append("line")//horizontal line left
      .attr("x1", 850)
      .attr("y1", 90)
      .attr("x2", 935)
      .attr("y2", 90)
      .attr("stroke", function(d, i) {
            var color;
            var intervalDeltas = Toolbox.getIntervalDeltas(data, "Milestone 7",  "Milestone 9");
            console.log("interval deltas", intervalDeltas);
            var deltaMedian = Toolbox.createIntervalMedian(intervalDeltas);
            console.log("delta median", deltaMedian);
            color = deltaMedian >= thresholds[8]["red"] ? "red" : (deltaMedian < thresholds[8]["red"] && deltaMedian >= thresholds[8]["amber"] ? "yellow" : "green");
            return color;
      });
      m7m9LineGroup.append("line")//horizontal line right
        .attr("x1", 965)
        .attr("y1", 90)
        .attr("x2", 1050)
        .attr("y2", 90)
        .attr("stroke", function(d, i) {
              var color;
              var intervalDeltas = Toolbox.getIntervalDeltas(data, "Milestone 7",  "Milestone 9");
              console.log("interval deltas", intervalDeltas);
              var deltaMedian = Toolbox.createIntervalMedian(intervalDeltas);
              console.log("delta median", deltaMedian);
              color = deltaMedian >= thresholds[8]["red"] ? "red" : (deltaMedian < thresholds[8]["red"] && deltaMedian >= thresholds[8]["amber"] ? "yellow" : "green");
              return color;
        });

        m7m9LineGroup.append("text")
          .text(function(d, i) {
              var intervalArray = Toolbox.createIntervalArray("Milestone 7",  "Milestone 9", "actual", data);
              var intervalMedian = Toolbox.createIntervalMedian(intervalArray);
              return intervalMedian
          })
          .attr("width", 40)
          .attr("x", 950)
          .attr("y", 90)
          .attr("text-anchor", "middle")
          .attr("alignment-baseline", "middle");




        //------------Create table------------//
          const tableContainer = d3.select("#dashboard-table");

    // Create table element
    const table = tableContainer.append("table");

    // Create table headers
    const headerRow1 = table.append("tr");
    const headers = Object.keys(origData[0]);
    headers.forEach(function(header) {
      if(header.indexOf("Milestone") !== -1){
        headerRow1.append("th")
        .text(header)
        .attr("colspan", 2);
      }
      else{
        headerRow1.append("th")
        .text("")
      }

    });
    const headerRow2 = table.append("tr");
    const headers2 = Object.keys(origData[0]);
    headers2.forEach(function(header) {
    console.log("table header: ", header);
      if(header.indexOf("Milestone") !== -1){
        headerRow2.append("th")
        .text("Baseline");
        headerRow2.append("th")
        .text("Actual");
      }
      else{
        headerRow2.append("th")
        .text(header);
      }
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
        return headers.flatMap(function(header) {
            if(header.includes("Milestone")){
                return [{column: header, value: row[header]["planned"] === null || row[header]["planned"] ==="" ? "Null" : row[header]["planned"]}, {column: header, value: row[header]["actual"] === null || row[header]["actual"] ==="" ? "Null" : row[header]["actual"]}];
            }
            else
                return { column: header, value: row[header] === null || row[header]==="" ? "Null" : row[header]};
        });
      })
      .enter()
      .append("td")
      .attr("class", "cell")
      .text(function(d) {
         return d.value;
      });




    //-----------Milestone Click Functionality----------------//

      function handleClick() {
                var isActive = d3.select(this).classed("highlighted");
                var customMedianIsActive = d3.selectAll("g.highlighted-line-group").nodes().length >=1 ? true : false;
                if(customMedianIsActive) d3.selectAll("g.highlighted-line-group").remove();
                if(isActive){
                  d3.select(this).classed("highlighted", false);
                  d3.select(this.parentNode).classed("highlighted", false);
                  d3.select(this).selectAll("circle").classed("highlighted", false);
                  activeCounter--;
                }else if(!isActive && activeCounter < 2){
                  d3.select(this).classed("highlighted", true);
                  d3.select(this.parentNode).classed("highlighted", true);
                  d3.select(this).selectAll("circle").classed("highlighted", true);
                  activeCounter++;
                  if(activeCounter === 2){
                    var highlightedCircles = d3.selectAll(".circle-milestone-group.highlighted").nodes();
                    console.log("checkpoint 3");
                    console.log("{highlighted circles ", highlightedCircles);
                    var indices = highlightedCircles.map(circle => d3.selectAll(".circle-milestone-group").nodes().indexOf(circle));
                    console.log("indices ", indices);
                    var specifiedIntervalArr = Toolbox.createIntervalArray("Milestone " + (indices[0] + 1), "Milestone " + (indices[1] + 1), "actual", data);
                    var specifiedIntervalMedian = Toolbox.createIntervalMedian(specifiedIntervalArr);
                    var selectedCircles = d3.selectAll("circle.highlighted").nodes();
                    var selectedGroups = d3.selectAll("g.milestone-group.highlighted").nodes();
                    console.log("selected groups are: " + selectedGroups);
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
        milestoneActualArr = null;
        console.log("data dismounted");
      };
    }, [dataset]);
}

export default Draw;