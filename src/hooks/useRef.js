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
