import React from "react";
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

const store = createStore(todoApp);

//functional component
//children从哪里传入的？
const FilterLink = ({ filter, currentFilter, children, onClick }) => {
  if (filter === currentFilter) {
    return <span>{children}</span>;
  }
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick(filter);
      }}
    >
      {children}
    </a>
  );
};

const Footer = ({ visibilityFilter, onFilterClick }) => (
  <p>
    Show:
    <FilterLink
      filter="SHOW_ALL"
      currentFilter={visibilityFilter}
      onClick={onFilterClick}
    >
      All
    </FilterLink>{" "}
    <FilterLink
      filter="SHOW_ACTIVE"
      currentFilter={visibilityFilter}
      onClick={onFilterClick}
    >
      Active
    </FilterLink>{" "}
    <FilterLink
      filter="SHOW_COMPLETED"
      currentFilter={visibilityFilter}
      onClick={onFilterClick}
    >
      Completed
    </FilterLink>
  </p>
);

//todo functional component, presentational component
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

const AddTodo = ({ onAddClick }) => {
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
          onAddClick(input.value);
          input.value = "";
        }}
      >
        Add Todo
      </button>
    </div>
  );
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

let nextTodoId = 0;

//class component
class TodoApp extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { todos, visibilityFilter } = this.props;
    //call the function to filter the todos before rendering them
    const visibleTodos = getVisibleTodos(todos, visibilityFilter);
    return (
      <div>
        <AddTodo
          onAddClick={(text) =>
            store.dispatch({
              type: "ADD_TODO",
              id: nextTodoId,
              text,
            })
          }
        />
        <TodoList
          todos={visibleTodos}
          onTodoClick={(id) =>
            store.dispatch({
              type: "TOGGLE_TODO",
              id,
            })
          }
        />
        <Footer
          visibilityFilter={visibilityFilter}
          onFilterClick={(filter) =>
            store.dispatch({
              type: "SET_VISIBILITY_FILTER",
              filter,
            })
          }
        />
      </div>
    );
  }
}

const render = () => {
  ReactDOM.render(
    <TodoApp {...store.getState()} />,
    // todos={store.getState().todos}
    // visibilityFilter={store.getState().visibilityFilter}
    document.getElementById("root")
  );
};

store.subscribe(render);
render();

//太美了！
