import { useState } from 'react';
import { RenderBoundary } from './renderer';
import './App.css';

const API_KEY="9160bab597b3431a8c59689c2566d3bc"

function backendCall(lon,lat,setEmitData,setLoading,setAtHome,setCoordinates){
  setCoordinates({lon:lon,lat:lat});

  const isEmpty=(value)=>{
    for (let prop in value) {
      if (value.hasOwnProperty(prop)) return false;
    }
    return true;
  };

  setLoading(true);
  setAtHome(false);

  fetch("http://127.0.0.1:80/get_data/"+lon+"/"+lat).then((response)=>{
    return response.json();
  }).then((data)=>{
    console.log(setLoading);
    if(!isEmpty(data)){
      setEmitData(data);
    }
    setLoading(false);
  }).catch((reason)=>{
    console.log(reason);
    setLoading(false);
  });
}

function Home(){
  return (
    <div>
      <h1 className="text-xl mb-3 mt-1 text-gray-200">
        Welcome Space Geologist Cutie!
      </h1>
      <h2 className="text-lg text-left text-slate-200">
        How To Use:
      </h2>
      <p className="text-left ">
        All you have to do to use this app is click anywhere on the globe, type in a location, or enter a coordinate above.
        We'll fetch data from NASA's 
        <a target="_blank" rel="noopener noreferrer" href="https://earth.jpl.nasa.gov/emit/" className="text-blue-500"> EMIT </a>
        and we'll present you with images and links which you may find useful.
      </p>
      <br/>
      <h2 className="text-lg text-left text-slate-200">
        What You Can Do:
      </h2>
      <p className="text-left">
        You might be thinking "Ok great... images from space. What can this do for me?"<br/>
        Alot actually!<br/>
        Without even having to get up from your bed you can get rough overview of
        your area of interest's terrain from bird's eye images
        as well as some clues on mineral composition from spectroscopy images.
      </p>
      <br/>
      <h2 className="text-lg text-left text-slate-200">
        How It Is Made:
      </h2>
      <p className="text-left">
        The front-end technologies used are Three.js, React, and Tailwind.
        The back-end uses Flask which makes calls to EarthAccess for data.<br/>
        <a target="_blank" rel="noopener noreferrer" href="https://github.com/nasa/EMIT-Data-Resources/" className="text-blue-500">This resource </a>
        came in very handy as I had never interacted with NASA Apis before.
      </p>
      <br/>
      <h2 className="text-lg text-left text-slate-200">
        What's next?
      </h2>
      <p className="text-left">
        I'd like to incorporate AI by creating a model in my backend which can provide Geologists with more insight into these images.
      </p>
      <br/>
      <h2 className="text-lg text-left text-slate-200">
        About Me:
      </h2>
      <p className="text-left">
        My name is Sebastian De La Espriella.
        I am a computer science student at UH and am very passionate about learning
        and creating new things.
        I'm currently looking for an internship... 🥺 please Nasa hire me.
      </p>
    </div>
  );
}

