import React from "react";
import styled from "styled-components";
import {
  NavLink,
} from "react-router-dom";
import { renderRoutes } from 'react-router-config';
import {Title} from '../../GlobalStyle'


function HooksRouter({route}){
    return(
        <>
     
          <Title>HooksRouter</Title>
          { renderRoutes (route.routes) }
        </>

    )
}
export default HooksRouter