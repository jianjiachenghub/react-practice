## cloneElement()

以 element 元素为样板克隆并返回新的 React 元素。返回元素的 props 是将新的 props 与原始元素的 props 浅层合并后的结果。新的子元素将取代现有的子元素，而来自原始元素的 key 和 ref 将被保留。

```
React.cloneElement(
  element,
  [props],
  [...children]
)
```

React.cloneElement() 几乎等同于：

```
<element.type {...element.props} {...props}>{children}</element.type>
```

## createElement()

创建并返回指定类型的新 React 元素。其中的类型参数既可以是标签名字符串（如 'div' 或 'span'），也可以是 React 组件 类型 （class 组件或函数组件），或是 React fragment 类型。

使用 JSX 编写的代码将会被转换成使用 React.createElement() 的形式。

```
React.createElement(
  type,
  [props],
  [...children]
)
```