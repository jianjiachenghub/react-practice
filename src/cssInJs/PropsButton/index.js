import React from "react";
import styled from "styled-components";
import {
  NavLink,
  Router,
  Route,
  Switch,
  Link,
  BrowserRouter
} from "react-router-dom";
const Button = styled.button`
  /* Adapt the colors based on primary prop */
  background: ${props => props.primary ? "palevioletred" : "white"};
  color: ${props => props.primary ? "white" : "palevioletred"};
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
`;

function PropsButton() {
    return (

    <div>
        <Button>Normal</Button>
        <Button primary>Primary</Button>
        <NavLink to="/hello/box">box</NavLink>
      </div>

    );
  }
  
  export default PropsButton;