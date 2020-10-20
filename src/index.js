import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { connect } from "react-redux";
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

//sction creator
const setVisibilityFilter = (filter) => {
  return {
    type: "SET_VISIBILITY_FILTER",
    filter,
  };
};
const mapStateToLinkProps = (state, ownProps) => {
  return {
    active: ownProps.filter === state.visibilityFilter,
  };
};
const mapDispatchToLinkProps = (dispatch, ownProps) => {
  return {
    onClick: () => {
      dispatch(setVisibilityFilter(ownProps.filter));
    },
  };
};
const FilterLink = connect(mapStateToLinkProps, mapDispatchToLinkProps)(Link);

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

//action creator
let nextTodoId = 0;
const addTodo = (text) => {
  return {
    type: "ADD_TODO",
    id: nextTodoId++,
    text: text,
  };
};

let AddTodo = ({ dispatch }) => {
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
          dispatch(addTodo(input.value));
          input.value = "";
        }}
      >
        Add Todo
      </button>
    </div>
  );
};
AddTodo = connect()(AddTodo);

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

//action creator
const toggleTodo = (id) => {
  return {
    type: "TOGGLE_TODO",
    id,
  };
};
const mapStateToTodoListProps = (state) => {
  return {
    todos: getVisibleTodos(state.todos, state.visibilityFilter),
  };
};
const mapDispatchToTodoListProps = (dispatch) => {
  return {
    onTodoClick: (id) => dispatch(toggleTodo(id)),
  };
};
const VisibleTodoList = connect(
  mapStateToTodoListProps,
  mapDispatchToTodoListProps
)(TodoList);

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
