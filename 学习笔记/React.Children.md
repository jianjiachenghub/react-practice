## props.children


我们在需要实现一个包裹组件的时候，比如Card，里面会放内容

### 没有this.props.children我们可能需要这么写
```
class Card extends Component {
  render () {
    return (
      <div className='card'>
        <div className='card-content'>
          {this.props.content}
        </div>
      </div>
    )
  }
}
```
使用Card的时候

```
 <Card content={
    <div>
      <h2>React.js 小书</h2>
       <div>开源、免费、专业、简单</div>
      订阅：<input />
    </div>
  } />
```

### 使用props.children

```
class Card extends Component {
  render () {
    return (
      <div className='card'>
        <div className='card-content'>
          {this.props.children}
        </div>
      </div>
    )
  }
}
```
使用的时候：

```
<Card>
    <h2>React.js 小书</h2>
    <div>开源、免费、专业、简单</div>
    订阅：<input />
  </Card>
```

## React.Children

props.children对于我们开发者来说就是一个黑盒，我们对它可能传入的数据结构是不可知的（表达式、布尔、render function等等），如果我们没有对其进行操作，那其实没什么所谓。但只要我们对其进行操作了，比如下意识以为是个数组进行props.children.map这样的调用就要注意，非Array就直接报TypeError了。那怎么处理类似这样的情景呢？

其实React.Children恰好就是为我们提供处理props.children数据结构能力的API。

### 子组件类型不确定

看过React官方文档，你会看到说"子组件是一种不透明的数据结构"(opaque data structure)。意思就是props.children可以是任何类型，比如array, function, object等等。因为什么都可以传，所以你也不能确定传过来了什么东西。 （好像最后反的是类似数组但是不是数组的数据结构）

比如这下来了一个函数，如果我们明确知道这是一个函数的还好，直接调用它
```
<Executioner>
  {(arg) => <h1>Hello World!</h1>}
</Executioner>

class Executioner extends React.Component {
  render() {
    // See how we're calling the child as a function?
    //                        ↓
    return this.props.children(arg)   //因为children是函数,所以这里肯定也可以传参
  }
}

```

但我们直接对他进行一些其他的操作可能就会导致报错，React.Children会避免参生这种错误
```
class Executioner extends React.Component {
  render() {
    const children = this.props.children
    return (
      <div>
      // 比如像去掉第一个孩子
     // 这里我们用了this.props.children.map，并且忽略到第一个元素，但是如果这里传进来的是上面
            例子是上图中的函数，这里就会报错，因为map，使用React.Children.map则不会报错
        {this.props.children.map((child, i) => {
          if (i < 1) return
          return child
        })}   
        // 这里我们用了React.Children.map,这是React提供的一些帮助函数，就不会报错
        {React.Children.map(children, (child, i) => {
          if (i < 1) return
          return child
        })}
      
      </div>
    )
  }
}
```

### 官方提供了很多API

- React.Children.map：children 里的每个直接子节点上调用一个函数，并将 this 设置为 thisArg。如果 children 是一个数组，它将被遍历并为数组中的每个子节点调用该函数。如果子节点为 null 或是 undefined，则此方法将返回 null 或是 undefined，而不会返回数组。
- React.Children.forEach：与 React.Children.map() 类似，但它不会返回一个数组。
- React.Children.count：返回 children 中的组件总数量，等同于通过 map 或 forEach 调用回调函数的次数。
- React.Children.only：验证 children 是否只有一个子节点（一个 React 元素），如果有则返回它，否则此方法会抛出错误。
- React.Children.toArray：React.Children.toArray：将 children 这个复杂的数据结构以数组的方式扁平展开并返回，并为每个子节点分配一个 key。当你想要在渲染函数中操作子节点的集合时，它会非常实用，特别是当你想要在向下传递 this.props.children 之前对内容重新排序或获取子集时

## 参考文章

- https://zh-hans.reactjs.org/docs/react-api.html#reactchildren