function Data({atHome,coordinates,emitData,loading}){
  const [Idx,setIdx]=useState(0);
  if(atHome)
    return (<><Home/></>);

  if(loading)
    return (
      <div className="flex flex-col text-left">
        <br/><br/><br/>
        <div role="status" className="text-center">
          <svg aria-hidden="true" className="w-12 h-12 ml-44 mt-44 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );

  let TerrainJSX=()=>(<div>no 2A data found</div>);
  if(emitData.terrain!==undefined){
    const terrain=emitData.terrain[Idx%emitData.terrain.length];
    TerrainJSX=()=>(<>
      <p>Date Scanned: {terrain.time.RangeDateTime.BeginningDateTime}</p>
      <div className="text-lg text-center">EMIT 2A</div>
      <img src={terrain.image[0]} alt="Terrain view"/>
      <h2>Downloads: </h2>
      <ul className="flex flex-col text-blue-500">
        {terrain.downloads.map((x,i)=> <a key={i} href={x}>Link {i}</a>)}
      </ul>
    </>);
    RenderBoundary(terrain.points);
  }

  let MineralJSX=()=>(<div>no 2B data found</div>);
  if(emitData.mineral!==undefined){
    const mineral=emitData.mineral[Idx%emitData.mineral.length];
    MineralJSX=()=>(<>
      <div className="text-lg text-center">EMIT 2B</div>
      <img src={mineral.image[0]} alt="Mineral data"/>
      <h2>Downloads: </h2>
      <ul className="flex flex-col text-blue-500">
        {mineral.downloads.map((x,i)=> <a key={i} href={x}>Link {i}</a>)}
      </ul>
      <button onClick={(e)=>{setIdx(Idx+1);}} className="bg-black rounded-lg mb-1 mt-3">Next ({Idx+1}/{emitData.mineral.length-1})</button>
    </>);
  }
  return (
    <div className="flex flex-col text-left">
      <TerrainJSX/>
      <MineralJSX/>
    </div>
  );
}

function Search({coordinates,setCoordinates,setEmitData,setLoading,setAtHome}){
  const onSubmit=(e)=>{
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const formJson=Object.fromEntries(formData.entries());

    if(formJson.loc!==undefined){
      setLoading(true);
      setAtHome(false);

      fetch("https://api.geoapify.com/v1/geocode/search?text="+formJson.loc+"&format=json&api_key="+API_KEY).then((response)=>{
        return response.json();
      }).then((data)=>{
        console.log(data);
        let lon=0;
        let lat=0;
        if(data.results!==undefined)
          if(data.results.length>0){
            lat=data.results[0].lat;
            lon=data.results[0].lon;
          }

        backendCall(
          lon.toFixed(20),
          lat.toFixed(20),
          setEmitData,
          setLoading,
          setAtHome,
          setCoordinates
        );
      }).catch((reason)=>{
        console.log(reason);
        setLoading(false);
      });
    }
    else{
      let lon=parseFloat(formJson.lon);
      let lat=parseFloat(formJson.lat);

      if(isNaN(lon)||isNaN(lat))
        return;
      if(lon>180)lon=180;
      else if(lon<-180)lon=-180;
      if(lat>90)lat=90;
      else if(lat<-90)lat=-90;

      backendCall(
        lon.toFixed(20),
        lat.toFixed(20),
        setEmitData,
        setLoading,
        setAtHome,
        setCoordinates
      );
    }
  };

  return (
    <div>
      <form key={coordinates.lon+coordinates.lat+1} onSubmit={onSubmit} className="mt-1">
        <label> 
          <input name="loc" placeholder="Search Location" className="bg-slate-700 rounded-lg"/>
        </label>
        <button type="submit" className="bg-slate-800 rounded-lg ml-1">&nbsp; Search &nbsp;</button>
      </form>
      <form key={coordinates.lon+coordinates.lat} onSubmit={onSubmit} className="text-left mt-3">
        <label>Longitude: &nbsp;&nbsp;
          <input name="lon" defaultValue={coordinates.lon} className="bg-slate-700 rounded-lg"/>
        </label><br/>
        <label>Latitude: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <input name="lat" defaultValue={coordinates.lat} className="bg-slate-700 rounded-lg mt-1"/>
        </label><br/>
        <div className="text-center">
        <button type="submit" className="bg-slate-800 rounded-lg mt-1">&nbsp; Search &nbsp;</button>
        </div>
      </form>
    </div>
  );
}

function TopPart({atHome,setAtHome}){
  if(atHome)
    return (
      <div className="bg-slate-800 rounded-lg">
        <h2 className="text-center">Home</h2>
      </div>
    );
  return (
    <div className="bg-slate-800 rounded-lg flex flex-col">
      <div>
        <button onClick={(e)=>{setAtHome(true);}} className="float-left bg-slate-700 rounded-lg">&nbsp; Go Back &nbsp;</button>
      </div>
      <h2 className="text-center">Results</h2>
    </div>
  );
}

let updateApp;
function App() {
  const [atHome,setAtHome]=useState(true);
  const [coordinates,setCoordinates]=useState({lat:"0",lon:"0"});
  const [emitData,setEmitData]=useState({});
  const [loading,setLoading]=useState(false);

  let rad2Deg=180/Math.PI;
  updateApp=(point)=>{
    point=point.normalize();
    console.log(point);
    let lat = (Math.asin(point.y)*rad2Deg).toFixed(20);
    let lon = (Math.atan2(point.x, point.z)*rad2Deg).toFixed(20);
    
    backendCall(
      lon,
      lat,
      setEmitData,
      setLoading,
      setAtHome,
      setCoordinates
    );
  };

  return (
    <div className="App w-96 overflow-y-auto h-screen bg-gray-900 text-slate-300">
      <TopPart atHome={atHome} setAtHome={setAtHome}/>
      <div className="rounded-lg">
        <Search coordinates={coordinates} setEmitData={setEmitData} setCoordinates={setCoordinates} setAtHome={setAtHome} setLoading={setLoading}/>
        <Data loading={loading} atHome={atHome} coordinates={coordinates} emitData={emitData}/>
      </div>
    </div>
  );
}

export {App,updateApp};
