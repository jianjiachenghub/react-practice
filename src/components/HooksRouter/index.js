import React from "react";
import styled from "styled-components";
import {
  NavLink,
} from "react-router-dom";
import { renderRoutes } from 'react-router-config';

function HooksRouter({route}){
    return(
        <>
        <ul id="menu">
          <li>
            <NavLink to="/hooks/useMemo">useMemo</NavLink>
          </li>
          <li>
            <NavLink to="/hooks/useReducer">useReducer</NavLink>
          </li>
          <li>
            <NavLink to="/hooks/useContext">useContext</NavLink>
          </li>
          <li>
            <NavLink to="/hooks/useRef">useRef</NavLink>
          </li>
          <li>
            <NavLink to="/hooks/usePrevious">usePrevious</NavLink>
          </li>
          <li>
            <NavLink to="/hooks/useClientRect">useClientRect</NavLink>
          </li>
          { renderRoutes (route.routes) }
        </ul>
        </>

    )
}
export default HooksRouter