import React, { Component } from 'react';
class FilterList extends Component {
    getClass=(choice)=>{
        if(choice === this.props.selectedChoice)
        return "list-group-item active" ;
        return "list-group-item";
    }
    render() { 
        const choices= this.props.choices;
        return ( <ul className="list-group">
        {choices.map(choice => (
          <li
            onClick={() => this.props.onChoiceSelect(choice)}
            key={choice}
            className={this.getClass(choice)}
          >
            {choice}
          </li>
        ))}
      </ul> );
    }
}
 
export default FilterList;