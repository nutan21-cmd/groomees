import { Component } from "react";
import {logout} from "../services/authService";
import { toast } from "react-toastify";


class Logout extends Component {
  componentDidMount() {
         logout();

    window.location = "/";
    toast.info("Logged Out Successfully ");
  }

  render() {
    return null;
  }
}

export default Logout;
