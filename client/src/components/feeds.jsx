import React, { Component } from "react";
import { getUserById } from "../services/userService";
class Feeds extends Component {
  state = { feeds: [] };

  async componentDidMount() {
    const { data: user } = await getUserById(this.props.user._id);
    const feeds = user.feeds;
    this.setState({ feeds });
  }

  render() {
    return (
      <React.Fragment>
        <h2>Your Feeds</h2>
        <ul className="list-group">
          {this.state.feeds.map(feed => (
            <li className="list-group-item" key={feed}>
              {feed}
            </li>
          ))}
        </ul>
      </React.Fragment>
    );
  }
}

export default Feeds;
