## useSate 与 setState 的差异1

对比情况不同。

- React默认情况下每次setState都会重新渲染，不管引用是否相同。
在PureComponent下浅比较state和props。
- useState则是会默认判断前后set值是否相同，如果是obj则判断引用，相同则不渲染。在React.memo下浅比较props

注意：

使用了PureComponent后，重复setSate相同的值，比如下面这样：
```
 handleClick = () => {
    console.log(`当前组件状态是否是上一次状态：${this.state === lastState}`); // 只要被setState后的都是false，不论值是否改变

    this.setState({ count: 1 }); // 相同的值
    // 更新上一次状态
    lastState = this.state;
  };
```

虽然 PureComponent组件减少了 App 组件的重复渲染，但是 App 组件状态的引用地址却发生了变化，这是因为React的State遵循不可变数据结构，每次都是派生一个新的对象上去合并，最终参数一个新的对象，组件实例的状态由于被赋予了一个全新的状态，所以引用地址发生了变化。。



## useSate 与 setState 的差异2

### state创建一个按钮，点击后让计数器自增，但是延时 3 秒后再打印出来
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
如何每次都打印3？，可以采用useRef

```
function Counter() {
  const count = useRef(0);

  const log = () => {
    count.current++;
    setTimeout(() => {
      console.log(count.current);
    }, 3000);
  };

  return (
    <div>
      <p>You clicked {count.current} times</p>
      <button onClick={log}>Click me</button>
    </div>
  );
}

```

### 使用 Class Component 方式实现一遍呢？


```
class Counter extends Component {
  state = { count: 0 };

  log = () => {
    this.setState({
      count: this.state.count + 1
    });
    setTimeout(() => {
      console.log(this.state.count);
    }, 3000);
  };

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={this.log}>Click me</button>
      </div>
    );
  }
}

```
嗯，结果应该等价吧？3 秒内快速点击三次按钮，这次的结果是：
```
3
3
3

```

### 解释

这是用好 Function Component 必须迈过的第一道坎，请确认完全理解下面这段话：

#### 首先对 Class Component 进行解释：

- 首先 state 是 Immutable 的，setState 后一定会生成一个**全新的 state 引用**。
- 但 Class Component 通过 this.state 方式读取 state，这导致了每次代码执行都会拿到**最新的 state 引用，所以快速点击三次的结果是 3 3 3**

#### 那么对 Function Component 而言：

- useState 产生的数据也是 Immutable 的，通过数组第二个参数 Set 一个新值后，原来的值会形成一个新的引用在下次渲染时。
- 但由于对 state 的读取没有通过 this. 的方式，使得 **每次 setTimeout 都读取了当时渲染闭包环境的数据**，虽然最新的值跟着最新的渲染变了，但旧的渲染里，状态依然是旧值。