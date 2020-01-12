
import React, { Component } from 'react'


// child
const FancyButton = React.forwardRef((props, ref) => (
    <button ref={ref} className="FancyButton">
      {props.children}
    </button>
  ));

// father
export default class refsForward extends Component {
    constructor(){
        super()
        this.ref = React.createRef();
    }
    componentDidMount(){
        console.log(this.ref);
    }
    render() {
        return (
            <div>
                <FancyButton ref={this.ref}>FancyButton</FancyButton>;
            </div>
        )
    }
}
