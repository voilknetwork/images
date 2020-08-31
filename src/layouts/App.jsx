import React, { Component } from 'react';
import { Route, Switch, Redirect } from "react-router-dom";
import dashboardRoutes from "../routes/dashboard";
import './App.css';

class App extends Component {
  state = {  }
  render() { 
    return ( <div>
     <Switch>
                  {dashboardRoutes.map((prop, key) => {
                    
                    if (prop.redirect)
                      return <Redirect from={prop.path} to={prop.pathTo} key={key} />;
                    if (prop.dynamic)
                      return (
                        <Route
                          path={prop.path}
                          component={prop.component}
                          key={key}
                        />
                      );
                    return (
                      <Route path={prop.path} component={prop.component} key={key} />
                    );
                  })}
                </Switch>
  </div> );
  }
}
 

export default App;
