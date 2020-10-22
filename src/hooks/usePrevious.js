import React, { useRef,useState,useEffect} from 'react';
export  function usePrevious (props) {
    const [count, setCount] = useState(0);
    //let it // 如果直接用it ， setCount 后重新渲染 ，it就改变了 ，我们再去clearInterval(it)是新的it 旧的一直在执行
    // 这里尝试了一下 useMemo 来记忆it 但是好像不行
    const it = useRef(null)
    useEffect(() => {
      it.current = setInterval(() => {
        setCount(count => count + 1)
      }, 1000)
    } , [])
  
    useEffect(() => {
        console.log(1)
      if (count >= 5) {
        clearInterval(it.current)
      }
    })
    console.log(2)
  
    return (
      <div>{count}</div>
    )
  }


 export default function Counter() {
    const h1 = useRef(null)
    useEffect(() => {
        console.log('Counter1')
      });
    const [count, setCount] = useState(0);
    const prevCount = usePrevious2(count);
    console.log('prevCount',0)
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

  // usePrevious.js:45 1
  // usePrevious.js:51 3
  // usePrevious.js:34 prevCount 0
  // usePrevious.js:38 {current: null}
  // usePrevious.js:30 Counter1
  // usePrevious.js:48 2
  // usePrevious.js:36 Counter2 {current: h1}
