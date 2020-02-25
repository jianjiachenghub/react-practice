
## 页面逻辑

点击div的button修改state刷新页面

```
<div>{members[0].age}岁<button onClick={this.addAge0}>增加年龄</button></div>
```

state的members是一个数组

```
this.state = {
      members: [
        {
          name: "jianjiacheng",
          age: 30
        }
      ]
    };
```

## 修改state的函数

setState这部分的内容会通过浅比较被合并到state中去。注意是浅比较

### 无效写法

 这样写不会刷新， 因为从state里解构的members的值又去和state的members自身比较，本质上是同一个引用
 浅比较的结果是setState中的members的值与state中相等，不会触发更新

```
addAge0 = ()=>{
      let { members} = this.state;
      members[0].age++
        this.setState({
          members: members
        },()=>{
            console.log(this.state)
        })
    }
```

### 有效写法(但很复杂)

```
// 回调写法
  addAge1 = ()=>{
    this.setState(state => {
      const { members } = state;
      return {
        members: [
          {
            ...members[0],
            age: members[0].age + 1,
          },
          ...members.slice(1)
        ]
      }
    })
  }
```

### immer写法

### 生产者 producer

这里produce对象直接只传一个函数(recipe)，不要第一个对象，就会返回一个producer
producer接受一个对象产生nextState

```
let producer = produce((draftState) => {
  draftState.x = 2
});
let nextState = producer(currentState);
```
### setState 回调写法

- produce对象直接只传一个函数(recipe)，不要第一个对象，就会返回一个producer 
- producer是接受一个对象生产nextState的函数，在这里作为setState的回调，
- 回调的参数就是相当于作为setState的回调取到的当前state
- 然后生成的新的的State


```
  addAge2 = ()=>{
    this.setState(produce(draftState => {
      draftState.members[0].age++;
    }))
  }
```
修改draftState就可以返回一个新的nextState，然后setState执行nextState和this.state的浅比较肯定就不一样了