import React from "react";
import ReactDOM from "react-dom";
import { Usage as LoadingSpanUsage } from "./LoadingSpan.js";
import { Usage as PaginationTableUsage } from "./PaginationTable";
import { Usage2 as PaginationTableUsage2 } from "./PaginationTable";
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
class ParentComponent extends React.Component {
  constructor() {
    super();

    this.state = {
      data: [
        {
          id: 1,
          date: "2014-04-18",
          total: 121.0,
          status: "Shipped",
          name: "A",
          points: 5,
          percent: 50
        },
        {
          id: 2,
          date: "2014-04-21",
          total: 121.0,
          status: "Not Shipped",
          name: "B",
          points: 10,
          percent: 60
        },
        {
          id: 3,
          date: "2014-08-09",
          total: 121.0,
          status: "Not Shipped",
          name: "C",
          points: 15,
          percent: 70
        },
        {
          id: 4,
          date: "2014-04-24",
          total: 121.0,
          status: "Shipped",
          name: "D",
          points: 20,
          percent: 80
        },
        {
          id: 5,
          date: "2014-04-26",
          total: 121.0,
          status: "Shipped",
          name: "E",
          points: 25,
          percent: 90
        }
      ],
      expandedRows: []
    };
  }

  handleRowClick(rowId) {
    const currentExpandedRows = this.state.expandedRows;
    const isRowCurrentlyExpanded = currentExpandedRows.includes(rowId);

    const newExpandedRows = isRowCurrentlyExpanded
      ? currentExpandedRows.filter(id => id !== rowId)
      : currentExpandedRows.concat(rowId);

    this.setState({ expandedRows: newExpandedRows });
  }

  renderItem(item) {
    const clickCallback = () => this.handleRowClick(item.id);
    const itemRows = [
      <tr onClick={clickCallback} key={"row-data-" + item.id}>
        <td>{item.date}</td>
        <td>{item.total}</td>
        <td>{item.status}</td>
      </tr>
    ];

    if (this.state.expandedRows.includes(item.id)) {
      itemRows.push(
        <tr key={"row-expanded-" + item.id}>
          <td>{item.name}</td>
          <td>{item.points}</td>
          <td>{item.percent}</td>
        </tr>
      );
    }

    return itemRows;
  }

  render() {
    let allItemRows = [];

    this.state.data.forEach(item => {
      const perItemRows = this.renderItem(item);
      allItemRows = allItemRows.concat(perItemRows);
    });

    return <table>{allItemRows}</table>;
  }
}

function App() {
  return (
    <div className="App">
      <MyDiv title={"qqq"}>
        <ParentComponent />
      </MyDiv>

      <MyDiv title={"EditableText"}>
        <EditableText />
        <EditableText2 />
      </MyDiv>

      {/** <LayoutProblem /> */}

      <MyDiv title={"PaginationTableUsage2 ( render props )"}>
        <PaginationTableUsage2 />
      </MyDiv>

      <MyDiv title={"PaginationTableUsage"}>
        <PaginationTableUsage />
      </MyDiv>

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
