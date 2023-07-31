import logo from './logo.svg';
import './App.css';
import { useState , createContext  } from 'react';
import  CustomAppBar  from './components/AppBar';
import  AppBody from './components/AppBody';
import ResponsiveDrawer from './components/AppDrawer';

function App() {
  const [progressCircleState,setProgressCircleState]=useState('none')
  const [pageName,setPageName]=useState('Session')
  const [drawerState, setdrawerState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  
  // TODO: create context passing controler and web worker to all children
  // and the controller will be an object encapsulate worker methods and function from old app.js
  const drawerOpenerCallback=(e)=>setdrawerState({...drawerState,left:true})
  return ( //TODO: consider login view
    <div className="App">
      <CustomAppBar 
        title={pageName}
        drawerOpener={drawerOpenerCallback}
        progressCircleState={progressCircleState} />
      <AppBody page={pageName}/>
      <ResponsiveDrawer  drawerState={drawerState} setDrawerState={setdrawerState} />
    </div>

  );
}

export default App;
