## immer


ImmutableJS，非常棒的一个不可变数据结构的库，可以解决上面的问题，But，跟 Immer 比起来，ImmutableJS 有两个较大的不足：

- 需要使用者学习它的数据结构操作方式，没有 Immer 提供的使用原生对象的操作方式简单、易用；
- 它的操作结果需要通过toJS方法才能得到原生对象，这使得在操作一个对象的时候，时刻要主要操作的是原生对象还是 ImmutableJS 的返回结果，稍不注意，就会产生意想不到的 bug。

### immer概念说明

- currentState
被操作对象的最初状态

- draftState
根据 currentState 生成的草稿状态，它是 currentState 的代理，对 draftState 所做的任何修改都将被记录并用于生成 nextState 。在此过程中，currentState 将不受影响

- nextState
根据 draftState 生成的最终状态

- produce 生产
用来生成 nextState 或 producer 的函数

- producer 生产者
通过 produce 生成，用来生产 nextState ，每次执行相同的操作

- recipe 生产机器
用来操作 draftState 的函数

### 使用方式

#### 不对 draftState 修改 
```
import produce from 'immer'

let currentState = {
  p: {
    x: [2],
  },
}
let nextState = produce(currentState, (draft) => {

})

currentState === nextState; // true

```

#### 对 draftState 修改

```
let currentState = {
  a: [],
  p: {
    x: 1
  }
}

let nextState = produce(currentState, (draft) => {
  draft.a.push(2);
})

currentState.a === nextState.a; // false 通过draft修改的部分即使是引用也不等
currentState.p === nextState.p; // true
```

### 自动冻结功能

Immer 还在内部做了一件很巧妙的事情，那就是通过 produce 生成的 nextState 是被完全冻结（freeze）的。Immer 内部使用Object.freeze方法。这样，当直接修改 nextState 时，将会报错。这使得 nextState 成为了真正的不可变数据。

注意：currentState中，只冻结 currentState  跟 nextState 相比修改的部分
```

let nextState = produce(currentState, (draftState) => {
  draftState.p.y = 3;
})

nextState.p.y = 4; // 此处的修改无效
console.log(nextState.p.y); // 3
```

### 生产者 producer

这里produce对象直接只传一个函数(recipe)，不要第一个对象，就会返回一个producer

producer接受一个对象产生nextState


```
let producer = produce((draftState) => {
  draftState.x = 2
});
let nextState = producer(currentState);
```


### recipe生产机器

#### recipe的返回值

recipe 是否有返回值，nextState 的生成过程不同：
- recipe 没有返回值时：nextState 根据 draftState 生成；
- recipe 有返回值时：nextState 根据 recipe 函数的返回值生成；

```
let nextState = produce(currentState, (draftState) => {
    return {
      x: 5
    }
  }
)
console.log(nextState); // {x: 5}
```

#### recipe中的this

recipe 函数内部的this指向 draftState ，也就是修改this与修改 recipe 的参数 draftState ，效果是一样的。
注意：此处的 recipe 函数不能是箭头函数，如果是箭头函数，this就无法指向 draftState 了

```
produce(currentState, function(draftState){
  // 此处，this 指向 draftState
  draftState === this; // true
})
```