import React from 'react';

export default class Checkbox extends React.Component {
  render() {
      return (
          <span>
               <input type="checkbox"
                   value={this.props.value}
									 name={this.props.name}
                   disabled={this.props.disabled}
                   checked={this.props.checked}
                   onChange={this.props.handleChange}
               />
          </span>
       );
   }
}
