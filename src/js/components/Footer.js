import React from "react";
import FilterLink from "../containers/FilterLink";

const Footer = () => (
  //这里<FilterLink />居然写三遍???如何简化？

  <div className="footer">
    {/* <span>Show: </span> */}
    <FilterLink filter="SHOW_ALL">All</FilterLink>

    <FilterLink filter="SHOW_ACTIVE">Active</FilterLink>

    <FilterLink filter="SHOW_COMPLETED">Completed</FilterLink>
  </div>
);

export default Footer;
