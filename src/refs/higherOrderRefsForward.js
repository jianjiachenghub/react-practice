import React, { PureComponent } from 'react'


/**
 * 错误示范
 * refs 将不会透传下去。这是因为 ref 不是 prop 属性。
 * 就像 key 一样，其被 React 进行了特殊处理
 */

function logPropsError(WrappedComponent) {
    class LogProps extends React.Component {
      componentDidUpdate(prevProps) {
        console.log('old props:', prevProps);
        console.log('new props:', this.props);
      }
  
      render() {
        return <WrappedComponent {...this.props} />;
      }
    }
  
    return LogProps;
  }

function logProps(Component) {
    class LogProps extends React.Component {
      componentDidUpdate(prevProps) {
        console.log('old props:', prevProps);
        console.log('new props:', this.props);
      }
  
      render() {
        const {forwardedRef, ...rest} = this.props;
  
        // 将自定义的 prop 属性 “forwardedRef” 定义为 ref
        return <Component ref={forwardedRef} {...rest} />;
      }
    }
  
    // 注意 React.forwardRef 回调的第二个参数 “ref”。
    // 我们可以将其作为常规 prop 属性传递给 LogProps，例如 “forwardedRef”
    // 然后它就可以被挂载到被 LogProps 包裹的子组件上。
    return React.forwardRef((props, ref) => {
      return <LogProps {...props} forwardedRef={ref} />;
    });
  }


  class FancyButton extends React.Component {
    focus() {
      console.log("focus");
    }
    alert(){
        alert('FancyButton')
    }
    render(){
        return(
            <div onClick={this.props.handleClick}>点击通过父组件调用组件的方法</div>
        )
    }
  

  }

  export default logProps(FancyButton)