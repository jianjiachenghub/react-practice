import React from "react";
import styled from "styled-components";
import {
  NavLink,
} from "react-router-dom";
import { renderRoutes } from 'react-router-config';

function CssInJsRouter({route}){
    return(
        <>
        <ul id="menu">
          <li>
            <NavLink to="/CssInJsRouter/hello">Hello</NavLink>
          </li>
          { renderRoutes (route.routes) }
        </ul>
        </>

    )
}
export default CssInJsRouter