import React from "react";
import { connect } from "react-redux";
import { addTodo } from "../actions/index"; //action creator

// either presentational or container component

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
          if (!input.value.trim()) {
            return;
          }
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

export default AddTodo;

// const AddTodo = ({ dispatch }) => {
//   let input;

//   return (
//     <div>
//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           if (!input.value.trim()) {
//             return;
//           }
//           dispatch(addTodo(input.value));
//           input.value = "";
//         }}
//       >
//         <input ref={(node) => (input = node)} />
//         <button type="submit">Add Todo</button>
//       </form>
//     </div>
//   );
// };
