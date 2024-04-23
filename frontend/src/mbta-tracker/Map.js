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
  const [selectedLine, setSelectedLine] = useState("Green-E");
  const [dataReady, setDataReady] = useState(false);
  const [showVehicleStatus, setShowVehicleStatus] = useState("none");
  const [buttonText, setButtonText] = useState("Show");

  var backendHost = process.env.REACT_APP_API_URL;
  var controllerEndpoint = "mbta/v1/livemap";
  var vehiclePositionSub = "/vehicle/location/" + selectedLine;
  var mbtaStopsEndpoint = "/stops/line/" + selectedLine;
  var stationMappingEndpoint = "/stops/child-parent-relation";
  const options = [
    //{ value: 'Green-A', label: 'Green-A' },
    //{ value: 'Green-B', label: 'Green-B' }, closed line 
    { value: 'Green-C', label: 'Green-C' }, 
//    { value: 'Green-D', label: 'Green-D' }, //stop #71199 not in mapping, where the hell is it
    { value: 'Green-E', label: 'Green-E' },
//    { value: 'Orange', label: 'Orange' },
  ];

useEffect(()=>{
setDataReady(false);
////////////////////////////////////////////////////////////
  var xhr = new XMLHttpRequest();//
    // Making our connection 
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
      console.error(error);
    };
  xhr.send();
  console.log("sent #1");

///////////////////////////////////////////
  var xhr2 = new XMLHttpRequest();
    // Making our connection 
  var url2 = backendHost + controllerEndpoint + stationMappingEndpoint;
  xhr2.open("GET", url2, true);
    // function execute after request is successful
  xhr2.onreadystatechange = function () {
    console.log("hi");
    if (this.readyState == 4 && this.status == 200) {
        var temp = JSON.parse(this.responseText);
        console.log("mapping .. :", temp);
        setStationMapping(temp);      
    }
  }
  xhr2.onerror = function (error){
      console.error(error);
    };
  xhr2.send();
  console.log("sent #2");
/////////////////////////
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

  return (
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
    ) : (<div>Loading...</div>)
    }
    </div>
  );

}

export default Map;
