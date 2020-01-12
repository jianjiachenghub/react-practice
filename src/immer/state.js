import React, { PureComponent } from "react";
import { produce } from "immer";

export default class ImmerState extends PureComponent {
  constructor(props) {
    super();
    this.state = {
      members: [
        {
          name: "jianjiacheng",
          age: 30
        }
      ]
    };
  }

    // 常规写法
    addAge0 = ()=>{
      let { members} = this.state;
      members[0].age++
      // 这样写不会刷新 因为只做浅比较 因为从state里解构的members的值又去和state的members自身比较，肯定是同一个引用 所以不会刷新
        this.setState({
          members: members
        },()=>{
            console.log(this.state)
        })
    }

  // 常规写法 后面必须重新写个数组去替换 不然引用是一样的不会触发刷新
  addAge = ()=>{
    const { members:[{age},...x] } = this.state;
    // 可以发现当state层级高一点一点的时候，我们就很难去修改
      this.setState({
        members: [
            {
              name: "jianjiacheng",
              age: age+1
            }
          ]
      })
  }
  
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
  
  // 基于回调写法 用produce高阶函数接受一个函数，返回一个函数来成为setState的回调函数 拿到state转为draftState修改即可
  addAge2 = ()=>{
    this.setState(produce(draftState => {
      draftState.members[0].age++;
    }))
  }

  render() {
    let { members } = this.state;
    let x = produce(draftState => {
      draftState.members[0].age++;
    })(this.state)
    // TODO:为什么不能修改没有修改的部分
    // x.x = "123" 报错 why
    return (
    <div>{members[0].age}岁<button onClick={this.addAge0}>增加年龄</button></div>
    );
  }
}
