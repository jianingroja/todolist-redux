//action creator
let nextTodoId = 0;
export const addTodo = (text) => {
  return {
    type: "ADD_TODO",
    id: nextTodoId++,
    text: text,
  };
};

//action creator
export const setVisibilityFilter = (filter) => {
  return {
    type: "SET_VISIBILITY_FILTER",
    filter,
  };
};

//action creator
export const toggleTodo = (id) => {
  return {
    type: "TOGGLE_TODO",
    id,
  };
};

//这里还有一个visibilityfilter的升级版本要写
