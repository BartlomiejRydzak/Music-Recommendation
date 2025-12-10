import React from "react";

function TabButton({ active, onClick, label }) {
  return (
    <button className={`tab-button ${active ? "active" : ""}`} onClick={onClick}>
      {label}
    </button>
  );
}

export default TabButton;
