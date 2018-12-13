import React from "react";
import ReactGridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ReactGridTest = () => {
  var layout = [
    { i: "a", x: 0, y: 0, w: 1, h: 2, static: true },
    { i: "b", x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
    { i: "c", x: 4, y: 0, w: 1, h: 2 }
  ];
  return (
    <ReactGridLayout
      style={{ border: "2px solid red" }}
      cols={1}
      rowHeight={30}
      width={100}
      autoSize
      verticalCompact
      compactType={"horizontal"}
      isResizable={false}
      preventCollision={false}
      onLayoutChange={(...args) => {
        console.log(args);
      }}
    >
      <div key="a" data-grid={{ x: 0, y: 0, w: 1, h: 1 }}>
        a
      </div>
      <div key="b" data-grid={{ x: 0, y: 1, w: 1, h: 1 }}>
        b
      </div>
      <div key="c" data-grid={{ x: 4, y: 2, w: 1, h: 1 }}>
        c
      </div>
    </ReactGridLayout>
  );
};

export default ReactGridTest;

export const Usage = () => <span>123</span>;
