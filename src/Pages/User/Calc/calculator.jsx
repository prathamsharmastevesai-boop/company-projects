import { useState } from "react";

export const Calc = () => {
  const [input, setInput] = useState("");

  const handleClick = (value) => {
    setInput(input + value);
  };

  const clearInput = () => {
    setInput("");
  };

  const calculate = () => {
    try {
      const result = Function(`"use strict"; return (${input})`)();
      setInput(String(result));
    } catch {
      setInput("Error");
    }
  };

  return (
    <>
      <div
        className="header-bg {
-bg d-flex justify-content-start px-3 align-items-center sticky-header"
      >
        <h5 className="mb-0 text-light">Calculator</h5>
      </div>
      <div
        style={{
          width: "250px",
          padding: "20px",
          borderRadius: "12px",
          background: "white",
          margin: "20px auto",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
          border: "1px solid #eee",
        }}
      >
        <input
          value={input}
          readOnly
          style={{
            width: "100%",
            height: "55px",
            fontSize: "22px",
            marginBottom: "15px",
            textAlign: "right",
            padding: "10px",
            background: "#f7f7f7",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "12px",
          }}
        >
          {[
            "7",
            "8",
            "9",
            "/",
            "4",
            "5",
            "6",
            "*",
            "1",
            "2",
            "3",
            "-",
            "0",
            ".",
            "=",
            "+",
          ].map((btn) => (
            <button
              key={btn}
              onClick={() => (btn === "=" ? calculate() : handleClick(btn))}
              style={{
                padding: "15px",
                fontSize: "20px",
                borderRadius: "10px",
                border: "none",
                background: btn === "=" ? "#007bff" : "#f0f0f0",
                color: btn === "=" ? "white" : "black",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              {btn}
            </button>
          ))}

          <button
            onClick={clearInput}
            style={{
              gridColumn: "span 4",
              padding: "14px",
              fontSize: "20px",
              background: "#ff4444",
              color: "white",
              borderRadius: "10px",
              border: "none",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Clear
          </button>
        </div>
      </div>
    </>
  );
};
