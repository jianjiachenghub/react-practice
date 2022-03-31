## ErrorBoundary 介绍
从 React 16 开始，引入了 Error Boundaries 概念，它可以捕获它的子组件中产生的错误，记录错误日志，并展示降级内容，具体 官网地址。

ErrorBoundary 只能捕获子组件的 render 错误，有一定的局限性，以下是无法处理的情况：

- 事件处理函数（比如 onClick,onMouseEnter)
- 异步代码（如 requestAnimationFrame，setTimeout,promise)
- 服务端渲染
- ErrorBoundary 组件本身的错误。

## 创建一个 ErrorBoundary 组件

避免错误渲染白屏做异常中间处理的嵌套组件
```
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

```

## 错误边界的范围

如果ErrorBoundary里有多个组件，其中一个渲染出错，那其它也会出错，说以需要确定划分的界限