import React from 'react';
import { toMin } from '../../utilities'


// IntegerControl Component
// - props.title
// - props.value
// - props.increment
// - props.decrement
export default
class IntegerControl extends React.Component {
    render() {
      return (
        <div> 
          <div className="row justify-content-center">
            <div className="col-auto">
              <h4 className="text-primary">{this.props.title}</h4>
            </div>
          </div>
  
          <div className="row justify-content-center">
            <div className="col-auto">
              <button className="btn btn-primary mr-1"
                onClick={this.props.decrement}>
                  <i className="fa fa-arrow-down"/>
              </button>
  
              <button className="btn btn-outline-primary mr-1">
                {toMin(this.props.value)}
              </button>
  
              <button className="btn btn-primary mr-1"
                onClick={this.props.increment}>
                  <i className="fa fa-arrow-up"/>
              </button>
            </div>
          </div>
        </div>  
      )
    }
  }
  