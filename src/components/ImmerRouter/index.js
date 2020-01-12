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

function ImmerRouter({route}){
    return(
        <>
        <ul id="menu">
          <li>
            <NavLink to="/immer/state">state</NavLink>
          </li>
          <li>
            <NavLink to="/hooks/useReducer">useReducer</NavLink>
          </li>
          <li>
            <NavLink to="/hooks/useContext">useContext</NavLink>
          </li>
          { renderRoutes (route.routes) }
        </ul>
        </>

    )
}
export default ImmerRouter