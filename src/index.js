import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import indexRoutes from "./routes/index.jsx";

const hist = createBrowserHistory();

ReactDOM.render(
      <Router history={hist}>
        <Switch>
          {indexRoutes.map((prop, key) => {
                    
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
      </Router>,
    document.getElementById("root")
  );

