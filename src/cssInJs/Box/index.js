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
    let isUpdate = ()=>{
      console.log(111)
    }
    console.log(222)
    return (

    <divs onClick={isUpdate}>
        123123
   
      </divs>

    );
  }
  
  export default Box;