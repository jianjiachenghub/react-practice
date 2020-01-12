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

// 设置div的属性
const Thing = styled.div.attrs({ tabIndex: 0 })`
height:30px;
  color: blue;
  ::before {
    content: "🚀";
  }
  &:hover {
    color: red; // <Thing> when hovered
  }
  & ~ & {
    background: black; // <Thing> as a sibling of <Thing>, but maybe not directly next to it
  }
  & + & {
    background: red; // <Thing> next to <Thing>
  }
  &.something {
    background: orange; // <Thing> tagged with an additional CSS class ".something"
  }
  .something-else & {
    border: 1px solid; // <Thing> inside another element labeled ".something-else"
  }
`;
export default function ComplexSelector() {
  return (
    <React.Fragment>
      <Thing id={123}>1</Thing>
      <Thing>2</Thing>
      <Thing>2.1</Thing>
      <Thing className="something">3</Thing>
      <div>4</div>
      <Thing>5</Thing>
      <div>分割</div>
      <Thing>5.1</Thing>
      <Thing>6</Thing>
      <div className="something-else">
        <Thing>7</Thing>
      </div>
    </React.Fragment>
  );
}
