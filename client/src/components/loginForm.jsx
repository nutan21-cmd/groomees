import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import { toast } from "react-toastify";


import { getCurrentUser, login } from "../services/authService";

class LoginForm extends Component {
  state = {
    data: { email: "", password: "" }  
};


  handleSubmit = async e => {
      e.preventDefault();
    try {
      const { data } = this.state;
    //console.log(data);
    await login(data.email, data.password);
      const { state } = this.props.location;
      toast.info("Welcome!");

    window.location = state ? state.from.pathname : "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        toast.error(ex.response.data);
      }
    }
  };

  render() {
    if (getCurrentUser()) return <Redirect to="/" />;

    return (
      <div>
        <h1>Login</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInputField("email", "Email")}
          {this.renderInputField("password", "Password", "password")}
          <button className="btn btn-primary">Login
          </button>
        </form>
      </div>
    );
  }

  renderInputField(inputName, inputLabel, inputType = "text", readonlyattr) {
    const data = this.state.data;
    return (
      <React.Fragment>
        <div className="form-group">
          <label htmlFor={inputName}>{inputLabel}</label>
          <input
            readonly={readonlyattr ? "readonly" : false}
            type={inputType}
            name={inputName}
            id={inputName}
            value={data[inputName]}
            label={inputLabel}
            onChange={this.handleChange}
            className="form-control"
          />
        </div>
      </React.Fragment>
    );
  }

  handleChange = e => {
    const input = e.currentTarget;
    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data });
  };
}

export default LoginForm;
