import "leaflet-geotiff-2";
import "leaflet-geotiff-2/dist/leaflet-geotiff-rgb";
import "leaflet-geotiff-2/dist/leaflet-geotiff-vector-arrows";
import "leaflet-geotiff-2/dist/leaflet-geotiff-plotty"; // requires plotty
import L from "leaflet";
import { useMap, TileLayer } from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography, InputLabel, MenuItem, Select, FormControl,FormControlLabel,Switch } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function GeotiffLayer({ url, options, Types }) {
    const map = useMap();
    const layerRef = useRef(null);
  
    useEffect(() => {
      const leafletElement = L.leafletGeotiff(url, options);
      layerRef.current = leafletElement;
      leafletElement.addTo(map);

      const onMapClicks = (e)=>{
        const latlng = e.latlng;
        const value = leafletElement.getValueAtLatLng(latlng.lat,latlng.lng);
        if(value !== null || value !== undefined){
          const returns = Types === 'plotty'? {'speed':value}:{'direction':value};
          console.log(returns);
        }
      }

      map.on("click", onMapClicks);
  
      return () => {
        if (leafletElement) {
          leafletElement.remove();
        }
        map.off("click",onMapClicks);
      };
    }, [map, url, options,Types]);
  
    return null;
}

/**
 * Visualize speed using u,v data that is included at tiff file
 * @param {dict} options params for Plotty
 * @param {dict} props other options
 * @returns GeotiffLayer
 */
function PlottyGeotiffLayer({ options, ...props }) {
  const renderer = new L.LeafletGeotiff.Plotty(options);

  return <GeotiffLayer {...props} options={{ ...options, renderer }} Types={'plotty'} />;
}

/**
 * Visualize direction using u,v data that is included at tiff file
 * @param {dict} options params for VectorArrows
 * @param {dict} props other options
 * @returns GeotiffLayer
 */
function VectorArrowsGeotiffLayer({ options, ...props }) {
  const renderer = new L.LeafletGeotiff.VectorArrows(options);
  return <GeotiffLayer {...props} options={{ ...options, renderer }} />;
}


/**
 * BasemapControl Layer
 * @param {string} maptype map type (ex. openstreet, carto)
 * @returns TileLayer
 */
function BasemapControlLayer({ maptype }){
  const [mapUrl, setMapUrl] = useState("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
  const [att, setAtt] = useState('&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors')
  useEffect(()=>{
    
    switch(maptype){
      // carto map
      case 'carto':
        setMapUrl("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png");
        break;
      
      // custom map
      
      // openstreet map
      default:
        setMapUrl("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
        setAtt('&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors');
    }
  },[maptype])

  return (
    <TileLayer
      attribution={att}
      url={mapUrl}
    />
  );

}

/**
 * Layer to control map and data visualization
 * @param {dict} controlList  control : handler
 * @returns Layer created using MUI(Accordion) 
 */
function ControllerLayer({controlList}){
  const cList = {...controlList};
  return (
    <Accordion className="Controller">
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className="ControllerT">Controller</Typography>
      </AccordionSummary>

      <AccordionDetails className="Controller_D">

        {/* Data Control */}
        <FormControl className="ControllerSWrapper" size="small">
          <InputLabel id='dataL' className="ControllerL">Model Data</InputLabel>
          <Select
            className="ControllerS"
            labelId="dataL"
            id="dataS"
            value={cList.data.value}
            label="Basemap"
            onChange={cList.data.handler}
          >
            <MenuItem className="ControllerL_M" value="west">west</MenuItem>
            <MenuItem className="ControllerL_M" value="south">south</MenuItem>
          </Select>
        </FormControl>

        {/* Map Type Control */}
        {/* <Typography className="ControllerD">
          ‣ BaseMap
        </Typography> */}
        <FormControl className="ControllerSWrapper" size="small">
          <InputLabel id='basemapL' className="ControllerL">BaseMap</InputLabel>
          <Select
            className="ControllerS"
            labelId="basemapL"
            id="basemapS"
            value={cList.basemap.value}
            label="Basemap"
            onChange={cList.basemap.handler}
          >
            <MenuItem className="ControllerL_M" value="default">Openstreet</MenuItem>
            <MenuItem className="ControllerL_M" value="carto">Carto</MenuItem>
          </Select>
        </FormControl>

        {/* Color Scale Control */}
        {/* <Typography className="ControllerD">
          ‣ Color Scale
        </Typography> */}
        <FormControl className="ControllerSWrapper" size="small">
          <InputLabel id='cscaleL' className="ControllerL">Color Scale</InputLabel>
          <Select
            className="ControllerS"
            labelId="cscaleL"
            id="cscaleS"
            value={cList.cscale.value}
            label="Color Scale"
            onChange={cList.cscale.handler}
          >
            {['viridis', 'inferno', 'turbo', 'rainbow', 'jet', 'hsv', 'hot', 'cool', 'spring', 'summer', 'winter', 'autumn', 'bone', 'copper', 'greys', 'greens',  'bluered', 'rdbu', 'picnic', 'portland', 'blackbody', 'earth', 'electric', 'magma', 'plasma'].map(cs=>{
              return(<MenuItem className="ControllerL_M" value={cs}>{cs}</MenuItem>)
            })}
          </Select>
        </FormControl>

        {/* OnOff Layer */}
        <FormControlLabel 
          control={<Switch 
                    checked={!!cList.RLayer.value}
                    onChange={cList.RLayer.handler}
                    inputProps={{ 'aria-label': 'RLControl' }}
                  />} 
         label="Raster Layer"
         key={'RLControl'}
         />
        <FormControlLabel 
          control={<Switch 
            checked={!!cList.ALayer.value}
            onChange={cList.ALayer.handler}
            inputProps={{ 'aria-label': 'ALControl' }}
          />} 
          label="Vector Layer" 
          key={'ALControl'}
        />

      </AccordionDetails>
    </Accordion>
  );
}



export { GeotiffLayer, PlottyGeotiffLayer, VectorArrowsGeotiffLayer,BasemapControlLayer,ControllerLayer };