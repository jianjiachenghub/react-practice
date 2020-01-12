import React from "react";
import styled from 'styled-components';
import { renderRoutes } from 'react-router-config';
import produce from 'immer'
import {
    NavLink,
    Router,
    Route,
    Switch,
    Link,
    BrowserRouter
  } from "react-router-dom";
import Box from '../Box'

export const Content = styled.div`
    position: fixed;
    top: 0px;
    left: 0;
    width: 100%;
`;

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`;

// 创建一个 Wrapper 组件,它将渲染一个附加了样式的 <section> 标签
const Wrapper = styled.section`
  border:1px solid black;
  height:100vh;
  z-index:-1;
`;


function Hello(props) {
  let currentState = {
    a: [],
    p: {
      x: 1
    }
  }
  let nextState = produce(currentState, (draftState) => {
    draftState.p.y = 3
  })
  
  //nextState.a = 4; // 此处的修改无效
  console.log(nextState.p.y); // 3
  const {route} = props
  console.log(props)
    return (

        <Wrapper>
          <Title>点击后Demo展示区域</Title>
          { renderRoutes (route.routes) }
        </Wrapper>

    );
  }
  
  export default Hello;
