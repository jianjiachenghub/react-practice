## React-Router-V3

```

import React from "react";
import { render } from "react-dom";
import { Router, Route, IndexRoute, Link, browserHistory } from "react-router";
 
const PrimaryLayout = props =>
  <div className="primary-layout">
    <header>Our React Router 3 App</header>
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/user">User</Link>
      </li>
    </ul>
    <main>
      {props.children}
    </main>
  </div>;
 
const HomePage = () => <h1>Home Page</h1>;
const UsersPage = () => <h1>User Page</h1>;
 
const App = () =>
  <Router history={browserHistory}>
    <Route path="/" component={PrimaryLayout}>
      <IndexRoute component={HomePage} />
      <Route path="/user" component={UsersPage} />
    </Route>
  </Router>;
 
render(<App />, document.getElementById("root"));

```

### V3的嵌套方式 

`<IndexRoute component={HomePage} />`
PrimaryLayout组件的this.props.children，这时是undefined。
IndexRoute就是解决这个问题，显式指定Home是根路由的子组件，即指定默认情况下加载的子组件
使用 {props.children} 来嵌套组件，嵌套出来的结果如下
```
<PrimaryLayout>
    <HomePage/>
<PrimaryLayout/>
```


## React-Router-V4

### V4 中就不复存在的点

- 集中式 router
- 通过 `<Route>` 嵌套，实现 Layout 和 page 嵌套
- Layout 和 page 组件 是作为 router 的一部分

### 包容性路由

在前面的例子中，你可能已经注意到了 exact 这个属性。那么它是什么呢？V3 的路由规则是“排他性”的，这意味着只有一条路由将获胜。V4 的路由默认为“包含”的，这意味着多个 `<Route>` 可以同时进行匹配和渲染。

### “默认路由”和“未找到” 

尽管在 v4 中已经没有 `<IndexRoute>` 了，但可以使用 `<Route exact>` 来达到同样的效果。如果没有路由解析，则可以使用 `<Switch>` 与 `<Redirect>` 重定向到具有有效路径的默认页面（如同我对本示例中的 HomePage 所做的），甚至可以是一个“未找到页面”。



## 对路由的简单理解

实现满足url改变不去发送http请求拉取新的资源，就可以实现SPA
然后用一个事件监听函数监测路由的改变，然后根据路由调用不同的组件来渲染页面

### 比如Route

这种相当于注册一个事件，的url发生改变的时候，满足`/PropsButton`匹配，就去发布渲染PropsButton组件，有点发布订阅的感觉（我也不知能不能怎么说，先这么理解一哈

```
<Route path="/PropsButton" component={PropsButton} />
```

### 嵌套的一些路由

路由是一层一层的渲染

比如现在在Hello组件里写了`<Route path="/box" component={Box} />`

我们进入hello页面，点击 `<NavLink to="/box">box</NavLink>`,或者在其他页面想跳转`/box`路由，你会发现什么都没有

因为路由是Hello组件里注册，你必须先报Hello组件渲染才能看到box

感觉`Route`组件好像就是包裹我们注册的组件一样，它并不占用DOM节点（我们只需要关注注册组件的样式即可

### 一个路由渲染多个组件的样式问题

比如下面我们想让两个路由渲染的组件并排，只需要给个公共父节点即可操作
```
  <div style={{display:'flex'}}>
    <Route path="/PropsButton" component={PropsButton} />
    <Route path="/PropsButton" component={ComplexSelector} />
  </div>
```

## ReactRouter路由传递参数

### params

```
<Route path='/user/:name' component={UserPage}></Route>
this.props.history.push("/user/sam");
```
```
 this.props.params.name
```

### query

query方式可以传递任意类型的值，但是页面的URL也是由query的值拼接的，URL很长且是明文传输。

优点：刷新页面不会掉参数
缺点：不安全，没有加密

```
// 跳转
 this.props.history.push({
        pathname: '/user',
        query: data,
    });
// 取值
this.props.location.query
```

### state

state方式类似于post，依然可以传递任意类型的数据，而且可以不以明文方式传输。
```
this.props.history.push({
        pathname: '/user',
        state: data,
    })
```

## 解决页面返回陷入循环 replace

我们可以用this.props.history.replace来解决或者是router.replace

它不会向 history 添加新记录，而是跟它的方法名一样 —— 替换掉当前的 history 记录。

场景：比如用户从首页->上传图片页面->图片编辑页面->完成编辑跳到上传图片页面
如果这是我们手机用自带的返回是回不去主页的，又会跳到编辑页面
这里history会增加三条记录，如果觉得图片不行反复编辑的话就会产生更多的记录，更回不去
所以我们把：上传图片页面->图片编辑页面->完成编辑跳到上传图片页面 这两步的跳转都改为replace，就相当于上传界面和编辑界面公用一条记录一样，调用原生返回直接能返回首页