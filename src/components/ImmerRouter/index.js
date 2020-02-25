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

function ImmerRouter({route}){
    return(
        <>
        
        <Title>ImmerRouter</Title>
          { renderRoutes (route.routes) }

        </>

    )
}
export default ImmerRouter