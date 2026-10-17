// Original procedural optical archive. No downloaded models, textures or remote services.
import * as T from 'three';

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const mix = (a, b, t) => a + (b - a) * t;
const smooth = t => (t = clamp(t)) * t * (3 - 2 * t);
const poses = [[10,6.8,14,0,0,0], [3.8,3.2,10,0,0,0], [0.6,4.3,13,0,0,0], [0,6,17,0,-.4,0], [-7,6,16,0,0,0]];

export function createWorld(canvas, onFallback = () => {}) {
 let renderer;
 try { renderer = new T.WebGLRenderer({canvas, alpha:true, antialias:devicePixelRatio < 2, powerPreference:'low-power'}); }
 catch {onFallback(); return {render(){}, resize(){}, dispose(){}, stats:()=>({mode:'css-fallback'})};}
 renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 700 ? 1.25 : 1.5));
 renderer.outputColorSpace = T.SRGBColorSpace;
 renderer.toneMapping = T.ACESFilmicToneMapping;
 renderer.toneMappingExposure = 1.35;
 const scene = new T.Scene();
 scene.fog = new T.FogExp2('#090b0d', .025);
 const camera = new T.PerspectiveCamera(38, innerWidth / innerHeight, .1, 100);
 const archive = new T.Group(); scene.add(archive);
 const steel = new T.MeshStandardMaterial({color:'#252c30',metalness:.88,roughness:.26});
 const gold = new T.MeshStandardMaterial({color:'#d2a458',metalness:.86,roughness:.23,emissive:'#b97a2c',emissiveIntensity:.25});
 const glass = new T.MeshPhysicalMaterial({color:'#8badae',metalness:.12,roughness:.1,transparent:true,opacity:.23,clearcoat:1,side:T.DoubleSide,depthWrite:false});
 const edge = new T.LineBasicMaterial({color:'#96b5b6',transparent:true,opacity:.26});
 const lightMat = new T.MeshBasicMaterial({color:'#ffe1a0'});
 const box = new T.BoxGeometry(1,1,1);
 function cube(w,h,d,x,y,z,material,parent=archive){const mesh=new T.Mesh(box,material);mesh.scale.set(w,h,d);mesh.position.set(x,y,z);parent.add(mesh);return mesh;}
 function rail(a,b,r=.018,material=gold,parent=archive){const start=new T.Vector3(...a),end=new T.Vector3(...b),delta=end.clone().sub(start);const mesh=new T.Mesh(new T.CylinderGeometry(r,r,delta.length(),8),material);mesh.position.copy(start).add(end).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());parent.add(mesh);return mesh;}
 // Reflection environment: a generated studio with warm strip lights, no asset requests.
 const envCanvas = document.createElement('canvas');envCanvas.width=512;envCanvas.height=256;
 const ctx=envCanvas.getContext('2d');const gr=ctx.createLinearGradient(0,0,0,256);gr.addColorStop(0,'#17232a');gr.addColorStop(.5,'#07090b');gr.addColorStop(1,'#302219');ctx.fillStyle=gr;ctx.fillRect(0,0,512,256);
 for(const [x,w,color] of [[60,14,'#eed4a3'],[220,5,'#e5e6df'],[380,22,'#987344']]){ctx.fillStyle=color;ctx.fillRect(x,35,w,165);}
 const texture=new T.CanvasTexture(envCanvas);texture.mapping=T.EquirectangularReflectionMapping;texture.colorSpace=T.SRGBColorSpace;
 const pmrem=new T.PMREMGenerator(renderer);const environment=pmrem.fromEquirectangular(texture);scene.environment=environment.texture;texture.dispose();pmrem.dispose();
 scene.add(new T.HemisphereLight('#a5c2ce','#46301e',3));
 const key=new T.DirectionalLight('#ffe0a5',5);key.position.set(-3,6,5);scene.add(key);
 const rim=new T.DirectionalLight('#c3e3ed',3);rim.position.set(5,3,-5);scene.add(rim);
 const lamp=new T.PointLight('#ffb84d',65,22,2);lamp.position.set(0,.3,3);scene.add(lamp);
 const floor=cube(80,.15,80,0,-3,0,new T.MeshStandardMaterial({color:'#101416',metalness:.92,roughness:.27}),scene);
 const grid=new T.GridHelper(70,50,'#665035','#202a2d');grid.position.y=-2.9;scene.add(grid);
 const sheets=[];
 for(let i=0;i<15;i++){
  const g=new T.Group();archive.add(g);
  const slab=cube(5,4.8,.055,0,0,0,glass,g);
  const edges=new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(5,4.8,.055)),edge);g.add(edges);
  for(const x of [-2.57,2.57])cube(.09,5.15,.17,x,0,0,steel,g);
  for(const y of [-2.55,2.55])cube(5.23,.075,.17,0,y,0,steel,g);
  cube(.018,4.5,.08,-2.4,0,.06,gold,g);
  // Fine etched data, registration marks and physical mounts on every optical sheet.
  for(let j=0;j<8;j++){
   cube(.4+((i*13+j*7)%19)*.13,.012,.008,-.8+(j%3)*.5,1.7-j*.42,.05,j%3?edgeMaterial():gold,g);
  }
  for(const x of [-2.57,2.57])for(const y of [-2.15,2.15])cube(.18,.18,.23,x,y,.02,gold,g);
  sheets.push({g,slab,z:(i-7)*.68});
 }
 function edgeMaterial(){return new T.MeshBasicMaterial({color:'#adc1bd',transparent:true,opacity:.24});}
 // One beam traverses the archive and remains the system's execution bus.
 const beam=new T.Group();archive.add(beam);
 rail([0,0,-12],[0,0,9],.025,lightMat,beam);
 const glowMat=new T.MeshBasicMaterial({color:'#e8ac4b',transparent:true,opacity:.06,depthWrite:false,blending:T.AdditiveBlending});
 rail([0,0,-12],[0,0,9],.18,glowMat,beam);rail([0,0,-12],[0,0,9],.5,glowMat,beam);
 for(const x of [-2.7,2.7])rail([x,-2.65,-6],[x,-2.65,6],.06,steel);
 const architecture=new T.Group();scene.add(architecture);
 const modules=[];
 for(let i=0;i<6;i++){
  const g=new T.Group();architecture.add(g);
  cube(1.7,.2,1.6,0,0,0,steel,g);cube(1.5,.065,1.4,0,.14,0,gold,g);cube(1.4,.65,1.3,0,.52,0,glass,g);
  for(let k=0;k<5;k++)cube(.85,.015,.04,0,.3+k*.1,.68,lightMat,g);
  modules.push(g);
 }
 const core=new T.Mesh(new T.IcosahedronGeometry(.9,1),new T.MeshStandardMaterial({color:'#cbb17b',metalness:1,roughness:.2,wireframe:true}));architecture.add(core);core.position.y=.5;
 const bus=[];for(let i=0;i<6;i++){const a=i*Math.PI/3;bus.push(rail([0,-.2,0],[Math.cos(a)*4,-.2,Math.sin(a)*4],.022,gold,architecture));}
 // Seeded particles; geometry and camera are deterministic at a given scroll position.
 const coords=[];let seed=23;for(let i=0;i<180;i++){seed=(seed*16807)%2147483647;const x=(seed/2147483647-.5)*35;seed=(seed*16807)%2147483647;const y=seed/2147483647*12;seed=(seed*16807)%2147483647;coords.push(x,y-2,(seed/2147483647-.5)*28);}
 const dustGeo=new T.BufferGeometry();dustGeo.setAttribute('position',new T.Float32BufferAttribute(coords,3));const dust=new T.Points(dustGeo,new T.PointsMaterial({color:'#d9bd84',size:.025,transparent:true,opacity:.45}));scene.add(dust);
 let lost=false;canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();lost=true;onFallback();});
 function resize(){renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();}
 function render(progress=0,execution=0,failed=false,branch=0){
  if(lost)return;
  const p=clamp(progress,0,4),idx=Math.min(3,Math.floor(p)),t=smooth(p-idx);const a=poses[idx],b=poses[idx+1];
  const mobile=innerWidth<700;
  camera.position.set(mix(a[0],b[0],t),mix(a[1],b[1],t),mix(a[2],b[2],t)*(mobile?1.35:1));
  camera.lookAt(mobile?0:-1.1,mobile?.8:0,0);
  archive.position.x=mobile?0:1.7*(1-smooth(p/3));
  archive.rotation.y=-.12+smooth(p/2)*.3;
  const spread=smooth(p),integrate=smooth(p-1),operate=smooth(p-2),result=smooth(p-3);
  for(let i=0;i<sheets.length;i++){
   const {g,z}=sheets[i];const direction=i-7;
   g.position.set(direction*spread*.75,Math.sin(i*.6)*spread*.6,z*(1-spread*.7));
   g.rotation.set(.04*spread,(-.14+direction*.025)*spread,Math.sin(i*.5)*spread*.04);
   const scale=1-integrate*.67;g.scale.set(scale,scale,scale);
   g.position.y+=integrate*(i%2?2.3:-1.8)-operate*2;
   g.position.x+=integrate*direction*.2;
  }
  glass.opacity=.23-operate*.13;edge.opacity=.26-operate*.13;
  architecture.scale.setScalar(.001+integrate);architecture.rotation.y=.22+result*(branch-1)*.2;
  architecture.position.y=-.6-operate*.6;
  modules.forEach((g,i)=>{const angle=i*Math.PI/3;g.position.set(Math.cos(angle)*4,Math.sin(i*1.3)*.5,Math.sin(angle)*3);g.rotation.y=-angle;g.scale.y=i<=execution?1.3:1;});
  core.rotation.set(.3+p*.2,p*.35,.1);beam.rotation.y=integrate*Math.PI/2;beam.scale.z=1-integrate*.42;
  lamp.color.set(failed?'#ff7957':'#ffc467');gold.emissive.set(failed?'#9a301d':'#b97a2c');gold.emissiveIntensity=.25+execution*.08;
  dust.rotation.y=p*.035;floor.material.roughness=.27+operate*.08;
  renderer.render(scene,camera);
 }
 resize();render();
 return {render,resize,stats:()=>({mode:'webgl',drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,pixelRatio:renderer.getPixelRatio(),geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures}),dispose(){renderer.dispose();environment.dispose();scene.traverse(o=>{o.geometry?.dispose();if(o.material){for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose();}});}};
}
