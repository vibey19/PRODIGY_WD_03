import React, { useState } from "react";

const Button = ({ primary, children, onClick }) => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    onClick();
  };

  return (
    <button
      className={`button${primary ? " primary" : ""}${
        clicked ? " clicked" : ""
      }`}
      onClick={handleClick}
    >
      {children}
      {!clicked && <span className="ripple"></span>}
    </button>
  );
};

export default Button;
