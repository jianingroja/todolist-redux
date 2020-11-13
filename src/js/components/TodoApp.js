import React from "react";
import AddTodo from "../containers/AddTodo";
import VisibleTodoList from "../containers/VisibleTodoList";
import Footer from "./Footer";
import "./app.css";

//Dan abramov prefers to turn class components into functional components when possible
const TodoApp = () => (
  <div className="app">
    <h2>Todo Now</h2>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
);

export default TodoApp;
