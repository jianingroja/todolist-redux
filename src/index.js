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
const FilterLink = ({ filter, currentFilter, children }) => {
  if (filter === currentFilter) {
    return <span>{children}</span>;
  }
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        store.dispatch({
          type: "SET_VISIBILITY_FILTER",
          filter,
        });
      }}
    >
      {children}
    </a>
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
        <input
          ref={(node) => {
            this.input = node;
          }}
        />
        <button
          onClick={() => {
            store.dispatch({
              type: "ADD_TODO",
              text: this.input.value,
              id: nextTodoId++,
            });
            this.input.value = "";
          }}
        >
          Add Todo
        </button>
        <ol>
          {visibleTodos.map((todo) => (
            <li
              key={todo.id}
              onClick={() => {
                store.dispatch({
                  type: "TOGGLE_TODO",
                  id: todo.id,
                });
              }}
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
              }}
            >
              {todo.text}
            </li>
          ))}
        </ol>
        <p>
          Show:
          <FilterLink filter="SHOW_ALL" currentFilter={visibilityFilter}>
            All
          </FilterLink>{" "}
          <FilterLink filter="SHOW_ACTIVE" currentFilter={visibilityFilter}>
            Active
          </FilterLink>{" "}
          <FilterLink filter="SHOW_COMPLETED" currentFilter={visibilityFilter}>
            Completed
          </FilterLink>
        </p>
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
