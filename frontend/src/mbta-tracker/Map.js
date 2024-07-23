import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import Draw from'./draw.js';
import Vehicles from'./Vehicles.js';
import Select from 'react-select';
import './Map.css';


function Map() { 
  const svgRef = useRef(null);
  const [stationData, setStationData] = useState(null);
  const [stationMapping, setStationMapping] = useState(null);
  const [selectedLine, setSelectedLine] = useState("Green-C");
  const [dataReady, setDataReady] = useState(false);
  const [showVehicleStatus, setShowVehicleStatus] = useState("none");
  const [buttonText, setButtonText] = useState("Show");
  var maxRetries = 5;
  var xhr1Attempt = 0;
  var xhr2Attempt = 0;

  var backendHost = process.env.REACT_APP_API_URL;
  var controllerEndpoint = "mbta/v1/livemap";
  var vehiclePositionSub = "/vehicle/location/" + selectedLine;
  var mbtaStopsEndpoint = "/stops/line/" + selectedLine;
  var stationMappingEndpoint = "/stops/child-parent-relation";
  const options = [
    //{ value: 'Green-A', label: 'Green-A' },
    //{ value: 'Green-B', label: 'Green-B' }, closed line 
    { value: 'Green-C', label: 'Green-C' }, 
//    { value: 'Green-D', label: 'Green-D' }, //stop #71199 not in mapping (not being sent in /stops api call, but is being sent in updates from mbta api), where the hell is it
    { value: 'Green-E', label: 'Green-E' },
//    { value: 'Orange', label: 'Orange' },
  ];

useEffect(()=>{
setDataReady(false);

  getMbtaStops();
  getMbtaStations();
},[selectedLine]);

useEffect(()=>{
  if(stationData != null && stationMapping != null){
    setDataReady(true);
  }
}, [stationData, stationMapping]);
  const handleChange = (selectedOption) => {
    setSelectedLine(selectedOption.value);
    console.log(`Option selected:`, selectedOption.value);
  };
  const handleShowStatusClick = () => {
    if(showVehicleStatus === "none"){
        setShowVehicleStatus("block");
        setButtonText("Hide");
    }
    else{
        setShowVehicleStatus("none");
        setButtonText("Show");
    }
    console.log("vehicle status ", showVehicleStatus);
  }

  function getMbtaStops(){
    var xhr = new XMLHttpRequest();
    var url = backendHost + controllerEndpoint + mbtaStopsEndpoint;
    xhr.open("GET", url, true);

      // function execute after request is successful
    xhr.onreadystatechange = function () {
      console.log("hi");
      if (this.readyState == 4 && this.status == 200) {
          var temp = JSON.parse(this.responseText);
          var stationDataTemp = Object.keys(temp).map(v => ({[v.replace(/['"]+/g, '')]: {...temp[v]}}));
          console.log(stationDataTemp);
          setStationData(stationDataTemp);
      }
    }
    xhr.onerror = function (error){
         if(xhr1Attempt < maxRetries){
            console.error(error);
            console.log("retrying station mapping request, req #: " + (xhr1Attempt + 1));
            xhr1Attempt++;
            setTimeout(getMbtaStops, 10000);
         }
    };
    xhr.send();
  }

  function getMbtaStations(){
        var xhr2 = new XMLHttpRequest();
        var url2 = backendHost + controllerEndpoint + stationMappingEndpoint;
        xhr2.open("GET", url2, true);
        xhr2.onreadystatechange = function () {
          console.log("hi");
          if (this.readyState == 4 && this.status == 200) {
              var temp = JSON.parse(this.responseText);
              console.log("mapping .. :", temp);
              setStationMapping(temp);
          }
        }
        xhr2.onerror = function (error){
            if(xhr2Attempt < maxRetries){
              console.error(error);
              console.log("retrying station mapping request, req #: " + (xhr2Attempt + 1));
              xhr2Attempt++;
              setTimeout(getMbtaStations, 10000);
            }
          };
        xhr2.send();
  }

  return (
    <div className="map-container">
        <div className="Map">
         <div className="selections-bar">
            <Select options={options} onChange={handleChange} placeholder={selectedLine} className="line-select"/>
            <button className="show-status-button" onClick={handleShowStatusClick}>{buttonText} Vehicle Status</button>
         </div>
        {dataReady && options != null ? (
              <>
              <h2>{selectedLine}</h2>
              <svg ref={svgRef} >
                <Draw stationData={stationData} svgRef={svgRef} selectedLine={selectedLine}/>
                <Vehicles svgRef={svgRef} stationData={stationData} stationMapping={stationMapping} selectedLine={selectedLine} showVehicleStatus={showVehicleStatus}/>
              </svg>
              </>
          ) : (<div id="mbta-loading"><p>Loading... <br/>(please wait.. app server is waking up)</p></div>)
        }
        </div>
        <div id="mbtaapp-summary">
            <h3>Description</h3>
            <p className="app-summary">
                There are three railcar statuses: "STOPPED_AT", "INCOMING_AT", and "IN_TRANSIT_TO". Based on the three statuses, the railcars are displayed in different position on the line.
                The graphic is updated through D3.js processing of data emitted by server-sent events from my backend application. This means the cars move every time a status is updated. This application was created with React.js, D3.js, Spring WebFlux, and JSX.
            </p>
            <p>
            </p>
        </div>
    </div>
  );
}

export default Map;
