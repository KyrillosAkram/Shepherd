import * as faceapi from 'face-api.js';
import logo from './logo.svg';
import './App.css';
import { useState , createContext ,useEffect ,useRef,Provider  } from 'react';
import  CustomAppBar  from './components/AppBar';
import  AppBody from './components/AppBody';
import ResponsiveDrawer from './components/AppDrawer';
import { AppGlobalContext } from './context';
import {open_db} from './db';

function App() {
  const [progressCircleState,setProgressCircleState]=useState('none')
  const [pageName,setPageName]=useState('Session')
  const [drawerState, setdrawerState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [captureVideo, setCaptureVideo] = useState(false);
  let render_count=0;
  window.faceapi=faceapi;
  open_db();
  useEffect(() => {
    if(render_count===0)
{    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL  +'/models';
      console.log("loading models");
      setProgressCircleState('progress')
      Promise.all([
        window.faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        window.faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL), 
        window.faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        window.faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]).then(
        setModelsLoaded(true),
        console.log("models loaded"),
        setProgressCircleState('done')
        ).catch(err=>console.log(err));
    }
    loadModels();
  }
render_count++;
console.log(`render_count ${render_count}`)
}, []);
  const AppCTRL=
  {
    Bar:{/*progressCircleState,*/setProgressCircleState},
    Body:{/*pageName,*/setPageName},
    Drawer:{ /*drawerState,*/ setdrawerState},
    // FaceAPIWorker:{get_face_discribtor},
  }

    
  // TODO: create context passing controler and web worker to all children
  // and the controller will be an object encapsulate worker methods and function from old app.js
  const drawerOpenerCallback=(e)=>setdrawerState({...drawerState,left:true})
  return ( //TODO: consider login view
    <div className="App">
      <AppGlobalContext.Provider value={AppCTRL}>
        <CustomAppBar
          title={pageName}
          drawerOpener={drawerOpenerCallback}
          progressCircleState={progressCircleState} />
        <AppBody page={pageName} />
        <ResponsiveDrawer drawerState={drawerState} setDrawerState={setdrawerState} setPageName={setPageName} />
      </AppGlobalContext.Provider>
    </div>

  );
}

export default App;
