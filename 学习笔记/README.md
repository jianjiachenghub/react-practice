## React

React 被描述为 “用于构建用户界面的 JavaScript 库”。
react 主张函数式编程，所以推崇纯组件，数据不可变，单向数据流.只关注 View 层

## React 哲学
>[React16文档对React哲学的阐述](https://zh-hans.reactjs.org/docs/thinking-in-react.htmlhttps://zh-hans.reactjs.org/docs/thinking-in-react.html)

**React 是引导我们思考如何构建一个应用。**
React 哲学认为：显式声明单向数据流，更有助于人们理解程序的运作方式。

React 通过一种比传统的双向绑定略微繁琐的方法来实现反向数据传递。尽管如此，但这种需要显式声明的方法更有助于人们理解程序的运作方式。

比起写，代码更多地是给人看的。我们一起构建的这个模块化示例应用的代码就很易于阅读。出现问题好排错
当你开始构建更大的组件库时，你会意识到这种代码模块化和清晰度的重要性。并且随着代码重用程度的加深，你的代码行数也会显著地减少。:)

### 1.组件层级

- 将组件当作一种函数或者是对象来考虑，根据单一功能原则来判定组件的范围。
- 如果你的模型设计得恰当，UI（或者说组件结构）便会与数据模型一一对应。
- 因为 UI 和数据模型都会倾向于遵守相同的信息结构。

### 2.静态版本

- 将渲染 UI 和添加交互这两个过程分开。
- 编写一个应用的静态版本时，往往要编写大量代码，而不需要考虑太多交互细节。
- 添加交互功能时则要考虑大量细节，而不需要编写太多代码。

### 3.静态版本-渲染 UI

创建一些会重用其他组件的组件，然后通过 props 传入所需的数据，而不应该使用 state 构建静态版本。
state 代表了随时间会产生变化的数据，应当仅在实现交互时使用。自上而下或者自下而上构建应用。
(面向过程或者面向对象)，当你的应用比较简单时，使用自上而下的方式更方便，反之则自下而上的优先编写基础组件。

### 4.通过State完成交互

state具有触发基础数据模型改变的能力(setState自动调用Render)：
- 确认state已被分割到最小(前提是完整)
- 对应的概念是：Don’t Repeat Yourself （不要重复你自己）
- 保留应用所需的可变 state 的最小集合，其他数据均由它们计算产生



## React 组件化

React 以组件的方式去重新思考用户界面的构成，将用户界面上每一个功能相对独立的模块定义成组件，然后将小组件通过组合或嵌套的方式构成大组件，最终完成整体 UI 的构建。

MVC 开发模式的思想：将模型—视图—控制器定义成不同的类，实现表现，数据，控制的分离。

组件化开发模式的思想：用户界面功能模块间的分离，完全是一个新思路，从功能的角度出发，将用户界面分成不同的组件，每个组件都独立封装。

- 可组合：简单组件可以组合为复杂的组件
- 可重用：每个组件都是独立的，可以被多个组件使用
- 可维护：和组件相关的逻辑和 UI 都封装在了组件的内部，方便维护
- 可测试：因为组件的独立性，测试组件就变得方便很多

## React 为什么不用 Vue 的双向绑定

其实这个问题React 哲学里已经说得很清楚了，这里再补充说明一下。
React 只关注解决纯粹的问题： View 层。设计思想是单向数据流，单向数据流已经满足了 View 层渲染的要求并且更易测试 debug 与控制（来自 Props 或 State），代码结构更加清晰易于维护，更利于阅读代码和理解程序的运作方式。

## 受控组件

在 HTML 中，表单元素（如`<input>`、 `<textarea>` 和 `<select>`）之类的表单元素通常自己维护 state，并根据用户输入进行更新。而在 React 中，可变状态（mutable state）通常保存在组件的 state 属性中，并且只能通过使用 setState()来更新。

