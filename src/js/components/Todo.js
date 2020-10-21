import React from "react";
import PropTypes from "prop-types";

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

Todo.propTypes = {
  onClick: PropTypes.func.isRequired,
  completed: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
};

export default Todo;
