import { useState, useEffect } from "react";
import * as d3 from "d3";
import '../Vehicles.css';


function Vehicles({ svgRef, stationData, stationMapping, selectedLine, showVehicleStatus}) {
    const [vehicleList, setVehicleList] = useState([]);
    var backendHost = process.env.REACT_APP_API_URL;
    var controllerEndpoint = "mbta/v1/livemap";
    var vehiclePositionSub = "/vehicle/location/" + selectedLine;
    var mbtaStopsEndpoint = "/stops/line/" + selectedLine;
    var inTransitTo = "IN_TRANSIT_TO";
    var incomingAt = "INCOMING_AT";


    useEffect(() => {
      const svg = svgRef.current;         
      var svgElement = d3.select(svg);    //left facing arrow marker

      svgElement.selectAll("g.vehicle-group")
      .data(vehicleList, d=>d.id)
      .join(
        (enter) => {
          var vGroup = enter.append("g")
          .attr("class", "vehicle-group")
          .attr("transform", function(d, i){
            var stopId = d.stopId;
              var stopName = stationMapping[stopId];
              console.log('stop id: ', stopName);
              console.log('stop id: ', stopId);
              var station = svgElement.selectAll("#" + stopName)
              if(station.node() != null){
                  var transformString = station.attr("transform");
                  var convert = transformString.split(/[\(,]+/);
                  var x = parseInt(convert[1], 10);
                  var directionId = d.directionId;
                  if(d.currentStatus == inTransitTo){
                    if(directionId == 0)
                      x=x+30;
                    else
                      x=x-30;
                  }
                  if(d.currentStatus == incomingAt){
                    if(directionId == 0)
                      x=x+15;
                    else
                      x=x-15;
                  }

              var vehicleY = d.directionId == 0 ? 205 : 175;
              return "translate(" + x + " , " + vehicleY +")";
              }
          });

           vGroup.append("polygon") 
            .attr("points", function(d){
              if(d.directionId == 1)
                return "3,0 -3,0 -3,7 3,7 7,3"; //outbound
              else
                return "-3,5 3,5 3,12 -3,12 -7,8"; //inbound
            })
            .attr("fill", "lightgrey");

          vGroup
          .append("text")
          .attr("class", "vehicle")
          .attr("x", function(d){
            var textX = d.directionId == 0 ? 15 : 20
            return textX;
          })
          .attr("y",0)
          .attr("font-size", 5)
          .attr("transform", function(d){
            var rotation = d.directionId == 0 ? 45 : -45;
            return "rotate(" + rotation + ")";
          })
          .text(function(d){
            var stopId = d.stopId;
            var stopName = stationMapping[stopId];
            return d.id + " - " + d.currentStatus + ' - ' + stationData[stationMapping[stopId]] + ' - direction: ' + d.directionId;
          })
          .classed("vehicle_status", true);
      },
      (update) => {
        update
        .transition()
        .duration(3000)
        .attr("transform", function(d, i){
            var stopId = d.stopId;
              var stopName = stationMapping[stopId];
              var station = svgElement.select("#" + stopName)
              console.log('stop name: ', stopName);
              console.log('stop id:  ', stopId);
              if(station.node() != null){
                  var transformString = station.attr("transform");
                  var convert = transformString.split(/[\(,]+/);
                  var x = parseInt(convert[1], 10);
                  var directionId = d.directionId;
                  if(d.currentStatus == inTransitTo){
                    if(directionId == 0)
                      x=x+30;
                    else
                      x=x-30;
                  }
                  if(d.currentStatus == incomingAt){
                    if(directionId == 0)
                      x=x+15;
                    else
                      x=x-15;
                  }
                    var vehicleY = d.directionId == 0 ?  205 : 175;
                    return "translate(" + x + " , " + vehicleY +")";
                }
            });
            update.select("polygon")
              .attr("points", function(d){
                  if(d.directionId == 1)
                    return "3,0 -3,0 -3,7 3,7 7,3"; //outbound
                  else
                    return "-3,5 3,5 3,12 -3,12 -7,8"; //inbound
                })
            update.select("text").text(function(d){
              var stopId = d.stopId;
              var stopName = stationMapping[stopId];
              return d.id + " - " + d.currentStatus + ' - ' + stationMapping[stopId] + ' - direction: ' + d.directionId;
            })
            .attr("transform", function(d){
              var rotation = d.directionId == 0 ? 45 : -45;
              return "rotate(" + rotation + ")";
            });
      },
      (exit) => {
        exit.remove(); 
    } 
      );
    }, [vehicleList]);

    useEffect(()=>{
        d3.selectAll(".vehicle_status")
        .style("display", showVehicleStatus)
    }, [showVehicleStatus]);


    //Load vehicles below
    useEffect(() => {
      const evtSource = new EventSource(backendHost + controllerEndpoint + vehiclePositionSub);
      evtSource.onmessage = (data) => {
        var eventData = JSON.parse(data.data);
        console.log("Event data .. ", eventData);
        var vehicleData = eventData.vehicleData;
        if(eventData.event == "reset"){
          console.log("reset");
          setVehicleList(vehicleData);
        } else if(eventData.event == "update"){
          setVehicleList((prevList) => {
          var newData = prevList.map((item) => {
            if (item.id === vehicleData[0].id && !(item.currentStatus === vehicleData[0].currentStatus)) {
              return vehicleData[0];
            }
            return item;
          });
          console.log("update", newData);
          return newData;
        });
        } else if(eventData.event == "remove"){
            setVehicleList((prevList) => {
                return prevList.filter((item) => item.id !== vehicleData[0].id);
            });
        } else if(eventData.event == "add"){
            setVehicleList((prevList) => {return [...prevList, vehicleData[0]]});
        }
      };
      evtSource.onerror = function (error) {
        console.error('EventSource error:', error);
      };
      //close out event subscription on close of component
      return () => {
        evtSource.close();
      };
    },[selectedLine]);
}



export default Vehicles;
