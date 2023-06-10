import logo from './logo.svg';
import './App.css';
import { useState  } from 'react';
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
