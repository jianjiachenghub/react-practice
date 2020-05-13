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

## 使用useMemo缓存大量的计算

```
// 避免这样做
function Component(props) {
  const someProp = heavyCalculation(props.item);
  return <AnotherComponent someProp={someProp} /> 
}
  
// 只有 `props.item` 改变时someProp的值才会被重新计算
function Component(props) {
  const someProp = useMemo(() => heavyCalculation(props.item), [props.item]);
  return <AnotherComponent someProp={someProp} /> 
}

```

## 小图标以base64打包嵌入页面

```
 module: {
    // 编译器
    //noPars:/jquery/,// 比如我引入了jquery 它不依赖其他的包，就不需要解析 直接打包
    rules: [
      {
        test: /\.(jpg|png|gif)$/, //图片
        use: {
          loader: "url-loader",
          options: {
            name: "[name].[ext]",
            outputPath: "images/",
            limit: 8192 // 大于8Kb走file-loader（好像是自动的不用添加fallback），小的ICON什么的直接打包插入到bundle.js中减少Http请求
            /*             fallback: {
              loader: 'file-loader',
              options: {
                  name: 'img/[name].[hash:8].[ext]'
              } */
          }
        }
      },
  }
```

## 按需加载

使用 babel-plugin-import 来进行组件的
原理 [git项目地址](https://github.com/ant-design/babel-plugin-import)
在babel转码的时候，把整个库‘antd’的引用，变为'antd/lib/button'具体模块的引用。这样webpack收集依赖module就不是整个antd，而是里面的button.

```
import { Button } from 'antd';
ReactDOM.render(<Button>xxxx</Button>);

      ↓ ↓ ↓ ↓ ↓ ↓
      
var _button = require('antd/lib/button');
ReactDOM.render(<_button>xxxx</_button>);

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

1.什么是预加载
资源预加载是另一个性能优化技术，我们可以使用该技术来预先告知浏览器某些资源可能在将来会被使用到。预加载简单来说就是将所有所需的资源提前请求加载到本地，这样后面在需要用到时就直接从缓存取资源。

2.为什么要用预加载
在网页全部加载之前，对一些主要内容进行加载，以提供给用户更好的体验，减少等待的时间。否则，如果一个页面的内容过于庞大，没有使用预加载技术的页面就会长时间的展现为一片空白，直到所有内容加载完毕。


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

### React.lazy 延迟加载不是立即需要的组件
>相当于惰性加载组件或者说懒加载组件

动态导入主要应用场景是延迟加载方法，对于组件来说，并不是很适用，但是React.lazy对于组件的加载则是有比较大的帮助。
注意：目前明确指出，React.lazy和suspense并不适用于服务端渲染
既然是延迟加载，就会有一个加载过程，之前在渲染的时候，基本我们自都是顶一个一个`<Loading>`组件，然后通过变量控制进行操作，如果加载完成，取消掉则`<Loading>`组件。
```

const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <div>
      {this.state.show && 
      (<Suspense fallback={<div>Loading...</div>}>
        <OtherComponent />
      </Suspense>)
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

### 使用不可变数据优化state

### 避免无用的多层嵌套

### 避免滥用context

### 部分插件

- react-loadable 动态加载
- react-lazyload 懒加载
- react-placeholder 骨架