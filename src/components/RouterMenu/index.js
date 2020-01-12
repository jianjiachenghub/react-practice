import React, { PureComponent } from "react";
import { NavLink, HashRouter } from "react-router-dom";
import PropTypes from "prop-types";
import styled, { keyframes } from "styled-components";

const RouterDiv = styled.div`
  width: 20vw;
  height: 100vh;
  li{
    white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
  }
  li:hover{
    overflow:visible;
  }
`;

const MoveUl =  styled.ul`
  margin-left:${props => props.move*1}vw;
`;
export default class RouterMenu extends PureComponent {
  static propTypes = {
    routes: PropTypes.array.isRequired
  };

  /**
   * @description 递归生成树形菜单
   * @memberof RouterMenu
   * @param {routes} 上层传来的路由配置信息
   * @param {count} 递归的层数
   */
  recursive = (routes, count) => {
    return routes.map((currentItem, index) => {
      console.log(currentItem);
      if (currentItem.routes) {
        return (
          <li
            className={count + "-" + (index+1)}
            key={count + "-" + (index+1)}
            onClick={e => {
              this.changeView(e, count + "-" + (index+1));
            }}
          >
            <NavLink
              to={currentItem.path}
              className={"title-" + count}
              key={count + "-" + (index+1)}
            >
              {currentItem.path}
            </NavLink>
            <MoveUl className={count + "-" + (index+1)} move={count}>
              {this.recursive(currentItem.routes, count + 1)}
            </MoveUl>
          </li>
        );
      } else {
        return (
          !currentItem.render && (
            <li className={count + "-" + index} key={count + "-" + index}>
              <NavLink to={currentItem.path}>{currentItem.path}</NavLink>
            </li>
          )
        );
      }
    });
  };

  changeView = (e, className) => {
    /**
     * 为什么不用e.stopPropagation()
     * 点击子元素还是会触发changeView，但不会触发changeView上层的事件。
     * 要先不触发只能给下层每一个子节点加个阻止事件冒泡的监听才行效率很低
     */
    const menuItem = e.target.getElementsByClassName(className)[0];
    // 如果没有ul子菜单返回
    if (!menuItem) return;
    if (menuItem.style.display !== "none") {
      menuItem.style.display = "none";
    } else {
      menuItem.style.display = "block";
    }
  };

  render() {
    const { routes } = this.props;
    console.log(123);
    return (
      <HashRouter>
        <RouterDiv>{this.recursive(routes, 1)}</RouterDiv>
      </HashRouter>
    );
  }
}
