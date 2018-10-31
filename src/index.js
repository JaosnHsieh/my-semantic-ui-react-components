import React from "react";
import ReactDOM from "react-dom";
import "semantic-ui-css/semantic.min.css";
import { Usage as LoadingSpanUsage } from "./LoadingSpan.js";
import { Usage as PaginationTableUsage } from "./PaginationTable";
import { Usage2 as PaginationTableUsage2 } from "./PaginationTable";
// import LayoutProblem from "./LayoutProblem.js";
import { Usage as OrderSelectableList } from "./OrderSelectableList/";

const MyDiv = ({ children, title }) => (
  <div style={{ border: "2px solid black", padding: "10px", margin: "10px" }}>
    {title && <h2>{title}</h2>}
    {children}
  </div>
);
function App() {
  return (
    <div className="App">
      <MyDiv title={"OrderSelectableList"}>
        <OrderSelectableList />
      </MyDiv>

      {/** <LayoutProblem /> */}
      {/**
      <MyDiv title={"PaginationTableUsage2 ( render props )"}>
        <PaginationTableUsage2 />
      </MyDiv>

      <MyDiv title={"PaginationTableUsage"}>
        <PaginationTableUsage />
      </MyDiv>

      <MyDiv title={"LoadingSpan Usage"}>
        <LoadingSpanUsage />
      </MyDiv>
       */}
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
