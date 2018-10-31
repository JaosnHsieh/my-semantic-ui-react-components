import React from "react";
import ReactDOM from "react-dom";
import "semantic-ui-css/semantic.min.css";
import "./styles.css";
import { Usage } from "./LoadingSpan.js";
import { Usage as PaginationTableUsage } from "./PaginationTable";

function App() {
  return (
    <div className="App">
      <Usage />

      <h1> PaginationTable Usage </h1>
      <PaginationTableUsage />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
