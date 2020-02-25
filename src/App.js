import React,{useEffect} from "react";
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
import { renderRoutes } from "react-router-config";
import routes from "./route/index";
import RouterMenu from "./components/RouterMenu/index";
import { GlobalStyle } from "./GlobalStyle";

console.log(routes);

const StyledLink = styled(Link)`
  color: palevioletred;
  font-weight: bold;
`;

const StyledRoute = styled(Route)`
  width: 100px;
  height: 100px;
`;

const Demo = styled.div`
  width:40vw;
  height:100vh;
  position:absolute;
  top:0;
  left:20vw;
`;

function App() {
  let myRef = React.createRef()

  useEffect(() => {
      myRef.current.doit()
  }, [])

  return (
    <div className="App">
      <GlobalStyle></GlobalStyle>
      <RouterMenu routes={routes} ref = {myRef}/>
      <Demo><HashRouter>{renderRoutes(routes)}</HashRouter></Demo>
      
    </div>
  );
}

export default App;
