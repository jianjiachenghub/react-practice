import React from "react";
import styled from "styled-components";
import {
  NavLink,
  Router,
  Route,
  Switch,
  Link,
  BrowserRouter,
  HashRouter,
  Redirect
} from "react-router-dom";
import { renderRoutes } from 'react-router-config';
import {Title} from '../../GlobalStyle'

function HooksRouter({route}){
    return(
        <>
        <Title>RefsRouter</Title>
        <ul id="menu">
          <li>
            <NavLink to="/refs/refsForward">refsForward</NavLink>
          </li>
          <li>
            <NavLink to="/refs/higherOrderRefsForwardIndex">higherOrderRefsForward</NavLink>
          </li>
          { renderRoutes (route.routes) }
        </ul>
        </>

    )
}
export default HooksRouter