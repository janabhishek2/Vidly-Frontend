import React, { Component } from "react";
const Input = (props) => {
  const { name, label, type, error, onChange, value } = props;

  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        onChange={onChange}
        value={value}
        name={name}
        className="form-control"
        type={type}
        id={name}
      />
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default Input;
