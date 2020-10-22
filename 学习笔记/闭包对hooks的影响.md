
## useEffect() 定时器的闭包

### 组件实例
看看控制台，每 2 秒打印 Count is: 0。


```
function WatchCount() {
  const [count, setCount] = useState(0);

  useEffect(function() {
    setInterval(function log() {
      console.log(`Count is: ${count}`);
    }, 2000);
  }, []);

  return (
    <div>
      {count}
      <button onClick={() => setCount(count + 1) }>
        加1
      </button>
    </div>
  );
}

```

### 原因分析

在第一次渲染时，log() 中setInterval闭包捕获 count 变量的值 0。过后，即使 count 增加，组件不断更新，但etInterval函数闭包访问的依然是最初保存到作用域链里的初代count，也就是说log()中使用的仍然是初始化的值 0。

**log() 中的闭包是一个过时的闭包**。

### 解决方案
解决方案是让 useEffect()知道 log() 中的闭包依赖于 count.
适当地设置依赖项后，**一旦 count 更改，useEffect() 就更新闭包。**

```
function WatchCount() {
  const [count, setCount] = useState(0);

  useEffect(function() {
    const id = setInterval(function log() {
      console.log(`Count is: ${count}`);
    }, 2000);
    return function() {
      clearInterval(id);
    }
  }, [count]); // 看这里，这行是重点

  return (
    <div>
      {count}
      <button onClick={() => setCount(count + 1) }>
        Increase
      </button>
    </div>
  );
}
```

## useEffect 事件监听的闭包
> 参考 https://zhuanlan.zhihu.com/p/84697185 https://zhuanlan.zhihu.com/p/98554943

### 组件实例
如果点击那个+按钮，下面的数字 0 当然会增长，比如我们现在让 count 增长为 1，这时候你去改变浏览器窗口的大小

```js
function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // 让resize事件触发handleResize
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleResize = () => {
    // 把count输出
    console.log(`count is ${count}`);
  };

  return (
    <div className="App">
      <button onClick={() => setCount(count + 1)}>+</button>
      <h1>{count}</h1>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

你可能预期这样输出：

```
count is 1

```

事实上，输出是这样：

```
count is 0
```
### 原因分析

App组件第一次被渲染的时候useEffect百分之百会调用第一个函数参数，这时候count变量是0，但是，当我们点+按钮让Counter增长为1，这时候App被重新渲染，但是因为useEffect第一个参数总是一个空数组，所以不会重新做addEventListener的工作。

handleResize函数利用闭包(clousre)功能访问App中的count变量，那也应该是使用更新为1的count啊？

让你失望了，虽然闭包的确可以访问外围的变量，但是，此handleResize非彼handleResize，第一次渲染时的handleResize和第二次渲染时的handleResize，虽然源自同一段代码，但是在运行时却是两个不同的函数对象。这并不难理解，handleResize是一个局部变量，每次App被执行时，handleResize都会被重行赋值，所以每一次App被渲染时，都会给handleResize一个全新的函数对象。

**所以如果Effects执行一次不去依赖count更新的话，永远绑定的是第一次渲染的时候创造的handleResize1，handleResize1闭包访问的值永远是第一次的count也就是0**

### 结合上下文分析原因

不依赖 count 导致 resize 时 count 还是旧值的本质原因：Function Component + Hooks 组件每一次渲染执行使用的都是当下的上下文（props/state），useEffect 只在组件挂载时执行过一次，**导致 handleResize 的上下文一直是组件挂载时的状态（count 为 0）**


### 解决办法

这样每次count被点击的时候更新都会导致useEffect重新执行，这样就重新绑定了新的handleResize23456等，这些新的handleResize里闭包访问的值随着组件更新而更新
```
  useEffect(() => {
     // 让resize事件触发handleResize
     window.addEventListener('resize', handleResize)
     return window.removeEventListener('resize', handleResize)
  }, [count])             //看这一行！！！ useEffect有第二个数组参数！！！
