## 事件为什么绑定This

React事件一般是合成事件，比如onClick

onClick在组件上只是一个变量而已，它用于指向我们绑定的方法，相当于是一个中转变量。

真正执行我们绑定方法的地方是在合成事件里的invokeGuardedCallback方法

```
function invokeGuardedCallback(name, func, a) {
  try {
    func(a);
  } catch (x) {
    if (caughtError === null) {
      caughtError = x;
    }
  }
}

```

func就是我们绑定的方法，可以看到是直接执行的，那么根据函数调用模式，func内部的this是指向undefined的(严格模式，非严格模式的话指向window)

而我们希望在绑定的函数里通过this拿到我们类组件里的属性，所以必须绑定this