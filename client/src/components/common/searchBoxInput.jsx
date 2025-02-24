import React, { Component } from 'react';
class SearchBoxInput extends Component {
    render() { 
        return ( <input
            type="text"
            name="query"
            className="form-control my-3 mr-2"
            placeholder={this.props.placeholder}
            value={this.props.value}
            onChange={e => this.props.onChange(e.currentTarget.value)}
          /> );
    }
}
 
export default SearchBoxInput;
