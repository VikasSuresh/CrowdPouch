import React from "react";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import { Convert,Home,MaxPop,Auth } from "./Component";

function App() {
  return (
    <div className="App">
      <div style = {{
        margin: 'auto',
        width:'20%'
      }}>
        <a href='/' style={{paddingRight:"20px"}}>Home</a>
        <a href='/convert' style={{paddingRight:"20px"}}>Convert</a>
        <a href='/pop' style={{paddingRight:"20px"}}>Population</a>
      </div>
      <Router>
        <Switch>
          <Route path = '/auth' component={Auth}/>
          <Route path = '/pop' component={MaxPop}/>
          <Route path = '/convert' component={Convert}/>
          <Route path = '/' component={Home}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
