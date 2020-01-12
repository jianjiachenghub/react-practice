



import React, { PureComponent } from "react";
import FancyButton from "./higherOrderRefsForward";

const ref = React.createRef();

export default class higherOrderRefsForwardIndex extends PureComponent {
  componentDidMount() {
      console.log(ref.current)
      //ref.current.focus() 如果报错
  }
  handleChangeColor(){
      console.log(ref.current)
      ref.current.alert()
  }
  render() {
    return (
      // 我们导入的 FancyButton 组件是高阶组件（HOC）LogProps。
      // 尽管渲染结果将是一样的，
      // 但我们的 ref 将指向 LogProps 而不是内部的 FancyButton 组件！
      // 这意味着我们不能调用例如 ref.current.focus() 这样的方法
      <FancyButton handleClick={this.handleChangeColor} label="Click Me"  ref={ref} />
    );
  }
}
