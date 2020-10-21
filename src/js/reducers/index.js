import { combineReducers } from "redux";
import todos from "./todos";
import visibilityFilter from "./visibilityFilter";

//reducer大家庭
const rootReducer = combineReducers({
  todos,
  visibilityFilter,
});

//为什么不写 {
//  todos:todos,
//  visibilityFilter:visibilityFilter
//  } 一开始写了又删掉了 15集

export default rootReducer;
