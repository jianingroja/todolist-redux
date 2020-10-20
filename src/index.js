import React from "react";
import PropTypes from "prop-types";
// //注意：
// 从 React v15.5 开始 ，
// React.PropTypes 助手函数已被弃用，
// 我们建议使用 prop-types 库 来定义contextTypes。
import ReactDOM from "react-dom";
//import Redux from "redux";
import { createStore } from "redux";
import { combineReducers } from "redux";

//reducer一号的孩子
const todo = (state, action) => {
  switch (action.type) {
    case "ADD_TODO":
      return {
        id: action.id,
        text: action.text,
        completed: false,
      };
    case "TOGGLE_TODO":
      if (state.id !== action.id) {
        return state;
      }

      return {
        ...state,
        completed: !state.completed,
      };
    default:
      return state;
  }
};

//reducer一号
const todos = (state = [], action) => {
  switch (action.type) {
    case "ADD_TODO":
      return [
        ...state,
        //undefined?
        todo(undefined, action),
      ];
    case "TOGGLE_TODO":
      return state.map((t) => todo(t, action));
    default:
      return state;
  }
};

//reducer二号
const visibilityFilter = (state = "SHOW_ALL", action) => {
  switch (action.type) {
    case "SET_VISIBILITY_FILTER":
      return action.filter;
    default:
      return state;
  }
};

//reducer大家庭
const todoApp = combineReducers({
  todos,
  visibilityFilter,
});
//为什么不写 {
//  todos:todos,
//  visibilityFilter:visibilityFilter
//  } 一开始写了又删掉了 15集

//presentational component
// provides data and behavior to presentational component
//children从哪里传入的？
const Link = ({ active, children, onClick }) => {
  if (active) {
    return <span>{children}</span>;
  }
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      {children}
    </a>
  );
};

//container component
class FilterLink extends React.Component {
  //到底要不要写这个？
  //此处有props
  //在render里面接受props好像就不用写？
  // constructor(props) {
  //   super(props);
  // }
  componentDidMount() {
    const { store } = this.context;
    this.unsubscribe = store.subscribe(() => this.forceUpdate());
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const props = this.props;
    const { store } = this.context;
    const state = store.getState();

    return (
      <Link
        active={props.filter === state.visibilityFilter}
        onClick={() =>
          store.dispatch({
            type: "SET_VISIBILITY_FILTER",
            filter: props.filter,
          })
        }
      >
        {props.children}
      </Link>
    );
  }
}
FilterLink.contextTypes = {
  store: PropTypes.object,
};

const Footer = () => (
  //这里<FilterLink />居然写三遍，如何简化？
  <p>
    Show:
    <FilterLink filter="SHOW_ALL">All</FilterLink>
    {", "}
    <FilterLink filter="SHOW_ACTIVE">Active</FilterLink>
    {", "}
    <FilterLink filter="SHOW_COMPLETED">Completed</FilterLink>
  </p>
);

//todo functional component, presentational component
//doesn't specify any behavior
//doesn't know what to do
//specifies how the component looks in different cases
const Todo = ({ onClick, completed, text }) => (
  <li
    onClick={onClick}
    style={{
      textDecoration: completed ? "line-through" : "none",
    }}
  >
    {text}
  </li>
);

//presentational component
const TodoList = ({ todos, onTodoClick }) => (
  <ol>
    {todos.map((todo) => (
      <Todo key={todo.id} {...todo} onClick={() => onTodoClick(todo.id)} />
    ))}
  </ol>
);

const AddTodo = (props, { store }) => {
  let input;
  return (
    <div>
      <input
        ref={(node) => {
          input = node;
        }}
      />
      <button
        onClick={() => {
          store.dispatch({
            type: "ADD_TODO",
            id: nextTodoId++,
            text: input.value,
          });
          input.value = "";
        }}
      >
        Add Todo
      </button>
    </div>
  );
};
AddTodo.contextTypes = {
  store: PropTypes.object,
};

const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case "SHOW_ALL":
      return todos;
    case "SHOW_COMPLETED":
      return todos.filter((t) => t.completed);
    case "SHOW_ACTIVE":
      return todos.filter((t) => !t.completed);
    default:
      return todos;
  }
};

//to connect a presentational component to the redux store
class VisibleTodoList extends React.Component {
  //要不要写这个到底？
  //此处无props
  // constructor(props) {
  //   super(props);
  // }

  componentDidMount() {
    const { store } = this.context;
    this.unsubscribe = store.subscribe(() => this.forceUpdate());
  }

  componentWillUnmount() {
    this.unsubscribe();
  }
  render() {
    const props = this.props;
    const { store } = this.context;
    //要放在中间，否则 cannot access 'store' before initialization
    const state = store.getState();

    return (
      <TodoList
        todos={getVisibleTodos(state.todos, state.visibilityFilter)}
        onTodoClick={(id) =>
          store.dispatch({
            type: "TOGGLE_TODO",
            id,
          })
        }
      />
    );
  }
}
VisibleTodoList.contextTypes = {
  store: PropTypes.object,
};

let nextTodoId = 0;

//single container component
//specifies behavior
//Dan abramov prefers to turn class components into functional components when possible
const TodoApp = () => (
  <div>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
);

class Provider extends React.Component {
  getChildContext() {
    return {
      store: this.props.store,
    };
  }
  render() {
    return this.props.children;
  }
}
Provider.childContextTypes = {
  store: PropTypes.object,
}; // absolutely required

ReactDOM.render(
  <Provider store={createStore(todoApp)}>
    <TodoApp />
  </Provider>,
  document.getElementById("root")
);

//Dan Abramov suggestions:
//1. extracting presentational components
//if there is too much props to pass then
//2. write container components around to specifies the behavior and reduce the complexity
