import * as three from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { updateApp } from './App';
import earthGLB from "./Earth_1_12756.glb"
import milkyCube from "./starmap_2020_4k_print.jpg"

let RenderBoundary;
function RenderWorld(){
  ///// Init
  const scene = new three.Scene();
  const infoWidth=384;
  let windowWidth=window.innerWidth-infoWidth;
  const camera = new three.PerspectiveCamera(75, windowWidth/window.innerHeight, 0.1, 1000);
  const renderer = new three.WebGLRenderer();
  renderer.setSize(windowWidth, window.innerHeight);
  
  const raycaster=new three.Raycaster();
  const mouse=new three.Vector2();
  /////

  //////////// Scene Construction
  ///// Globe
  //https://science.nasa.gov/resource/earth-3d-model/
  new GLTFLoader().load(earthGLB,(gltf)=>{
    gltf.scene.scale.set(.01,.01,.01);
    gltf.scene.rotation.set(0,Math.PI,0);
    scene.add(gltf.scene);
  },undefined,(e)=>{
    console.log("Error loading Model");
    console.log(e);
  });
  /////

  ///// Milky Way
  // https://svs.gsfc.nasa.gov/4851/
  const cubeGeometry=new three.SphereGeometry(90);
  const cubeTexture=new three.TextureLoader().load(milkyCube,undefined,undefined,(e)=>{
    console.log("Error loading Image");
    console.log(e);
  });
  cubeTexture.wrapS=three.RepeatWrapping;
  cubeTexture.wrapT=three.RepeatWrapping;
  const cubeMaterial = new three.MeshBasicMaterial({color: 0x4f4f4f, map:cubeTexture});
  cubeMaterial.side = three.BackSide; 
  const cube = new three.Mesh(cubeGeometry, cubeMaterial);
  scene.add(cube);
  /////

  ///// Lighting
  const ambient=new three.AmbientLight(0xffffff);
  scene.add(ambient);
  /////

  ///// Scene Setup
  camera.position.z = 10;
  /////
  ////////////

  //////////// Event Handling

  ///// Render Boundary

  let boundaryGeometry;
  let hoverMaterial;
  let terrainMesh;
  const rho=5.01;
  let ij=0;
  RenderBoundary=(bounds)=>{
    console.log(ij);
    ij++;
    scene.remove(terrainMesh);
    if(bounds.length<=0)
      return;
    
    boundaryGeometry=new three.BufferGeometry();

    let vertices=new Float32Array(bounds.length*3);
    for(let i=0;i<bounds.length;i++){
      //https://gis.stackexchange.com/questions/4147/lat-lon-alt-to-spherical-or-cartesian-coordinates
      const lat=bounds[i].Latitude*Math.PI/180;
      const lon=bounds[i].Longitude*Math.PI/180;
      
      vertices[3*i+2] = Math.cos(lat) * Math.cos(lon) * rho;
      vertices[3*i] = Math.cos(lat) * Math.sin(lon) * rho;
      vertices[3*i+1] = Math.sin(lat) * rho;
    }
    boundaryGeometry.setAttribute( 'position', new three.BufferAttribute( vertices, 3 ) );

    const indices = [
      0, 1, 2,
      2, 3, 0,
    ];
    boundaryGeometry.setIndex( indices );

    hoverMaterial = new three.MeshBasicMaterial({color:0x00ffff, transparent:true, opacity:.2});
    terrainMesh = new three.Mesh( boundaryGeometry, hoverMaterial );
    console.log(bounds)
    console.log(vertices);
    scene.add(terrainMesh);
  };
  //////

  let globe;
  for(let child of scene.children)
    if(child.name==="Scene")
      globe=child;

  window.onclick=(event)=>{
    if(event.detail===2)
      return;
    mouse.x = ((event.clientX-infoWidth)/windowWidth)*2-1;
    mouse.y = -(event.clientY/window.innerHeight)*2+1;

    if(globe===undefined)
      for(let child of scene.children)
        if(child.name==="Scene")
          globe=child;
    if(globe===undefined)
      return;
    raycaster.setFromCamera(mouse.clone(), camera);
    let intersects = raycaster.intersectObject(globe);
    for(let i=0;i<intersects.length;i++){
      updateApp(intersects[i].point);
    }
  };

  window.onresize=()=>{
    windowWidth=window.innerWidth-infoWidth;
    camera.aspect = windowWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(windowWidth, window.innerHeight);
  };

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.mouseButtons = {
    
    MIDDLE: three.MOUSE.DOLLY,
    RIGHT: three.MOUSE.ROTATE
  };
  
  /////

  ///// Game Loop
  function animate() {
    requestAnimationFrame(animate);
    camera.position.clampLength(5.125,20);    
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
  /////
  return renderer.domElement;
}

export {RenderWorld,RenderBoundary}