```

### 更好的解决办法

上面的解决办法中每次count的更新useEffect会重新执行，如果内部有大量运算的话会导致资源的浪费，并且每次都涉及事件的绑定与解绑。

所以还有一种更好的useCallback 或 useRef 来解决。

#### useCallback

useCallback包裹之前的handleResize，并且监听count改变来更新。

handleResize变量现在是一个引用了，useEffect里监听handleResize的改变。

所以当onClick触发去setCount时，触发handleResize更新，然后触发useEffect更新，拿到最新的handleResize执行。

所以我们看很多那种事件监听且涉及DOM的操作都会用useCallback来抽取出部分依赖来监听。

```js
function App() {
  const [count, setCount] = useState(0);
  const latestCount = useRef();
  latestCount.current = count;

  const handleResize = useCallback(() => {
    console.log(`count is ${count} xxx`);
  }, [count]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  return (
    <div className="App">
      <button onClick={() => setCount(count + 1)}>+</button>
      <h1>{count}</h1>
    </div>
  );
}
```

#### useRef 官方比较推荐的做法

虽然useEffect的handleResize一直指向第一次渲染创建的handleResize，但内部访问的latestCount是一个对象，对象的current每次都被更新成了最新的count。

还有就是官方推荐回调写在useEffect内部，这样容易发现依赖了哪些状态变量，同时eslint hooks也可以很好的检测到。
```js
function App() {
  const [count, setCount] = useState(0);
  const latestCount = useRef();
  latestCount.current = count;

  // 写到外面也能拿到最新的值但不推荐
  /*function handleResize() {
    // 把count输出
    console.log(`count is ${latestCount.current} xxx`);
  }*/

  useEffect(() => {

    // 让resize事件触发handleResize
    function handleResize() {
      // 把count输出
      console.log(`count is ${latestCount.current} xxx`);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="App">
      <button onClick={() => setCount(count + 1)}>+</button>
      <h1>{count}</h1>
    </div>
  );
}
```

### useState 不过时的闭包

state 创建一个按钮，点击后让计数器自增，但是延时 3 秒后再打印出来。

- useState 产生的数据也是 Immutable 的，通过数组第二个参数 Set 一个新值后，原来的值会形成一个新的引用在下次渲染时。
- 但由于对 state 的读取没有通过 this. 的方式，使得 **每次 setTimeout 都读取了当时渲染闭包环境的数据**，虽然最新的值跟着最新的渲染变了，但旧的渲染里，状态依然是旧值。

因为每次点击执行 log 都往 setTimeout 锁了一次最新的 count 闭包的值。所有打印 012

```
function Counter() {
  const [count, setCount] = useState(0);

  const log = () => {
    setCount(count + 1);
    setTimeout(() => {
      console.log(count);
    }, 3000);
  };

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={log}>Click me</button>
    </div>
  );
}

```

在三秒内连续点击三次，那么 count 的值最终会变成 3，而随之而来的输出结果

```
0
1
2

```

### useState() 过时闭包

- 点击按键 “Increase async” 在异步模式下以 1 秒的延迟递增计数器
- 在同步模式下，点击按键 “Increase sync” 会立即增加计数器。

```
function DelayedCount() {
  const [count, setCount] = useState(0);
  function handleClickAsync() {
   setTimeout(function delay() {
       setCount(count + 1);
     }, 1000);
  }

  function handleClickSync() {
    setCount(count + 1);
  }

  return (
    <div>
      {count}
      <button onClick={handleClickAsync}>Increase async</button>
      <button onClick={handleClickSync}>Increase sync</button>
    </div>
    );
  }
```

点击 “Increase async” 按键然后立即点击 “Increase sync” 按钮，count 只更新到 1。

这是因为 delay() 是一个过时的闭包。delay() 是一个过时的闭包，它使用在初始渲染期间捕获的过时的 count 变量。

- 初始渲染：count 值为 0。
- 点击 'Increase async' 按钮。delay() 闭包捕获 count 的值 0。setTimeout() 1 秒后调用 delay()。
- 点击 “Increase async” 按键。handleClickSync() 调用 setCount(0 + 1) 将 count 的值设置为 1，组件重新渲染。
- 1 秒之后，setTimeout() 执行 delay() 函数。但是 delay() 中闭包保存 count 的值是初始渲染的值 0，所以调用 setState(0 + 1)，结果 count 保持为 1。

为了解决这个问题，可以使用函数方法来更新 count 状态：

```
function DelayedCount() {
  const [count, setCount] = useState(0);

  function handleClickAsync() {
    setTimeout(function delay() {
      setCount(count => count + 1); // 这行是重点
    }, 1000);
  }

  function handleClickSync() {
    setCount(count + 1);
  }

  return (
    <div>
      {count}
      <button onClick={handleClickAsync}>Increase async</button>
      <button onClick={handleClickSync}>Increase sync</button>
    </div>
  );
}

```

### 总结

当闭包捕获过时的变量时，就会出现过时闭包的问题。解决过时闭包的一个有效方法是正确设置 React Hook 的依赖项。或者，对于过时的状态，使用函数方式更新状态。

尤其是再通过useEffect来创建副作用，或者是封装自定义hooks的时候，如果还设涉及事件监听什么的，很容易走入闭包的陷阱。 **所以一定要分析清楚useEffect副作用内依赖那些state状态，然后把这些状态作为触发useEffect的更新的依赖项**，不然极有可能因为闭包拿到过去的状态


官方文档有明确说尽量不要调用在hook外申明的函数，尽量把相应的函数申明在hook的函数体内。如果不得不调用在hook外的函数，一定要确保该函数没有依赖外部参数，如果有依赖外部参数，就要将该依赖注入到hook内

## 参考

- https://segmentfault.com/a/1190000020805789?utm_source=tag-newest
