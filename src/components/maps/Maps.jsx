import { MapContainer } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import "leaflet-timedimension";
import "../../../node_modules/leaflet-timedimension/dist/leaflet.timedimension.control.min.css";

import { BasemapControlLayer, PlottyGeotiffLayer, VectorArrowsGeotiffLayer,ControllerLayer } from "../../layers/Layers";

import { useState } from "react";

import { Paper } from '@mui/material';

// currentTimes
let cTime = new Date();
cTime.setUTCDate(1);

// Timedimension options
const timeDimensionOptions ={
    // timeInterval:'2023-01-01/'+cTime.toISOString(),
    timeInterval:"2014-09-30/2014-10-30",
    period:"P1M",
    // currentTime:Date.parse("2020-01-01")
};

export default function Maps(){
    // maptype
    const [mtype,setMtype] = useState("default");

    // Layer control
    const [RasterLayer, setRasterLayer] = useState(true);
    const [ArrowLayer, setArrowLayer] = useState(true);


    // data name (TODO : Change)
    const [DataName, setDataName] = useState("west");
    // U,V Speed tiff file path
    const [DataSpeedUrl, setDataSpeedUrl] = useState("https://raw.githubusercontent.com/yoonj1n/geo-bsc/main/Tools/wind_speed.tif");
    // U,V Direction tiff file path
    const [DataDirectionUrl, setDataDirectionUrl] = useState("https://raw.githubusercontent.com/yoonj1n/geo-bsc/main/Tools/wind_direction8.tif");    
    
    // Speed tiff option
    const [DataSpeedOptions, setDSOptions] = useState({
        band: 0,
        displayMin: 0,
        displayMax: 1,
        name: "Current speed",
        colorScale: "viridis",
        clampLow: false,
        clampHigh: true
    });
    
    // Direction tiff option
    const [DataDirectionOptions, setDDOptions] = useState({
        band: 0,
        name: "direction",
        arrowSize: 10
    })

    const BasemapHandler = (e)=>setMtype(e.target.value);
    const CscaleHandler = (e)=>{
        let tmpDSOptions = {...DataSpeedOptions};
        tmpDSOptions['colorScale'] = e.target.value;
        setDSOptions(tmpDSOptions);
    }
    // TODO : Backend link and change url
    const DataHandler = (e)=>{
        setDataName(e.target.value);
        if(e.target.value === 'south'){
            setDataSpeedUrl("https://raw.githubusercontent.com/yoonj1n/geo-bsc/main/Tools/south_20220523_speed.tif");
            setDataDirectionUrl("https://raw.githubusercontent.com/yoonj1n/geo-bsc/main/Tools/south_20220523_dir1.tif");
        }else{
            setDataSpeedUrl("https://raw.githubusercontent.com/yoonj1n/geo-bsc/main/Tools/wind_speed.tif");
            setDataDirectionUrl("https://raw.githubusercontent.com/yoonj1n/geo-bsc/main/Tools/wind_direction8.tif");
        }
    }
    const RLayerHandler = (e) => setRasterLayer(e.target.checked);
    const ALayerHandler = (e) => setArrowLayer(e.target.checked);

    return(
        <MapContainer className="Mapcontainers" 
            center={[37, 126.5]} 
            zoom={6}
            timeDimension
            timeDimensionOptions={timeDimensionOptions}
            timeDimensionControl
        >

            {/* Speed Layer Start (Plotly) */}
            {RasterLayer?<PlottyGeotiffLayer
                url={DataSpeedUrl}
                options={DataSpeedOptions}
                />:null}
            {/* Speed Layer End */}

            {/* Vector Layer Start */}
            {ArrowLayer?<VectorArrowsGeotiffLayer
                url={DataDirectionUrl}
                options={DataDirectionOptions}
            />:null}
            {/* Vector Layer End */}
            
            {/* Map Layer Start  */}
            {/* <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            /> */}
            <BasemapControlLayer maptype={mtype}/>
            {/* Map Layer End */}

            {/* Controller Start */}
            <ControllerLayer controlList={{
                'basemap':{'value':mtype,'handler':BasemapHandler},
                'cscale':{'value':DataSpeedOptions['colorScale'],'handler':CscaleHandler},
                'data':{'value':DataName,'handler':DataHandler},
                'RLayer':{'value':RasterLayer,'handler':RLayerHandler},
                'ALayer':{'value':ArrowLayer,'handler':ALayerHandler},
            }}/>
            {/* Controller End */}
        </MapContainer>
    )  
}