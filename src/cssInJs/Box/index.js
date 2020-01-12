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
const divs = styled.div`
  /* Adapt the colors based on primary prop */
    width:100px;
    height:100px;
    border:solid 1px red;

`;

function Box() {
    return (

    <divs>
        123123
   
      </divs>

    );
  }
  
  export default Box;