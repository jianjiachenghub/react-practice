## setState

setState在合成事件里本来是就有一个批量更新的逻辑，最后所有setSate最后计算的最终状态如何合并到state里？做不做浅比较？

### 合并到state

Object.assign的作用：

主要是将所有可枚举属性的值从一个或多个源对象复制到目标对象，同时返回目标对象。
如果目标对象中的属性具有相同的键，则属性将被源对象中的属性覆盖。
后来的源对象的属性将类似地覆盖早先的属性。

```
Object.assign({}, prevState, partialState);
```

### 如果合并和原来的state相同岂不是浪费

Component组件的state不会进行对比，只要setState就一定会触发渲染。

所以需要pureComponent来做优化，对state和props都做浅比较

```
 if (this._compositeType === CompositeTypes.PureClass) {
      shouldUpdate =
        !shallowEqual(prevProps, nextProps) ||
        !shallowEqual(inst.state, nextState);
 }
```
虽然可以避免没有改变的元素发生不必要的重新渲染，但是使用上面的这种浅比较还是会带来一些问题,比如深层级的改变了，却不会渲染。此时可以通过不可变数据来实现。