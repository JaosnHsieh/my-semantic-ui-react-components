import React from "react";
import ReactDOM from "react-dom";
import { Usage as LoadingSpanUsage } from "./LoadingSpan.js";
import { Usage as PaginationTableUsage } from "./PaginationTable";
import { Usage2 as PaginationTableUsage2 } from "./PaginationTable";

import { Usage3 as PaginationTableUsage3 } from "./PaginationTable";
// import LayoutProblem from "./LayoutProblem.js";
import { Usage as OrderableList } from "./OrderableList";

import { Usage as EditableText } from "./EditableText.js";

import { Usage2 as EditableText2 } from "./EditableText.js";

const MyDiv = ({ children, title }) => (
  <div style={{ border: "2px solid black", padding: "10px", margin: "10px" }}>
    {title && <h2>{title}</h2>}
    {children}
  </div>
);

function App() {
  return (
    <div className="App">
      <MyDiv title={"PaginationTableUsage3 ( accordion Row )"}>
        <PaginationTableUsage3 />
      </MyDiv>
      <MyDiv title={"PaginationTableUsage2 ( render props )"}>
        <PaginationTableUsage2 />
      </MyDiv>
      {/**
      <MyDiv title={"PaginationTableUsage"}>
        <PaginationTableUsage />
      </MyDiv>

 */}

      <MyDiv title={"EditableText"}>
        <EditableText />
        <EditableText2 />
      </MyDiv>

      {/** <LayoutProblem /> */}

      {/**
      <MyDiv title={"LoadingSpan Usage"}>
        <LoadingSpanUsage />
      </MyDiv>
       */}
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
