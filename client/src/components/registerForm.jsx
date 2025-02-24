import React, { Component } from 'react';
import { register } from "../services/userService";
import { loginAndStoreJWT } from '../services/authService';
import { toast } from "react-toastify";


class RegisterForm extends Component {
  state = {
    data: { firstName: "",gender:"", lastName: "", email: "", password: "" }
  };

  handleSubmit = async e => {
    e.preventDefault();
    try {
      console.log(this.state.data);
      const response = await register (this.state.data);
      console.log(response);
     loginAndStoreJWT(response.headers["x-auth-token"]);
      window.location = "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        toast.error(ex.response.data);
      }
    }
  };

  render() {
    return (
      <div>
        <h1>Register</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInputField("email", "Email")}
          {this.renderInputField("password", "Password", "password")}
          {this.renderSelectGender("gender", "Gender",false)}
          {this.renderInputField("firstName", "First Name")}
          {this.renderInputField("lastName", "Last Name")}
          <button className="btn btn-primary">Register
          </button>
        </form>
      </div>
    );
  }

  renderSelectGender(inputName, inputLabel,disabled) {
    const data = this.state.data;
    const choices = ["Male","Female"];
    return (
      <React.Fragment>
        <div className="form-group">
          <label htmlFor={inputName}>{inputLabel}</label>
          <select disabled={disabled?"disabled":""}
            name={inputName}
            id={inputName}
            value={data["gender"]}
            onChange={this.handleGenreChange}
            className="form-control"
          >
            <option value="" />
            {choices.map(choice => (
              <option key={choice} value={choice}>
                {choice}
              </option>
            ))}
          </select>
        </div>
      </React.Fragment>
    );
  }

  handleGenreChange = e => {
    const input = e.currentTarget;
    const data = { ...this.state.data };
    data["gender"] = input.value;
    this.setState({ data });
  };

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

export default RegisterForm;
