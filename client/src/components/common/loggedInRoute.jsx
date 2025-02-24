import React from "react";
import { Route, Redirect } from "react-router-dom";
import { getCurrentUser } from "../../services/authService";
import { toast } from 'react-toastify';

const LoggedInRoute = ({ path, component: Component, render, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        if (!getCurrentUser()){
            toast.error("Please Login First");
            return (
                <Redirect
                  to={{
                    pathname: "/login",
                    state: { from: props.location }
                  }}
                />
              );
        }
         
        return Component ? <Component {...props} /> : render(props);
      }}
    />
  );
};

export default LoggedInRoute;
