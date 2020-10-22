import React from "react";
import styled from "styled-components";
import {
  NavLink,
} from "react-router-dom";
import { renderRoutes } from 'react-router-config';
import {Title} from '../../GlobalStyle'

function CssInJsRouter({route}){
  console.log(renderRoutes (route.routes))
    return(
        <>
        <Title>CssInJsRouter</Title>
          { renderRoutes (route.routes) }

        </>

    )
}
export default CssInJsRouter