## memo

React 为函数组件提供了一个 memo 方法，它和 PureComponent 在数据比对上唯一的区别就在于 只进行了 props 的浅比较，因为函数组件是没有 state 的。

```
function Home () {
    //xxx
} 
export default React.memo (Home);
```

## fragment 

当你不需要在 fragment 标签中添加任何 prop 且你的工具支持的时候，你可以使用 短语法：

```
function ListItem({ item }) {
  return (
    <>
      <dt>{item.term}</dt>
      <dd>{item.description}</dd>
    </>
  );
}

```

## 动态加载

不需要马上加载的组件的包单独分割出来不用马上加载  

实现原理：在代码中所有被import()的模块，都将打成一个单独的包，放在chunk存储的目录下。在浏览器运行到这一行代码时，就会自动请求这个资源，实现异步加载。 
  
通俗点讲就是我需要显示加载这个组件的时候才去下载这个组件的依赖包，这样可以有效提高首屏加载的速度


### React-loadable

#### 懒加载

结合动态载入import()返回一个Promise，我们可以根据状态来显示Loading，Loadable这个库已经封装好了
```
import Loadable from 'react-loadable';
import Loading from './my-loading-component';
const LoadableComponent = Loadable({
  loader: () => import('./my-component'),
  loading: Loading,
});
export default class App extends React.Component {
  render() {
    return <LoadableComponent/>;
  }
}

```

#### 预加载
react-loadable 还提供了 preload 功能

假如有统计数据显示，用户在进入首页之后大概率会进入 About 页面，那我们就在首页加载完成的时候去加载 about.js，这样等用户跳到 About 页面的时候，js 资源都已经加载好了，用户体验会更好。

```
componentDidMount() {
  LoadableAbout.preload();
}
```

#### 代码分割注意公共代码


假设：

- 有pageA和pageB两个页面
- 这两个页面都是动态加载
- 这两个页面都引用了utils.js


```

const LoadablePageA = Loadable({
  loader: () => import(/* webpackChunkName: "pageA" */ '@/pageA'),
  loading() {
    return <div>Loading...</div>;
  }
});

const LoadablePageB = Loadable({
  loader: () => import(/* webpackChunkName: "pageA" */ '@/pageB'),
  loading() {
    return <div>Loading...</div>;
  }
});

```

`/* webpackChunkName: "pageA" */ `指明分割出去的名称为pageA
@做了解析，直接到src下去
好的现在有个问题， 你打包就会发现pageA.js 和pageB.js 里面都打包了 utils.js，重复了
所有在webpack配置的时候需要先将公共代码提出去

```
module: {...},
optimization: {
  splitChunks: {
    cacheGroups: {
      venders: {
        test: /node_modules/,
        name: 'vendors',
        chunks: 'all'
      },
      default: {
        minSize: 0,
        minChunks: 2,// 只要引用两次或者以上的代码就提出去
         reuseExistingChunk: true,// 是否复用其他chunk内已拥有的模块 当chunks引用了已经存在的被抽离的chunks时不会新创建一个chunk而是复用chunk
        name: 'utils'
      }
    }
  }
},
plugins: ...

```

reuseExistingChunk详细解释
```
 cacheGroups: {
      Chunk 1 : {
        test: / A, B, C三个模块/,
        name: 'Chunk 1',
      },
      Chunk 2: {
        test: / B, C/,
        name: 'Chunk 2'
      }
    }
```



- Chunk 1 (named one): modules A, B, C
- Chunk 2 (named two): modules B, C

第一种配置：
```
{
  minChunks: 2,
  reuseExistingChunk: false // default
}
```

它将创建一个包含公共模块B和C的新块：

- Chunk 1 (named one): modules A
- Chunk 2 (named two): no modules (removed by optimization)
- Chunk 3 (named one~two): modules B, C



第二种配置：
```
{
  minChunks: 2,
  reuseExistingChunk: true
}
```

它将重用现有块2，因为它匹配由cacheGroup选择的模块

Chunk 1 (named one): modules A
Chunk 2 (named two): modules B, C

结论：结果名称有区别。如果你没有名字，也没有区别。

### React.lazy

```

const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <OtherComponent />
      </Suspense>
    </div>
  );
}

```

fallback 属性接受任何在组件加载过程中你想展示的 React 元素。你可以将 Suspense 组件置于懒加载组件之上的任何位置。你甚至可以用一个 Suspense 组件包裹多个懒加载组件。

```
const OtherComponent = React.lazy(() => import('./OtherComponent'));
const AnotherComponent = React.lazy(() => import('./AnotherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <section>
          <OtherComponent />
          <AnotherComponent />
        </section>
      </Suspense>
    </div>
  );
}

``` 

### 基于路由的代码分割

```
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';

const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));

const App = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/about" component={About}/>
      </Switch>
    </Suspense>
  </Router>
);
```

### 部分插件

- react-loadable 动态加载
- react-lazyload 懒加载
- react-placeholder 骨架