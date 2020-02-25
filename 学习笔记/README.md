## 受控组件
在 HTML 中，表单元素（如`<input>`、 `<textarea>` 和 `<select>`）之类的表单元素通常自己维护 state，并根据用户输入进行更新。而在 React 中，可变状态（mutable state）通常保存在组件的 state 属性中，并且只能通过使用 setState()来更新。

我们可以把两者结合起来，使 React 的 state 成为“唯一数据源”。渲染表单的 React 组件还控制着用户输入过程中表单发生的操作。被 React 以这种方式控制取值的表单输入元素就叫做“受控组件”。

## 非受控组件

表单数据由DOM本身处理。即不受setState()的控制，与传统的HTML表单输入相似，input输入值即显示最新值（使用 ref 从DOM获取表单值）

## 递归组件
```
class Item extends React.Component {
  render() {
    const list = this.props.children || [];
    return (
      <div className="item">
        {list.map((item, index) => {
          return (
            <React.Fragment key={index}>
              <h3>{item.name}</h3>
              {// 当该节点还有children时，则递归调用本身
              item.children && item.children.length ? (
                <Item>{item.children}</Item>
              ) : null}
            </React.Fragment>
          );
        })}
      </div>
    );
  }
}

```

## 高阶组件(HOC)

高阶组件（HOC，Higher-Order Components）不是组件，而是一个函数，它会接收一个组件作为参数并返回一个经过改造的新组件：
```
const EnhancedComponent = higherOrderComponent(WrappedComponent);

```
作用:
- 抽取重复代码，实现组件复用，常见场景,页面复用;
- 条件渲染，控制组件的渲染逻辑（渲染劫持），常见场景,权限控制;
- 捕获/劫持被处理组件的生命周期，常见场景,组件渲染性能追踪、日志打点

```
import React,{Component} from 'react';

const Seventeen = WrappedComponent =>
  class extends React.Component {
    render() {
      const props = {
        ...this.props,
        name: "这是高阶组件"
      };
      return <WrappedComponent {...props} />;
    }
  };

class WrappedComponent extends React.Component {
  state={
     baseName:'这是基础组件' 
  }
  render() {
    const {baseName} = this.state
    const {name} = this.props
    return <div>
        <div>基础组件值为{baseName}</div>
        <div>通过高阶组件属性代理的得到的值为{name}</div>
    </div>
  }
}

export default Seventeen(WrappedComponent)

```

## 反向继承
原理就是利用 super 改变改组件的 this 方向,继而就可以在该组件处理容器组件的一些值

## Portals
当你从组件的 render 方法返回一个元素时，该元素将被挂载到 DOM 节点中离其最近的父节点：
```
render() {
  // React 挂载了一个新的 div，并且把子元素渲染其中
  return (
    <div>
      {this.props.children}
    </div>
  );
}
```
Portal 提供了一种将子节点渲染到存在于父组件以外的 DOM 节点的优秀的方案。domNode是真实的节点
```
render() {
  // React 并*没有*创建一个新的 div。它只是把子元素渲染到 `domNode` 中。
  // `domNode` 是一个可以在任何位置的有效 DOM 节点。
  return ReactDOM.createPortal(
    this.props.children,
    domNode
  );
}
```

## 在 React 使用innerHTML
有些后台返回是 html 格式字段,就需要用到 innerHTML 属性
```
export default class TwentyFive extends React.Component {
  render() {
    return (
      <div dangerouslySetInnerHTML={{ __html: "<span>这是渲染的 HTML 内容</span>" }}></div>
    );
  }
}
```

## 动态绑定 className

```
render(){
  const flag=true
  return (
    <div className={flag?"active":"no-active"}>这是技巧 34</div>
  )
}

```