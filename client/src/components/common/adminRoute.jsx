import React from "react";
import { Route, Redirect } from "react-router-dom";
import { getCurrentUser } from "../../services/authService";
import { toast } from 'react-toastify';

const AdminRoute = ({ path, component: Component, render, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        if (!getCurrentUser()||getCurrentUser().TYPE!="Admin"&&getCurrentUser().TYPE!="Owner"){
            toast.error("You need to Login as ADMIN or OWNER!");
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

export default AdminRoute;
