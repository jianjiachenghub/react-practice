## BrowserRouter
>BrowserRouter或hashRouter用来渲染Router所代表的组件

- 保存当前的访问的路径，当路径变化时会重新渲染Route所代表的组件
- 监听popstate，路径变化时会修改state保存新的访问路径，从而重新渲染Route代表的组件
- 提供修改url和state的方法，供内部嵌入的组件使用，从而触发页面重新渲染
注意：BrowserRouter采用了Redux类似思想，在最顶层Provider里提供context，来进行全局子组件通信


```
import React from 'react';
import {Provider} from './context';
// 
// 想染路径变化 刷新组件 路径定义在状态中 路径变化就更新状态
export default class BrowserRouter extends React.Component{
  state = {
    // 获取打开网页时的默认路径
    location:{
      pathname: window.location.pathname || '/',
    }
  }
  
  
  componentWillMount(){
    window.addEventListener('popstate',()=>{
      let pathname = window.location.pathname;
      this.handleChangeState(pathname);
    },false);
  }
  
  //当浏览器的路由改变时触发，改变state从而重新渲染组件
  handleChangeState(pathname){
    this.setState({
      location:{
        ...this.state.location,
        pathname
      }
    })
  }
  
  // 渲染Route，
  render(){ 
    let that = this;
    let value = {
      ...this.state,
      history:{
        push(pathname){
          // 这个方法主要是提供给Link使用的
          // 当点击Link时，会改变浏览器url并且重新渲染组件
          window.history.pushState({},null,pathname);
          that.handleChangeState(pathname);
        }
      }
    }
    return( 
    <Provider value={value}>
        {this.props.children}   //嵌入的Route组件
    </Provider>
    )
  }
}

```


## React-router中Link组件

- 拿到props上的to属性
- 生成a标签
- 从React的context API全局对象中拿到history
- 监听a标签点击事件调用history跳转

```
class Link extends React.Component {

    
   handleClick = event => {
   ...

     const { history } = this.context.router;
     const { replace, to } = this.props;
     if (replace) {
       history.replace(replace);
     } else {
      history.push(to);
     }
   }
  };
  render(){
    const { replace, to, innerRef, ...props } = this.props;
     <a {...props} onClick={this.handleClick}/>
  }
}

```

## React-router中Route组件



当url改变的时候，将所代表组件的path和当前的url(state.pathname)进行匹配
如果匹配成功，则渲染该组件的componet或者children属性所赋值的那个组件。
否则返回null。

Route是一个组件，每一个Route都会监听自己context并执行重新的渲染，为子组件提供了新的props,  props.match用来决定是否渲染component和render，props.match由matchPath生成

Route 接受上层的 Router 传入的 context，Router 中的 history 监听着整个页面的路由变化，当页面发生跳转时，history 触发监听事件，Router 向下传递 nextContext，就会更新 Route 的 props 和 context 来判断当前 Route 的 path 是否匹配 location，如果匹配则渲染，否则不渲染。





```js

function getContext(props, context) {
  const location = props.location || context.location;
  const match = props.computedMatch
    ? props.computedMatch // <Switch> already computed the match for us
    : props.path  // <Route path='/xx' ... >
      ? matchPath(location.pathname, props)
      : context.match; // 默认 { path: "/", url: "/", params: {}, isExact: pathname === "/" }

  return { ...context, location, match };
}

class Route extends React.Component {
  render() {
    return (
      <RouterContext.Consumer>
        {context => {
          invariant(context, "You should not use <Route> outside a <Router>");
          // 通过path生成props
          // this.props = {exact, path, component, children, render, computedMatch, ...others }
          // context = { history, location, staticContext, match }
          const props = getContext(this.props, context);
          // 结构Route的props
          let { children, component, render } = this.props;
          // 空数组用null代替
          if (Array.isArray(children) && children.length === 0) {
            children = null;
          }
          if (typeof children === "function") {
            // 无状态组件时
            children = children(props);
            if (children === undefined) {
              children = null;
            }
          }
          return (
            <RouterContext.Provider value={props}>
              {children && !isEmptyChildren(children) // children && React.Children.count > 0
                ? children  
                : props.match // match为true，查找到了匹配的<Route ... >
                  ? component
                    ? React.createElement(component, props) //创建react组件，传递props{ ...context, location, match }
                    : render
                      ? render(props) // 执行render方法
                      : null
                  : null}
            </RouterContext.Provider>
            // 优先级  children > component > render
          );
        }}
      </RouterContext.Consumer>
    );
  }
}



```

## Switch

Switch组件其实就是包装在Route外面的一层组件，它会对Route进行筛选后返回唯一Route，如果 没有Switch的话，可以渲染多个Route代表的组件

```
import React from 'react';
import {Consumer} from './context';
import pathToRegExp from 'path-to-regexp';
export default class Switch extends React.Component{
  render(){
    return <Consumer>
      {(value)=>{
        // BrowserRouter中state.pathname和浏览器url一致
        let pathname = value.location.pathname;
        
        // 将Route的path对url进行匹配，匹配成功返回唯一的Route
        React.Children.forEach(this.props.children,(child)=>{
          let {path='/',exact=false} = child.props;
          let reg = pathToRegExp(path,[],{end:exact});
          if(reg.test(pathname)){
            return child    
          }
        })
      }}
    </Consumer>
  }
}

```

## Redirect
对于没有匹配到的Route会默认重定向渲染Redirect，其实就是直接改变url和BrowserRouter中state.pathname导致重新渲染组件

```
import React from 'react';
import {Consumer} from './context';
export default class Redirect extends React.Component{
  render(){
    return <Consumer>
      {({history})=>{   //修改url，重新渲染组件
          history.push(this.props.to);
          return null
      }}
    </Consumer>
  }
}
```

## withRoute

是一个高阶组件，前面提到只有Router渲染出来的组件才有match、location、history三个属性,但普通的组件也想用怎么办？
可以在外面套一层Route组件，从而得到这三个属性，这种做法叫高阶组件withRoute。
```
import React from 'react';
import Route from './Route'
let withRouter = (Component) =>{
  return ()=>{
    return <Route component={Component}></Route>
  }
}
export default withRouter;


import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
class withRouterLink extends Component {
  change = ()=>{
   this.props.history.push('/withRouterLink') // url变化，组件的跳转
  }
  render() {
    return (
      <div className="navbar-brand" onClick={this.change}>withRouter</div>
    )
  }
}
// 高阶组件
export default withRouter(Logo)

```

## 