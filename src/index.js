import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "./js/reducers/index";
import TodoApp from "./js/components/TodoApp";
import "./index.css";

const store = createStore(rootReducer);

ReactDOM.render(
  <Provider store={store}>
    <TodoApp />
  </Provider>,
  document.getElementById("root")
);

//Dan Abramov suggestions:
//1. extracting presentational components
//if there is too much props to pass then
//2. write container components around to specifies the behavior and reduce the complexity
