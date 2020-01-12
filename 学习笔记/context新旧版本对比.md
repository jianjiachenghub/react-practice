## 老版本的context

注意必须要声明Parent.childContextType才会生效，
而子组件如果需要使用context，需要显示得声明Child.contextTypes

```

// old version
class Parent extends Component{
  getChildContext() {
    return {type: 123}
  }
}

Parent.childContextType = {
  type: PropTypes.number
}

const Child = (props, context) => (
  <p>{context.type}</p>
)

Child.contextTypes = {
  type: PropTypes.number
}

```

## 新版本的context

React提供了createContext方法，这个方法会返回两个组件：Provider和Consumber

- Provider用来提供context的内容，通过向Provider传递value这个prop，而在需要用到对应context的地方，用相同来源的Consumer来获取context
- Consumer有特定的用法，就是他的children必须是一个方法，并且context的值使用参数传递给这个方法。


当 Provider 的 value 值发生变化时，它内部的所有消费组件都会重新渲染。Provider 及其内部 consumer 组件都不受制于 shouldComponentUpdate 函数，因此当 consumer 组件在其祖先组件退出更新的情况下也能更新。


```
// new version
const { Provider, Consumer } = React.createContext('defaultValue')

const Parent = (props) => (
  <Provider value={'realValue'}>
    {props.children}
  </Provider>
)

const Child = () => {
  <Consumer>
    {
      (value) => <p>{value}</p>
    }
  </Consumer>
}


```

## Class.contextType

挂载在 class 上的 contextType 属性会被重赋值为一个由 React.createContext() 创建的 Context 对象。这能让你使用 this.context 来消费最近 Context 上的那个值。你可以在任何生命周期中访问到它，包括 render 函数中。

```
class MyClass extends React.Component {
  componentDidMount() {
    let value = this.context;
    /* 在组件挂载完成后，使用 MyContext 组件的值来执行一些有副作用的操作 */
  }
  componentDidUpdate() {
    let value = this.context;
    /* ... */
  }
  componentWillUnmount() {
    let value = this.context;
    /* ... */
  }
  render() {
    let value = this.context;
    /* 基于 MyContext 组件的值进行渲染 */
  }
}
MyClass.contextType = MyContext;
```

## 在嵌套组件中更新 Context

从一个在组件树中嵌套很深的组件中更新 context 是很有必要的。
在这种场景下，你可以通过 context 传递一个函数，使得 consumers 组件更新 context：

```
this.toggleTheme = () => {
      this.setState(state => ({
        theme:
          state.theme === themes.dark
            ? themes.light
            : themes.dark,
      }));
    };

    // State 也包含了更新函数，因此它会被传递进 context provider。
    this.state = {
      theme: themes.light,
      toggleTheme: this.toggleTheme,
    };
  }

  render() {
    // 整个 state 都被传递进 provider
    return (
      <ThemeContext.Provider value={this.state}>
        <Content />
      </ThemeContext.Provider>
    );
  }
```

## 嵌套Consumer,消费多个 context

利用Consumer组件多重嵌套回调，每一层拿到对应的context的值

```
// Theme context，默认的 theme 是 “light” 值
const ThemeContext = React.createContext('light');

// 用户登录 context
const UserContext = React.createContext({
  name: 'Guest',
});

class App extends React.Component {
  render() {
    const {signedInUser, theme} = this.props;

    // 提供初始 context 值的 App 组件
    return (
      <ThemeContext.Provider value={theme}>
        <UserContext.Provider value={signedInUser}>
          <Layout />
        </UserContext.Provider>
      </ThemeContext.Provider>
    );
  }
}

function Layout() {
  return (
    <div>
      <Sidebar />
      <Content />
    </div>
  );
}

// 一个组件可能会消费多个 context
function Content() {
  return (
    <ThemeContext.Consumer>
      {theme => (
        <UserContext.Consumer>
          {user => (
            <ProfilePage user={user} theme={theme} />
          )}
        </UserContext.Consumer>
      )}
    </ThemeContext.Consumer>
  );
}
```