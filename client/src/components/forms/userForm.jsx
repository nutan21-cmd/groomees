import React, { Component } from "react";
import {
  getUserById,
  updateUser,
  createUser,
  deleteUser,
  addFollower,
  removeFollower
} from "../../services/userService";
import { getCurrentUser } from "../../services/authService";
import { toast } from 'react-toastify';
var moment = require("moment");

class UserForm extends Component {
  state = {
    newUser: false,
    data: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      email: "",
      password: "",
      gender: "",
      type: "",
      street1: "",
      city1: "",
      state1: "",
      zip1: "",
      street2: "",
      city2: "",
      state2: "",
      zip2: "",
      phone1: "",
      phone2: "",
    },
    types: ["Admin", "Owner", "Reader", "Critic", "Author"]
    //todo dropdown for store address only for admin
  };

  async componentDidMount() {
   

    const userId = this.props.match.params.id;
    if (userId == "new") {
      this.setState({ newUser: true });
      return;
    }
    const { data: user } = await getUserById(userId);
    this.setState({ data: this.mapToViewModel(user) });
  }

  mapToViewModel(user) {
    let userLogged =this.props.user;
    if(!userLogged){
      userLogged=getCurrentUser();
    }
      const loggedInUserId=userLogged._id;
      const userFollowsThisUser=user.followers.includes(loggedInUserId);
     
    return {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      type:user.TYPE,
      dob: this.formatDate(user.dateOfBirth),
      gender: user.gender,
      email: user.email,
      street1: user.addresses.length>0?user.addresses[0].street:"",
      city1: user.addresses.length>0?this.getAddress(user.addresses[0].city):"",
      state1: user.addresses.length>0?this.getAddress(user.addresses[0].state):"",
      zip1: user.addresses.length>0?this.getAddress(user.addresses[0].zip):"",
    
      street2: user.addresses.length>1?this.getAddress(user.addresses[1].street):"",
      city2: user.addresses.length>1?this.getAddress(user.addresses[1].city):"",
      state2: user.addresses.length>1?this.getAddress(user.addresses[1].state):"",
      zip2: user.addresses.length>1?this.getAddress(user.addresses[1].zip):"",

      phone1: user.phones.length>0?user.phones[0].phone:"",
      phone2: user.phones.length>1?user.phones[1].phone:"",
      userFollowsThisUser:userFollowsThisUser
    };
  }
  getAddress(f){
    return f;
  }
  

  handleSubmit = async e => {
    e.preventDefault();
    console.log(this.state.data);
    try{
    if (this.state.newUser) {
      await createUser(this.state.data);
    } else {
      await updateUser(this.state.data._id, this.state.data);
    }
    this.props.history.push("/users");
    }catch (ex) {
      if (ex.response) {
        toast.error(ex.response.data);
      }
    }
  };

  handleChange = e => {
    const input = e.currentTarget;
    const data = { ...this.state.data };
    data[input.name] = input.value;

    this.setState({ data });
  };

  async handleDelete(){
      await deleteUser(this.state.data._id);
      this.props.history.push("/users");
  }

  render() {
    const old = !this.state.newUser;
    const isProfileOpened=this.props.user._id==this.state.data._id;
    const isAdmin= this.props.user!=null &&this.props.user.TYPE=="Admin";
    const isAdminProfileOpened=this.state.data.type=="Admin";

    return (
      <div>
        <div className="row">
          <div className="col-3"> {!isAdminProfileOpened&&!isProfileOpened&&old&&!isAdmin&&(this.renderFollowButton())} </div>
          <div className="col-3">
            {" "}
            {isAdmin && old &&!isProfileOpened&& <button className="btn btn-danger m-2" onClick={()=>{this.handleDelete()}}>Delete User</button>}
          </div>
        </div>
        <h2 className="h2 d-inline-block">{this.state.data.firstName}</h2>
            <span className="badge badge-primary align-top">{this.state.data.type}</span>

        <form onSubmit={this.handleSubmit}>
          {this.renderInputField(
            "firstName",
            "First Name",
            "text",
            old && true
          )}

          {this.renderInputField("lastName", "Last Name", "text", old && true)}
          {this.renderSelectGender("gender", "Gender", old && true)}
          {this.renderInputField("email", "Email", "text", old && true)}
          {!old &&
            this.renderInputField("password", "Password", "password", old && true)}

          {this.renderSelectTYPE("type", "TYPE",old)}

          {this.renderInputField("dob", "Date of Birth", "text", old && true)}
          <hr/>
          <h3>Primary Address</h3>
          {this.renderInputField("street1", "Street", "text",!(isProfileOpened||isAdmin))}
          {this.renderInputField("city1", "City", "text",!(isProfileOpened||isAdmin))}
          {this.renderInputField("state1", "State", "text",!(isProfileOpened||isAdmin))}
          {this.renderInputField("zip1", "ZIP", "text",!(isProfileOpened||isAdmin))}

          <h3>Secondary Address (Optional)</h3>
          {this.renderInputField("street2", "Street", "text",!(isProfileOpened||isAdmin))}
          {this.renderInputField("city2", "City", "text",!(isProfileOpened||isAdmin))}
          {this.renderInputField("state2", "State", "text",!(isProfileOpened||isAdmin))}
          {this.renderInputField("zip2", "ZIP", "text",!(isProfileOpened||isAdmin))}

          {this.renderInputField("phone1", "Primary Number", "text",!(isProfileOpened||isAdmin))}
          {this.renderInputField("phone2", "Secondary Number (Optional)", "text",!(isProfileOpened||isAdmin))}
          {(isProfileOpened||isAdmin) && this.renderButtonField("Save")}
        </form>
      </div>
    );
  }



  formatDate(date) {
    var fomatted_date = moment(date).format("YYYY-DD-MM");
    return fomatted_date;
  }

  renderFollowButton() {
      if(this.state.data.userFollowsThisUser){
        return <button onClick={()=>{this.handleUnfollow()}} className="btn btn-warning m-2">Unfollow</button>;
      }
    return <button onClick={()=>{this.handleFollow()}} className="btn btn-primary m-2">Follow</button>;
  }

  async handleFollow(){
      console.log(this.state.data._id);
      console.log(this.props.user);
      await addFollower(this.props.user._id,this.state.data._id);
      this.props.history.push("/users");
  }

  async handleUnfollow(){
    console.log(this.state.data._id);
    console.log(this.props.user);
    await removeFollower(this.props.user._id,this.state.data._id);
    this.props.history.push("/users");
}

  renderButtonField(buttonLabel) {
    return (
      <button className="btn btn-primary m-2" type="submit">
        {buttonLabel}
      </button>
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

  renderSelectTYPE(inputName, inputLabel,disabled) {
    const data = this.state.data;
    const choices = this.state.types;
    return (
      <React.Fragment>
        <div className="form-group">
          <label htmlFor={inputName}>{inputLabel}</label>
          <select disabled={disabled?"disabled":""}
            name={inputName}
            id={inputName}
            value={data["type"]}
            onChange={this.handleTypeChange}
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

  handleTypeChange = e => {
    const input = e.currentTarget;
    const data = { ...this.state.data };
    data["type"] = input.value;
    this.setState({ data });
  };

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
          {(inputName=="phone1"||inputName=="phone2") && <small id="phoneHelp" class="form-text text-muted">Format: 123-456-7897</small>}
          {(inputName=="dob") && <small id="dateHelp" class="form-text text-muted">Format: YYYY-MM-DD</small>}
        </div>
      </React.Fragment>
    );
  }
}

export default UserForm;
