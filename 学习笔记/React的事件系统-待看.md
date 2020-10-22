## 事件系统
> 解析：https://juejin.im/post/6844903704261312520

React 有自身的一套事件系统，叫作 SyntheticEvent。叫什么不重要，实现上，其实就是通过在 document 上注册事件代理了组件树中所有的事件（facebook/react#4335），并且它监听的是 document 冒泡阶段。

当你在页面上点击按钮，事件开始在原生 DOM 上走捕获冒泡流程。React 监听的是 document 上的冒泡阶段。事件冒泡到 document 后，React 将事件再派发到组件树中，然后事件开始在组件树 DOM 中走捕获冒泡流程。

JSX上面的事件全部绑定在 document 上，不仅减少了内存消耗，而且组件销毁的时候可以统一移除事件

## 为什么需要事件系统

- 首先对于性能来说，React作为一套View层面的框架，通过渲染得到vDOM，再由diff算法决定DOM树那些结点需要新增、替换或修改，假如直接在DOM结点插入原生事件监听，则会导致频繁的调用addEventListener和removeEventListener，造成性能的浪费。
- 其次React合成的SyntheticEvent采用了池的思想，从而达到节约内存，避免频繁的创建和销毁事件对象的目的。这也是如果我们需要异步使用一个syntheticEvent，需要执行event.persist()才能防止事件对象被释放的原因。
- 最后在React源码中随处可见batch做批量更新，基本上凡是可以批量处理的事情（最普遍的setState）React都会将中间过程保存起来，留到最后面才flush掉。
- 使得不同平台只需要通过加入EventEmitter以及对应的Renderer就能使用相同的一个事件系统
- 而对于不同的浏览器而言，React帮我们统一了事件，做了浏览器的兼容

## dispatchEvent 进行事件分发

进入统一的事件分发函数 (dispatchEvent)。
当我点击child div 的时候，这个时候浏览器会捕获到这个事件，然后经过冒泡，事件被冒泡到 document 上，交给统一事件处理函数 dispatchEvent 进行处理。（上一文中我们已经说过 document 上已经注册了一个统一的事件处理函数 dispatchEvent）。


## 处理事件冒泡的问题

 React 组件中 button 的事件处理器中调用 event.stopPropagation() 没有阻止 document 的点击事件执行的问题了。因为 button 事件处理器的执行前提是事件达到 document 被 React 接收到，然后 React 将事件派发到 button 组件。既然在按钮的事件处理器执行之前，事件已经达到 document 了，那当然就无法在按钮的事件处理器进行阻止了。

 ```
 function App() {
  useEffect(() => {
    document.addEventListener("click", documentClickHandler);
    return () => {
      document.removeEventListener("click", documentClickHandler);
    };
  }, []);

  function documentClickHandler() {
    console.log("document clicked");
  }

  function btnClickHandler(event) {
    event.stopPropagation();
    console.log("btn clicked");
  }

  return <button onClick={btnClickHandler}>CLICK ME</button>;
}
 ```
输出`btn clicked -> document clicked`
并没有因为我们在按钮里面调用 event.stopPropagation() 而阻止。


## 探索事件的触发机制

```
import React, { useEffect } from "react";
import ReactDOM from "react-dom";

window.addEventListener("click", event => {
  console.log("window");
});

document.addEventListener("click", event => {
  console.log("document:bedore react mount");
});

document.body.addEventListener("click", event => {
  console.log("body");
});

function App() {
  function documentHandler() {
    console.log("document within react");
  }

  useEffect(() => {
    document.addEventListener("click", documentHandler);
    return () => {
      document.removeEventListener("click", documentHandler);
    };
  }, []);

  return (
    <div
      onClick={() => {
        console.log("raect:container");
      }}
    >
      <button
        onClick={event => {
          console.log("react:button");
        }}
      >
        CLICK ME
      </button>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));

document.addEventListener("click", event => {
  console.log("document:after react mount");
});
```
- 先冒泡到document，于是会触发body上的事件 
- 到了document后，触发document上的事件 ->document:bedore react mount
- React 将事件再派发到组件树中，然后事件开始在组件树 DOM 中走捕获冒泡流程。 ->react:button->raect:container
- 同一元素上如果对同一类型的事件绑定了多个处理器，会按照绑定的顺序来执行。最后 ReactDOM.render 之后的那个处理器执行，->document:after react mount。
- 事件完成了在 document 上的冒泡，往上到了 window，执行相应的处理器并输出 window。
```
body // 先冒泡到document，于是会触发body上的事件 
document:bedore react mount // 到了document后，触发document上的事件
react:button // React 将事件再派发到组件树中，然后事件开始在组件树 DOM 中走捕获冒泡流程。 
raect:container
document:after react mount //同一元素上如果对同一类型的事件绑定了多个处理器，会按照绑定的顺序来执行。最后绑定最后执行
document within react // useEffect居然比ReactDOM.render后面的语句执行的还要迟
window //事件完成了在 document 上的冒泡，往上到了 window，执行相应的处理器并输出 window。
```
如果在body上阻止冒泡，那只会打出body
```
document.body.addEventListener("click", event => {
+  event.stopPropagation();
  console.log("body");
});
// body 按钮及按钮容器上的事件处理器不会执行
```
## 分析了后阻止冒泡分为三种情况

### 阻止合成事件冒泡 stopPropagation

```
 handleClick(e){
        // 阻止合成事件间的冒泡
        e.stopPropagation();
        this.setState({count:++this.state.count});
    }
```

### 阻止原生事件 stopImmediatePropagation

组件中事件处理器接收到的 event 事件对象是 React 包装后的 SyntheticEvent 事件对象。但可通过它的 nativeEvent 属性获取到原生的 DOM 事件对象。通过调用这个原生的事件对象上的 stopImmediatePropagation() 方法可达到阻止冒泡的目的。
```
function btnClickHandler(event) {
+  event.nativeEvent.stopImmediatePropagation();
  console.log("btn clicked");
}
```
React 在 render 时监听了 document 冒泡阶段的事件，当我们的 App 组件执行时，准确地说是渲染完成后（useEffect 渲染完成后执行），又在 document 上注册了 click 的监听。此时 document 上有两个事件处理器了，并且组件中的这个顺序在 React 后面。

当调用 event.nativeEvent.stopImmediatePropagation() 后，阻止了 document 上同类型后续事件处理器的执行，达到了想要的效果。

但这种方式有个缺点很明显，那就是要求需要被阻止的事件是在 React render 之后绑定，如果在之前绑定，是达不到效果的。


### 阻止合成事件与除最外层document上的原生事件上的冒泡 判断e.target

```
componentDidMount() {
    document.body.addEventListener('click',e=>{
    // 通过e.target判断阻止冒泡
        if(e.target&&e.target.matches('a')){
            return;
        }   
        console.log('body');
    })
}
```