我们可以把两者结合起来，使 React 的 state 成为“唯一数据源”。渲染表单的 React 组件还控制着用户输入过程中表单发生的操作。被 React 以这种方式控制取值的表单输入元素就叫做“受控组件”。

## 非受控组件

表单数据由 DOM 本身处理。即不受 setState()的控制，与传统的 HTML 表单输入相似，input 输入值即显示最新值（使用 ref 从 DOM 获取表单值）

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

Portal 提供了一种将子节点渲染到存在于父组件以外的 DOM 节点的优秀的方案。domNode 是真实的节点

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

## 在 React 使用 innerHTML

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

## Component 和 Element

实际上我们使用了 React Component 来生成 React Element，这对于开发体验的提升无疑是巨大的。
这里剖出一个思考题：所有 React Component 都需要返回 React Element 吗？显然是不需要的，那么 return null;

## 为什么虚拟 dom 会提高性能

虚拟 dom 相当于在 js 和真实 dom 中间加了一个缓存，利用 dom diff 算法避免了没有必要的 dom 操作，从而提高性能
具体步骤如下：

- 使用 js 来模拟创建一个 dom
- 将这个虚拟 dom 构建真实 dom，插入到页面中
- 状态变更时，比较两颗对象树的差异，生成差异对象
- 根据差异对象进行更新

## JSX 做表达式判断时候，需要强转为 boolean 类型，如：

```
render() {
  const b = 0;
  return <div>
    {
      !!b && <div>这是一段文本</div>
    }
  </div>
}

```

如果不使用 !!b 进行强转数据类型，会在页面里面输出 0。


## 为什么每次都需要引入React

不写一般JSX都会直接报错
```
import React from 'react'
```
原因：因为JSX语法会被编译：

```
import React, { Component } from 'react';

class Process extends Component {

  render() {
    return (<div>哈哈哈</div>)
  }
  
}

```

转义为React.createElement 来创建DOM书，所以需要
```
import React, { Component } from 'react';

class Process extends Component {

  render() {
    return React.createElement(
      'div',
      null,
      '\u54C8\u54C8\u54C8'
    );
  }
}
```


## props改变为什么可以重新渲染视图
>官网原话：state 和 props 之间有什么区别？
props （简称“属性”）和 state 都是在改变时会触发一次重新渲染的 JavaScript 对象。虽然两者都具有影响渲染输出的信息，但它们在一个重要方面是不同的： props 传递到组件（类似于函数参数），而 state 是在组件内管理的（类似于函数中声明的变量）。


props 一旦传入，你就不可以在组件内部对它进行修改。但是你可以通过父组件主动重新渲染的方式来传入新的 props，从而达到更新的效果。因为父组件重新渲染会触发子组件的重新渲染。所以官方所说的props改变会更新视图是一个表象，根本原因是父组件的重新渲染导致的



## 为什么开发环境下每次都渲染了两次

React 在 Dev mode（strictMode） 下会刻意执行两次渲染，以防止组件内有什么 side effect 引起 bug，提前预防。


对于React而言，它推崇的是渲染结果只与state和props有关。即result=f(props, state).

如果组件每次的state和props是一样的，就应该返回一样的结果，若返回结果不一样，说明代码中可能存在副作用。

如示例中的count。这样写是不推崇的。
```
import React from 'react'

let count = 0;

const Page = () => {

  count++

  console.log(`run ${count} times`)

  return (
    <div>Page</div>
  )
}

export default Page
```

## React 里的副作用

首先解释纯函数（Pure function）：给一个 function 相同的参数，永远会返回相同的值，并且没有副作用；这个概念拿到 React 中，就是给一个 Pure component 相同的 props, 永远渲染出相同的视图，并且没有其他的副作用；纯组件的好处是，容易监测数据变化、容易测试、提高渲染性能等；

副作用（Side Effect）是指一个 function 做了和本身运算返回值无关的事，比如：修改了全局变量、修改了传入的参数、甚至是 console.log()，所以 ajax 操作，修改 dom 都是算作副作用的；