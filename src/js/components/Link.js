import React from "react";
import PropTypes from "prop-types";

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

Link.propTypes = {
  active: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
};

// const Link = ({ active, children, onClick }) => (
//   <button
//     onClick={onClick}
//     disabled={active}
//     style={{
//       marginLeft: "4px",
//     }}
//   >
//     {children}
//   </button>
// );

export default Link;
