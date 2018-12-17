import React from "react";
import ReactDOM from "react-dom";
import { Usage as LoadingSpanUsage } from "./LoadingSpan.js";
import { Usage as PaginationTableUsage } from "./PaginationTable";
import { Usage2 as PaginationTableUsage2 } from "./PaginationTable";
import { Usage3 as PaginationTableUsage3 } from "./PaginationTable";
import { Usage4 as PaginationTableUsage4 } from "./PaginationTable";
// import LayoutProblem from "./LayoutProblem.js";
import { Usage as OrderableList } from "./OrderableList";

import { Usage as EditableText } from "./EditableText.js";

import { Usage2 as EditableText2 } from "./EditableText.js";

import { Usage as VerticalMenu } from "./VerticalMenu.js";

import { Usage as ReactGridTest } from "./ReactGridTest.js";

import { Usage as BlurOverlay } from "./BlurOverlay.js";

import { Usage as RenderModal } from "./RenderModalBoilerplate/index.js";
//test

const MyDiv = ({ children, title }) => (
  <div style={{ border: "2px solid black", padding: "10px", margin: "10px" }}>
    {title && <h2>{title}</h2>}
    {children}
  </div>
);

function App() {
  return (
    <div className="App">
      <MyDiv title={"Render Modal"}>
        <RenderModal />
      </MyDiv>
      {/**
         * <MyDiv title={"BlurOverlay"}>
        <BlurOverlay />
      </MyDiv>
         */}

      {/**
      <MyDiv title={"Orderable List"}>
        <OrderableList />
      </MyDiv>
      <MyDiv title={"react grid test"}>
        <ReactGridTest />
      </MyDiv>
       */}
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
