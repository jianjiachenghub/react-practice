## usrRef

### 获取DOM节点


这是因为它创建的是一个普通 Javascript 对象。而 useRef() 和自建一个 {current: ...} 对象的唯一区别是，useRef 会在每次渲染时返回同一个 ref 对象。

请记住，当 ref 对象内容发生变化时，useRef 并不会通知你。变更 .current 属性不会引发组件重新渲染。如果想要在 React 绑定或解绑 DOM 节点的 ref 时运行某些代码，则需要使用回调 ref 来实现。

```
import React, { useRef,useState} from 'react';
function DomInput(){
    const inputEl = useRef(null)
    console.log(inputEl) //输出获取到的DOM节点

    const [text, setText] = useState('默认值'); 
    const onInput=()=>{ 
        console.log(inputEl)
        setText(inputEl.current.value)
        console.log(inputEl) //输出获取到的DOM节点
    }
    return (
        <>
            {/*保存input的ref到inputEl */}
            <input ref={inputEl} type="text" onInput = {onInput}/>
            <div  >{text}</div>
        </>
    )
}
export default DomInput

```




### 渲染周期之间共享数据的存储(类似实例变量)

useRef() Hook 不仅可以用于 DOM refs。「ref」 对象是一个 current 属性可变且可以容纳任意值的通用容器，类似于一个 class 的实例属性，可以很方便地保存任何可变值。

这可以用来保存获取上一轮的 props 或 state
```
 export default function Counter() {
    const h1 = useRef(null)
    useEffect(() => {
        console.log('Counter1')
      });
    const [count, setCount] = useState(0);
    const prevCount = usePrevious2(count);
    console.log(prevCount)
    useEffect(() => {
        console.log('Counter2',h1)
      });
 return <h1 ref={h1} onClick={()=>setCount(count+1)}>Now: {count}, before: {prevCount}{console.log(h1)}</h1>;
  }
  
  // 内部useEffect其实就是在Counter挂载完后执行的副作用
  // 所以useEffect在返回后执行 所以prevCount第一次打出来是undefined
  function usePrevious2(value) {
    console.log(1)
    const ref = useRef();
    useEffect(() => {
        console.log(2)
      ref.current = value;
    });
    console.log(3)
    return ref.current;
  }


```

<img src='./img/usePrevious.png'>

### useRef() 与 callback ref

useRef 会在每次渲染时返回同一个 ref , 而自建一个 {current: ...}赋值给ref不是

当 ref 对象内容发生变化时，useRef 并不会通知你。变更 .current 属性不会引发组件重新渲染。如果想要在 React 绑定或解绑 DOM 节点的 ref 时运行某些代码，则需要使用回调 ref 来实现。

要想测量一个 DOM 节点的位置或是尺寸，你可以使用 callback ref。每当 ref 被附加到一个另一个节点，React 就会调用 callback

```
function MeasureExample() {
  const [height, setHeight] = useState(0);

  const measuredRef = useCallback(node => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
    }
  }, []);

  return (
    <>
      <h1 ref={measuredRef}>Hello, world</h1>
      <h2>The above header is {Math.round(height)}px tall</h2>
    </>
  );
}
```

